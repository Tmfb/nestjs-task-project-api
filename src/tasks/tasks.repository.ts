import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { Result, ResultStates } from 'src/result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../auth/users.repository';
import { ProjectsRepository } from '../projects/projects.repository';

@Injectable()
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository', { timestamp: true });

  constructor(
    private dataSource: DataSource,
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    @InjectRepository(ProjectsRepository)
    private projectsRepository: ProjectsRepository,
  ) {
    super(Task, dataSource.createEntityManager());
  }

  //Database logic

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Result> {
    const { title, description, resolverUserId, projectId } = createTaskDto;
    const task: Task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      admin: user,
      resolver: user,
    });

    // Checking if provided resolverUser exists
    if (resolverUserId) {
      try {
        const found = await this.usersRepository.findOne({
          where: {
            id: resolverUserId,
          },
        });
        if (!found) {
          return new Result(ResultStates.ERROR, {
            message: `User with id ${resolverUserId} not found`,
            statusCode: HttpStatus.NOT_FOUND,
          });
        }
        task.resolver = found;
      } catch (error) {
        return new Result(ResultStates.ERROR, {
          message: error.message,
          statusCode: error.statusCode,
        });
      }
    }

    // Checking if provided projecId exists
    if (projectId) {
      try {
        const found = await this.projectsRepository.findOne({
          where: {
            id: projectId,
          },
        });
        if (!found) {
          return new Result(ResultStates.ERROR, {
            message: `Project with id ${projectId} not found`,
            statusCode: HttpStatus.NOT_FOUND,
          });
        }
        task.project = found;
      } catch (error) {
        return new Result(ResultStates.ERROR, {
          message: error.message,
          statusCode: error.statusCode,
        });
      }
    }

    try {
      await this.save(task);
    } catch (error) {
      this.logger.error(
        `Failed to save new task: ${task} owned by User: ${user}`,
        error.stack,
      );
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }
    return new Result(ResultStates.OK, task);
  }

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Result> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');
    query.where([{ admin: user }, { resolver: user }]);
    //status filter
    if (status) {
      query.andWhere({ status: status });
    }

    //search pattern matching
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return new Result(ResultStates.OK, tasks);
    } catch (error) {
      this.logger.error(
        `Failed to fetch tasks for User "${
          user.username
        }". Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }
  }

  async getTaskById(id: string, user: User): Promise<Result> {
    let found: Task;

    try {
      found = await this.findOne({
        where: [
          { admin: user, id: id },
          { resolver: user, id: id },
        ],
        relations: { admin: true, resolver: true, project: true },
      });
    } catch (error) {
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }

    if (!found) {
      return new Result(ResultStates.ERROR, {
        message: `Task with id ${id} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    return new Result(ResultStates.OK, found);
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Result> {
    const result = await this.getTaskById(id, user);

    // Check for errors retrieving the task
    if (result.state == ResultStates.ERROR) {
      return result;
    }

    //  Modify the encapsulated task in result.data
    result.data.status = status;
    // Update the database
    try {
      this.save(result.data);
      return result;
    } catch (error) {
      // Log any error and foward it to the controller encapsulated in a Result
      this.logger.error(
        `Failed to update status of task with id ${id}`,
        error.stack,
      );

      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }
  }

  async updateTaskResolver(
    id: string,
    resolver: string,
    user: User,
  ): Promise<Result> {
    let found;
    const query = this.createQueryBuilder('task');
    query.where({ admin: user });
    query.andWhere({ id: id });

    // Try fetching the task if it exists and authed user is admin
    try {
      found = await query.getOne();
    } catch (error) {
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }

    // If Query returns empty either task doesn't exist or authed user is not admin
    if (!found) {
      return new Result(ResultStates.ERROR, {
        message: `Task with id ${id} not found or you don't have permision to modify it's resolver`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // Modify task resolver
    found.resolver = resolver;

    // Update the database
    try {
      this.save(found);
      return new Result(ResultStates.OK, found);
    } catch (error) {
      // Log any error and foward it to the controller encapsulated in a Result
      this.logger.error(
        `Failed to update resolver of task with id ${id}`,
        error.stack,
      );
      return new Result(ResultStates.ERROR, {
        message: `Failed to update project of task with id ${id}`,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateTaskProject(
    id: string,
    projectId: string,
    user: User,
  ): Promise<Result> {
    let foundTask, foundProject;

    // Try fetching the task if it exists and authed user is admin
    try {
      foundTask = await this.findOne({
        where: { admin: user, id: id },
      });
    } catch (error) {
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }

    // If find returns empty either task doesn't exist or authed user is not admin
    if (!foundTask) {
      return new Result(ResultStates.ERROR, {
        message: `Task with id ${id} not found or you don't have permision to modify it's project`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // Try fetching the project
    try {
      foundProject = await this.projectsRepository.findOne({
        where: { id: projectId, admin: user },
        relations: { tasks: true },
      });
    } catch (error) {
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }

    // If find returns empty either project doesn't exist or authed user is not admin
    if (!foundProject) {
      return new Result(ResultStates.ERROR, {
        message: `Project with id ${projectId} not found or you don't have permision to modify it's tasks`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // Initialice project.tasks if the project is empty
    if (!foundProject.tasks) {
      foundProject.tasks = [];
    }

    // Check if the task already belongs to the project
    if (
      foundProject.tasks.some((task) => {
        return task.id == foundTask.id;
      })
    ) {
      return new Result(ResultStates.ERROR, {
        message: `Task with id ${id} already belongs to project with id ${projectId}`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    // Add task to project.tasks, cascade will update task.project on save
    foundProject.tasks.push(foundTask);
    foundTask.project = foundProject;
    // Update the database
    try {
      this.projectsRepository.save(foundProject);
      return new Result(ResultStates.OK, foundTask);
    } catch (error) {
      // Log any error and foward it to the controller encapsulated in a Result
      this.logger.error(
        `Failed to update project of task with id ${id}`,
        error.stack,
      );
      return new Result(ResultStates.ERROR, {
        message: `Failed to update project of task with id ${id}`,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}

import { HttpStatus, Injectable } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Result, ResultStates } from '../result.dto';
import { ProjectsRepository } from '../projects/projects.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
    @InjectRepository(ProjectsRepository)
    private projectsRepository: ProjectsRepository,
    private tasksRepository: TasksRepository,
    @InjectRepository(ProjectsRepository)
    private projectsRepository: ProjectsRepository,
  ) {}

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Result> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Result> {
    let foundTask;
    // Fetch task

    try {
      foundTask = await this.tasksRepository.find({
        where: [
          { id: id, admin: user },
          { id: id, resolver: user },
        ],
        relations: { project: true },
      });
    } catch (error) {
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }
    // If query returns empty either auth user is not admin or task doesn't exist
    if (!foundTask) {
      return new Result(ResultStates.ERROR, {
        message: `Task with id ${id} not found or you are not authorized`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    // Return task encapsulated in a result Object
    return new Result(ResultStates.OK, foundTask);
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Result> {
    return await this.tasksRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string, user: User): Promise<Result> {
    const removed = await this.tasksRepository.delete({ id: id, admin: user });

    if (removed.affected === 0) {
      return new Result(ResultStates.ERROR, {
        message: `Task with ID " ${id}" not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
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
      this.tasksRepository.save(result.data);
    } catch (error) {
      // Log any error and foward it to the controller encapsulated in a Result
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }
    return result;
    const result = await this.getTaskById(id, user);

    // Check for errors retrieving the task
    if (result.state == ResultStates.ERROR) {
      return result;
    }

    //  Modify the encapsulated task in result.data
    result.data.status = status;

    // Update the database
    try {
      this.tasksRepository.save(result.data);
    } catch (error) {
      // Log any error and foward it to the controller encapsulated in a Result
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }
    return result;
  }

  async updateTaskResolver(
    id: string,
    resolver: string,
    user: User,
  ): Promise<Result> {
    return this.tasksRepository.updateTaskResolver(id, resolver, user);
  }

  async updateTaskProject(
    id: string,
    projectId: string,
    user: User,
  ): Promise<Result> {
    let foundTask, foundProject;

    // Fetch Task
    try {
      foundTask = await this.tasksRepository.find({
        where: { id: id, admin: user },
        relations: {
          project: true,
        },
      });
    } catch (error) {
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }

    // If query returns empty either auth user is not admin or task doesn't exist
    if (!foundTask) {
      return new Result(ResultStates.ERROR, {
        message: `Task with id ${id} not found or you dont have permision to modify it's project`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // Fetch Project
    try {
      foundProject = await this.projectsRepository.find({
        where: { id: projectId },
        relations: { tasks: true },
      });
    } catch (error) {
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }

    // If query returns empty project doesn't exist
    if (!foundProject) {
      return new Result(ResultStates.ERROR, {
        message: `Project with id ${projectId} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    // Check if task already belongs to the project
    if (
      foundProject.tasks.some((task: Task) => {
        return task.id == foundTask.id;
      })
    ) {
      return new Result(ResultStates.ERROR, {
        message: `Task with id ${id} belongs already to project ${projectId}`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    //

    return this.updateTaskProject(id, projectId, user);
  }
}

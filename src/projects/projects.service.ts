import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsRepository } from './projects.repository';
import { Result, ResultStates } from '../result.dto';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';

import { TasksRepository } from '../tasks/tasks.repository';
import { Project } from './project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsRepository)
    private projectsRepository: ProjectsRepository,
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  // Create a project
  async createProject(
    createProjectDto: CreateProjectDto,
    user: User,
  ): Promise<Result> {
    const { title, description } = createProjectDto;
    const project: Project = this.projectsRepository.create({
      title: title,
      description: description,
      admin: user,
      members: [user],
      tasks: [],
    });

    try {
      this.projectsRepository.save(project);
      return new Result(ResultStates.OK, project);
    } catch (error) {
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }
  }

  // Get all projects with optional filters
  async getProjects(
    filterDto: GetProjectsFilterDto,
    user: User,
  ): Promise<Result> {
    return this.projectsRepository.getProjects(filterDto, user);
  }

  // Get project by Id
  async getProjectById(id: string, user: User): Promise<Result> {
    let foundProject: Project;

    // Fetch project from database
    try {
      foundProject = await this.projectsRepository.findOne({
        where: { id: id },
        relations: { members: true, tasks: true, admin: true },
      });
    } catch (error) {
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }
    console.log(foundProject);
    // If query comes back empty Project doesn't exist
    if (!foundProject) {
      return new Result(ResultStates.ERROR, {
        message: `Project with id ${id} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    // Return project in a Result if auth user is a member
    if (
      foundProject.members.some((member) => {
        return member.id == user.id;
      })
    ) {
      return new Result(ResultStates.OK, foundProject);
    }

    // Unauthoriced warning
    return new Result(ResultStates.ERROR, {
      message: `You don't have permision to view Project with id ${id} or project not found`,
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }

  // Delete Project
  async deleteProject(id: string, user: User): Promise<Result> {
    return this.projectsRepository.deleteProject(id, user);
  }
}

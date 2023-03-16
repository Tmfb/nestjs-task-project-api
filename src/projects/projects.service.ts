import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
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
    return this.projectsRepository.createProject(createProjectDto, user);
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
    return this.projectsRepository.getProjectById(id, user);
  }

  // Delete Project
  async deleteProject(id: string, user: User): Promise<Result> {
    return this.projectsRepository.deleteProject(id, user);
  }

  async testing(id: string, user: User): Promise<Result> {
    const result = await this.tasksRepository.getTasks(
      { status: null, search: null },
      user,
    );
    const taskList = result.data;
    console.log(taskList);
    const project = await this.projectsRepository.findOne({
      where: {
        id: id,
        admin: user,
      },
    });
    console.log(project);
    project.title = 'this is a test title';
    project.description = "let's hope it works";
    project.members = [user];
    project.tasks = taskList;
    console.log(project);

    await this.projectsRepository.save(project);
    console.log('saved');
    const found = await this.projectsRepository.findOne({
      relations: { tasks: true, members: true },
      where: {
        id: id,
        admin: user,
      },
    });
    console.log(found.tasks);

    return new Result(ResultStates.OK, found);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsRepository } from './projects.repository';
import { Result } from '../result.dto';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsRepository)
    private projectsRepository: ProjectsRepository,
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
}

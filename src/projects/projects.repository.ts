import { Injectable } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { Result, ResultStates } from '../result.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './project.entity';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';

@Injectable()
export class ProjectsRepository extends Repository<Project> {
  constructor(private dataSource: DataSource) {
    super(Project, dataSource.createEntityManager());
  }

  async createProject(
    createProjectDto: CreateProjectDto,
    user: User,
  ): Promise<Result> {
    const { title, description, tasks, users } = createProjectDto;
    const project = this.create({
      title: title,
      description: description,
      admin: user.id,
    });

    try {
      this.save(project);
    } catch (error) {
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }
    return new Result(ResultStates.OK, project);
  }

  async getProjects(
    filterDto: GetProjectsFilterDto,
    user: User,
  ): Promise<Result> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('project');
    query.where('project.admin = :id ', { id: user.id });

    if (search) {
      query.andWhere(
        'LOWER(project.title) LIKE LOWER(:search) OR LOWER(project.description) LIKE LOWER(:search)',
        { search: search },
      );
    }
    let projects = [];

    try {
      projects = await query.getMany();
    } catch (error) {
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }
    return new Result(ResultStates.OK, projects);
  }
}

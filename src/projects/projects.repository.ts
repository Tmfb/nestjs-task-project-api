import { Injectable } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { Result, ResultStates } from '../result.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './project.entity';

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

    const project: Project = this.create({
      title: title,
      description: description,
      tasks: tasks,
      admin: user,
      users: users,
    });

    try {
      this.save(project);
    } catch (error) {
      return new Result(ResultStates.ERROR, error);
    }
    return new Result(ResultStates.OK, project);
  }
}

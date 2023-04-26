import { Injectable } from "@nestjs/common";
import { User } from "../users/user.entity";
import { Result, ResultStates } from "../result.dto";
import { DataSource, Repository } from "typeorm";
import { CreateProjectDto } from "./dto/create-project.dto";
import { Project } from "./project.entity";
import { GetProjectsFilterDto } from "./dto/get-projects-filter.dto";
import { HttpStatus } from "@nestjs/common/enums";
import { TasksRepository } from "../tasks/tasks.repository";

@Injectable()
export class ProjectsRepository extends Repository<Project> {
  constructor(private dataSource: DataSource) {
    super(Project, dataSource.createEntityManager());
  }

  async createProject(
    createProjectDto: CreateProjectDto,
    user: User
  ): Promise<Result> {
    const { title, description } = createProjectDto;
    const project: Project = this.create({
      title: title,
      description: description,
      admin: user,
      members: [],
      tasks: [],
    });

    try {
      this.save(project);
    } catch (error) {
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }
  }

  async getProjects(
    filterDto: GetProjectsFilterDto,
    user: User
  ): Promise<Result> {
    const { search } = filterDto;
    const query = this.createQueryBuilder("project");
    query.where("project.admin = :adminId ", { adminId: user.id });

    if (search) {
      query.andWhere(
        "LOWER(project.title) LIKE LOWER(:search) OR LOWER(project.description) LIKE LOWER(:search)",
        { search: search }
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

  async deleteProject(projectId: string, user: User): Promise<Result> {
    let foundProject: Project;

    try {
      foundProject = await this.findOne({
        where: { id: projectId, admin: user },
        relations: { members: true },
      });
    } catch (error) {
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }

    // If query returned emtpy either project doesn't exist or authed user is not admin
    if (!foundProject) {
      return new Result(ResultStates.ERROR, {
        message: `Project with ${projectId} not found or aren't authoriced to change it's members`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    // Clear relationships 
    foundProject.tasks = [];
    foundProject.members = [];
    await this.save(foundProject);
    // Delete from db
    await this.delete({ id: foundProject.id });

    return new Result(ResultStates.OK);
  }
}

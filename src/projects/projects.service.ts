import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/user.entity";
import { CreateProjectDto } from "./dto/create-project.dto";
import { ProjectsRepository } from "./projects.repository";
import { Result, ResultStates } from "../result.dto";
import { GetProjectsFilterDto } from "./dto/get-projects-filter.dto";

import { TasksRepository } from "../tasks/tasks.repository";
import { Project } from "./project.entity";
import { UsersRepository } from "../auth/auth.repository";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsRepository)
    private projectsRepository: ProjectsRepository,
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository
  ) {}

  // Create a project
  async createProject(
    createProjectDto: CreateProjectDto,
    user: User
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
    user: User
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
        relations: { admin: true, members: true, tasks: true },
      });
    } catch (error) {
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }

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
      }) ||
      foundProject.admin.id == user.id
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

  // Add member to Project
  async addMemberToProject(projectId: string, memberId: string, user: User) {
    let foundProject: Project, foundMember: User;

    // Fetch Project
    try {
      foundProject = await this.projectsRepository.findOne({
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

    // Fetch member
    try {
      foundMember = await this.usersRepository.findOne({
        where: { id: memberId },
      });
    } catch (error) {
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }

    // if query returned empty member is not a real user
    if (!foundMember) {
      return new Result(ResultStates.ERROR, {
        message: `Member with ${memberId} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const memberIndex: number = foundProject.members.indexOf(foundMember);

    // Check if member exists already in project
    if (memberIndex != -1) {
      return new Result(ResultStates.ERROR, {
        message: `User with id ${memberId} is already a member of project with id ${projectId}`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // Add member to project, update database and return user
    foundProject.members.push(foundMember);
    try {
      this.projectsRepository.save(foundProject);
      return new Result(ResultStates.OK, foundMember);
    } catch (error) {
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }
  }

  // Delete member from Project
  async deleteMember(projectId: string, memberId: string, user: User) {
    let foundProject: Project, foundMember: User;

    // Fetch Project
    try {
      foundProject = await this.projectsRepository.findOne({
        where: { id: projectId, admin: user },
        relations: { members: true },
      });
    } catch (error) {
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }

    // If query returns empty either project doesn't exist or user is not admin
    if (!foundProject) {
      return new Result(ResultStates.ERROR, {
        message: `Project with id ${projectId} not found or are not admin`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    try {
      foundMember = await this.usersRepository.findOne({
        where: { id: memberId },
      });
    } catch (error) {
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }

    if (!foundMember) {
      return new Result(ResultStates.ERROR, {
        message: `User with id ${memberId} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const memberIndex: number = foundProject.members.findIndex(
      (member) => member.id === foundMember.id
    );

    // Check if the proposed member for delete belongs to the project
    if (memberIndex == -1) {
      return new Result(ResultStates.ERROR, {
        message: `User with id ${memberId} isn't asigned to project with id ${projectId}`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // Remove member from project using array splice, update database and return removed member
    const removed = foundProject.members.splice(memberIndex, 1);
    try {
      this.projectsRepository.save(foundProject);
      return new Result(ResultStates.OK, removed);
    } catch (error) {
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }
  }
}

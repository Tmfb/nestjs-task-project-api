import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "../auth/get-user.decorator";
import { User } from "../users/user.entity";
import { Result, ResultStates } from "../result.dto";
import { CreateProjectDto } from "./dto/create-project.dto";
import { GetProjectsFilterDto } from "./dto/get-projects-filter.dto";
import { ProjectsService } from "./projects.service";
import { Project } from "./project.entity";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";

// Swagger decorators
@ApiResponse({ status: 400, description: "Bad request" })
@ApiResponse({ status: 401, description: "Unauthorized" })
@ApiResponse({ status: 404, description: "Not found" })
@ApiBearerAuth()
// Nestjs decorators
@Controller("projects")
@UseGuards(AuthGuard())
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  // Create a project
  @Post()
  @ApiOperation({ summary: "Create project with given parameters" })
  @ApiResponse({
    status: 200,
    description: "Successfull response",
  })
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() user: User
  ): Promise<Project> {
    const result: Result = await this.projectsService.createProject(
      createProjectDto,
      user
    );

    if (result.state == ResultStates.ERROR) {
      throw new HttpException(result.data.message, result.data.statusCode);
    }
    return result.data;
  }

  // Get all projects with optional filters
  @Get()
  @ApiOperation({ summary: "Retrieve all projects" })
  @ApiResponse({
    status: 200,
    description: "Successfull response",
    isArray: true,
  })
  async getProjects(
    @Query() filterDto: GetProjectsFilterDto,
    @GetUser() user: User
  ): Promise<Project[]> {
    const result = await this.projectsService.getProjects(filterDto, user);

    if (result.state == ResultStates.ERROR) {
      throw new HttpException(result.data.message, result.data.statusCode);
    }

    return result.data;
  }

  // Get project by Id
  @Get("/:projectId")
  @ApiOperation({ summary: "Retrieve task with matching id" })
  @ApiParam({
    name: "projectId",
    required: true,
    description: "Id of the project to retrieve",
  })
  @ApiResponse({
    status: 200,
    description: "Successfull response",
  })
  async getProjectById(
    @Param("projectId") projectId: string,
    @GetUser() user: User
  ): Promise<Result> {
    const result = await this.projectsService.getProjectById(projectId, user);

    if (result.state == ResultStates.ERROR) {
      throw new HttpException(result.data.message, result.data.statusCode);
    }

    return result.data;
  }

  // Update project

  // Add User to Project
  @Patch("/:projectId/members/:memberId")
  @ApiOperation({
    summary: "Add user to the member list of a given project",
  })
  @ApiParam({
    name: "projectId",
    example: "43d437ac-d4ff-47bf-82bf-102fdf876d51",
    required: true,
    description: "Id of the project to update",
  })
  @ApiParam({
    name: "memberId",
    example: "ba46bca0-7c87-49c8-ac60-ad00b8a40720",
    required: true,
    description: "Id of the member to add",
  })
  @ApiResponse({
    status: 200,
    description: "Member succesfully added to the project",
  })
  async addMemberToProject(
    @Param("projectId") projectId: string,
    @Param("memberId") memberId: string,
    @GetUser() user: User
  ): Promise<Project> {
    const result: Result = await this.projectsService.addMemberToProject(
      projectId,
      memberId,
      user
    );

    if (result.state == ResultStates.ERROR) {
      throw new HttpException(result.data.message, result.data.statusCode);
    }

    return result.data;
  }

  // Delete Project
  @Delete("/:projectId")
  @ApiOperation({
    summary: "Delete project with given id if user is admin",
  })
  @ApiParam({
    name: "projectId",
    required: true,
    description: "Id of the project to delete",
  })
  @ApiResponse({
    status: 204,
    description: "Project successfully deleted",
  })
  async deleteProject(
    @Param("projectId") projectId: string,
    @GetUser() user: User
  ): Promise<Result> {
    const result = await this.projectsService.deleteProject(projectId, user);

    if (result.state == ResultStates.ERROR) {
      throw new HttpException(result.data.message, result.data.statusCode);
    }

    return result.data;
  }

  // Delete User from Project
  @Delete("/:projectId/members/:memberId")
  @ApiOperation({
    summary: "Delete project with given id if user is admin",
  })
  @ApiParam({
    name: "projectId",
    required: true,
    description: "Id of the project to delete",
  })
  @ApiParam({
    name: "memberId",
    required: true,
    description: "Id of the memberId to delete",
  })
  @ApiResponse({
    status: 204,
    description: "Project successfully deleted",
  })
  async deleteMember(
    @Param("projectId") projectId: string,
    @Param("memberId") memberId: string,
    @GetUser() user: User
  ): Promise<User> {
    const result = await this.projectsService.deleteMember(
      projectId,
      memberId,
      user
    );

    if (result.state == ResultStates.ERROR) {
      throw new HttpException(result.data.message, result.data.statusCode);
    }

    return result.data;
  }
}

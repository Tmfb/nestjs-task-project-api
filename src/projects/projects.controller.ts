import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { Result, ResultStates } from '../result.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(AuthGuard())
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  // Create a project
  @Post()
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() user: User,
  ): Promise<Result> {
    const result: Result = await this.projectsService.createProject(
      createProjectDto,
      user,
    );

    if (result.state == ResultStates.ERROR) {
      throw new HttpException(result.data.message, result.data.statusCode);
    }

    return result.data;
  }

  // Get all projects with optional filters
  @Get()
  async getProjects(
    @Query() filterDto: GetProjectsFilterDto,
    @GetUser() user: User,
  ): Promise<Result> {
    const result = await this.projectsService.getProjects(filterDto, user);

    if (result.state == ResultStates.ERROR) {
      throw new HttpException(result.data.message, result.data.statusCode);
    }

    return result.data;
  }

  // Get project by Id
  @Get('/:id')
  async getProjectById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Result> {
    const result = await this.projectsService.getProjectById(id, user);

    if (result.state == ResultStates.ERROR) {
      throw new HttpException(result.data.message, result.data.statusCode);
    }

    return result.data;
  }

  // Update project

  // Delete Project
  @Delete('/:id')
  async deleteProject(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Result> {
    const result = await this.projectsService.deleteProject(id, user);

    if (result.state == ResultStates.ERROR) {
      throw new HttpException(result.data.message, result.data.statusCode);
    }

    return result.data;
  }
  //
}

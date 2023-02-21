import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { Result, ResultStates } from '../result.dto';
import { CreateProjectDto } from './dto/create-project.dto';
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
      console.log(result.state);
      throw new InternalServerErrorException();
    }

    return result.data;
  }

  // Get all projects

  // Get project by Id

  // Update project

  // Delete Project

  //
}

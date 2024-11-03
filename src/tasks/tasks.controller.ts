import { Controller, HttpException, HttpStatus, Query } from "@nestjs/common";
import { Body, HttpCode } from "@nestjs/common/decorators";
import { UseGuards } from "@nestjs/common/decorators/core/use-guards.decorator";
import {
  Get,
  Post,
  Delete,
  Patch,
} from "@nestjs/common/decorators/http/request-mapping.decorator";
import { Param } from "@nestjs/common/decorators/http/route-params.decorator";
import { AuthGuard } from "@nestjs/passport";
import { ResultStates } from "../result.dto";
import { GetUser } from "../auth/get-user.decorator";
import { User } from "../users/user.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTaskFilterDto } from "./dto/get-tasks-filter.dto";
import {
  UpdateTaskResolverDto,
  UpdateTaskSProjectDto,
  UpdateTaskStatusDto,
} from "./dto/update-task.dto";
import { Task } from "./task.entity";
import { TasksService } from "./tasks.service";
import {
  ApiBearerAuth,

  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

// Swagger decorators
@ApiTags("Tasks")
@ApiResponse({ status: 400, description: "Bad request" })
@ApiResponse({ status: 401, description: "Unauthorized" })
@ApiResponse({ status: 404, description: "Not found" })
@ApiBearerAuth()
// Nestjs decorators
@Controller("tasks")
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: "Retrieve all tasks" })
  @ApiResponse({
    status: 200,
    description: "Successfull response",
    isArray: true,
  })
  async getTasks(
    @Query() filterDto: GetTaskFilterDto,
    @GetUser() user: User
  ): Promise<Task[]> {
    const result = await this.tasksService.getTasks(filterDto, user);

    if (result.state == ResultStates.ERROR) {
      throw new HttpException(result.data.message, result.data.statusCode);
    }

    return result.data;
  }

  @Get("/:taskId")
  @ApiOperation({ summary: "Retrieve task with matching id" })
  @ApiParam({
    name: "taskId",
    required: true,
    description: "Id of the Task to retrieve",
  })
  @ApiResponse({
    status: 200,
    description: "Successfull response",
  })
  async getTaskById(
    @Param("taskId") taskId: string,
    @GetUser() user: User
  ): Promise<Task> {
    const result = await this.tasksService.getTaskById(taskId, user);

    if (result.state == ResultStates.ERROR) {
      throw new HttpException(result.data.message, result.data.statusCode);
    }

    return result.data;
  }

  @Post()
  @ApiOperation({ summary: "Create task with given parameters" })
  @ApiResponse({
    status: 200,
    description: "Successfull response",
  })
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    const result = await this.tasksService.createTask(createTaskDto, user);

    if (result.state == ResultStates.ERROR) {
      throw new HttpException(result.data.message, result.data.statusCode);
    }

    return result.data;
  }

  @Delete("/:taskId")
  @ApiOperation({
    summary: "Delete task with given id if user is admin",
  })
  @ApiParam({
    name: "taskId",
    required: true,
    description: "Id of the Task to delete",
  })
  @ApiResponse({
    status: 204,
    description: "Task successfully deleted",
  })
  @HttpCode(204)
  async deleteTask(
    @Param("taskId") taskId: string,
    @GetUser() user: User
  ): Promise<void> {
    const result = await this.tasksService.deleteTask(taskId, user);

    if (result.state == ResultStates.ERROR) {
      throw new HttpException(result.data.message, result.data.statusCode);
    }
  }

  @Patch("/:taskId/status")
  @ApiOperation({
    summary: "Update status of task with given id",
  })
  @ApiParam({
    name: "taskId",
    required: true,
    description: "Id of the Task to update",
  })
  @ApiResponse({
    status: 200,
    description: "Task's status successfully updated",
  })
  async updateTaskStatus(
    @Param("taskId") taskId: string,
    @Body() updateTaskDto: UpdateTaskStatusDto,
    @GetUser() user: User
  ): Promise<Task> {
    if (updateTaskDto.status == undefined) {
      throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
    }
    const status = updateTaskDto.status;
    const result = await this.tasksService.updateTaskStatus(taskId, status, user);

    if (result.state == ResultStates.ERROR) {
      throw new HttpException(result.data.message, result.data.statusCode);
    }

    return result.data;
  }

  @Patch("/:taskId/resolver")
  @ApiOperation({
    summary: "Update resolver of task with given id",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "Id of the task to update",
  })
  @ApiResponse({
    status: 200,
    description: "Task's resolver successfully updated",
  })
  async updateTaskResolver(
    @Param("id") id: string,
    @Body() updateTaskDto: UpdateTaskResolverDto,
    @GetUser() user: User
  ): Promise<Task> {
    if (updateTaskDto.resolverId == undefined) {
      throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
    }

    const result = await this.tasksService.updateTaskResolver(
      id,
      updateTaskDto.resolverId,
      user
    );

    if (result.state == ResultStates.ERROR) {
      throw new HttpException(result.data.message, result.data.statusCode);
    }

    return result.data;
  }

  @Patch("/:taskId/project")
  @ApiOperation({
    summary: "Update project of task with given id",
  })
  @ApiParam({
    name: "taskId",
    required: true,
    description: "Id of the task to update",
  })
  @ApiResponse({
    status: 200,
    description: "Task's project successfully updated",
  })
  async updateTaskProject(
    @Param("taskId") taskId: string,
    @Body() updateTaskDto: UpdateTaskSProjectDto,
    @GetUser() user: User
  ): Promise<Task> {
    if (updateTaskDto.project == undefined) {
      throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
    }
    const projectId = updateTaskDto.project;
    const result = await this.tasksService.updateTaskProject(
      taskId,
      projectId,
      user
    );

    if (result.state == ResultStates.ERROR) {
      throw new HttpException(result.data.message, result.data.statusCode);
    }

    return result.data;
  }
}

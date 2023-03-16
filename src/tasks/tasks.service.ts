import { HttpStatus, Injectable } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { Result, ResultStates } from '../result.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private taskRepository: TasksRepository,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Result> {
    return await this.taskRepository.createTask(createTaskDto, user);
  }

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Result> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Result> {
    return await this.taskRepository.getTaskById(id, user);
  }

  async deleteTask(id: string, user: User): Promise<Result> {
    const removed = await this.taskRepository.delete({ id: id, admin: user });

    if (removed.affected === 0) {
      return new Result(ResultStates.ERROR, {
        message: `Task with ID " ${id}" not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Result> {
    return this.taskRepository.updateTaskStatus(id, status, user);
  }

  async updateTaskProject(id: string, projectId: string, user: User) {
    return this.taskRepository.updateTaskProject(id, projectId, user);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { create } from 'domain';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  // getTaskWithFilter(filterDto: GetTaskFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   // temporary array to hold result
  //   let filteredTasks = this.getAllTasks();

  //   // do something with status
  //   if (status) {
  //     filteredTasks = filteredTasks.filter((task) => task.status === status);
  //   }
  //   // do something with search
  //   if (search) {
  //     filteredTasks = filteredTasks.filter(
  //       (task) =>
  //         task.description.includes(search) || task.title.includes(search),
  //     );
  //   }
  //   // return final value
  //   return filteredTasks;
  // }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!found) {
      throw new NotFoundException(`Task with ID " ${id}" not found`);
    }
    return found;
  }
  // getTaskById(id: string): Task {
  //   // try get task
  //   const found = this.tasks.find((task) => task.id == id);

  //   // if not found return 404
  //   if (!found) {
  //     throw new NotFoundException(`Task with ID "${id}" not found`);
  //   }

  //   // otherwise, return found task
  //   return found;
  // }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }
  // deleteTask(id: string): void {
  //   const found = this.getTaskById(id);
  //   this.tasks = this.tasks.filter((task) => task.id != found.id);
  // }
  // updateTaskStatus(id: string, status: TaskStatus): Task {
  //   const updateableTask = this.getTaskById(id);
  //   if (updateableTask != undefined) {
  //     this.tasks[this.tasks.indexOf(updateableTask)].status = status;
  //     return updateableTask;
  //   }
  //   return undefined;
  // }
}

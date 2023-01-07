import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { NotFoundException } from '@nestjs/common/exceptions';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskWithFilter(filterDto: GetTaskFilterDto): Task[] {
    const { status, search } = filterDto;
    // temporary array to hold result
    let filteredTasks = this.getAllTasks();

    // do something with status
    if (status) {
      filteredTasks = filteredTasks.filter((task) => task.status === status);
    }
    // do something with search
    if (search) {
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.description.includes(search) || task.title.includes(search),
      );
    }
    // return final value
    return filteredTasks;
  }

  getTaskById(id: string): Task {
    // try get task
    const found = this.tasks.find((task) => task.id == id);

    // if not found return 404
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    // otherwise, return found task
    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const newTask: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(newTask);
    return newTask;
  }
  deleteTask(id: string): void {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id != found.id);
  }
  updateTaskStatus(id: string, status: TaskStatus): Task {
    const updateableTask = this.getTaskById(id);
    if (updateableTask != undefined) {
      this.tasks[this.tasks.indexOf(updateableTask)].status = status;
      return updateableTask;
    }
    return undefined;
  }
}

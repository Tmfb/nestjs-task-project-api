import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { TaskStatus } from './tasks-status.enum';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  //Database logic

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);
    return task;
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { AuthModule } from '../auth/auth.module';
import { ProjectsRepository } from '../projects/projects.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TasksRepository, Task]), AuthModule],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository, ProjectsRepository],
})
export class TasksModule {}

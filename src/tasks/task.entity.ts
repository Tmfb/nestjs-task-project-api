import { Exclude } from 'class-transformer';
import { User } from '../auth/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { Project } from 'src/projects/project.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  // User relationships
  @ManyToOne(() => User, (user) => user.createdTasks, { cascade: true })
  admin: User;

  @ManyToOne(() => User, (user) => user.createdTasks, {
    cascade: ['insert', 'update', 'remove'],
  })
  resolver: User;

  // Project relationship
  @ManyToOne(() => Project, (project) => project.tasks, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn()
  project: Project;
}

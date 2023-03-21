import { User } from '../users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
  @ManyToOne(() => User, (user) => user.createdTasks)
  admin: User;

  @ManyToOne(() => User, (user) => user.createdTasks)
  resolver: User;

  // Project relationship
  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;
}

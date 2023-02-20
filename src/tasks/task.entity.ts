import { Exclude } from 'class-transformer';
import { User } from '../auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { Project } from '../projects/project.entity';

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

  @ManyToOne((_type) => User, (user) => user.tasks)
  @Exclude({ toPlainOnly: true })
  user: User;

  @ManyToOne((_type) => Project, (project) => project.tasks)
  @Exclude({ toPlainOnly: true })
  project: Project;
}

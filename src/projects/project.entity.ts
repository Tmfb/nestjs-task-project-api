import { User } from '../auth/user.entity';
import { Task } from '../tasks/task.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @OneToMany((_type) => Task, (task) => task.project)
  tasks: Task[];

  @OneToOne((_type) => User)
  @JoinColumn()
  admin: User;

  @ManyToMany((_type) => User, (user) => user.projects, {})
  users: User[];
}

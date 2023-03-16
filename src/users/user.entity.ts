import { Task } from '../tasks/task.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from '../projects/project.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  // Tasks relationships
  @OneToMany(() => Task, (task) => task.admin)
  createdTasks: Task[];

  @OneToMany(() => Task, (task) => task.resolver)
  pendingTasks: Task[];

  // Projects relationships
  @OneToMany(() => Project, (project) => project.admin)
  administratedProjects: Project[];

  @ManyToMany(() => Project, (project) => project.members)
  projects: Project[];
}

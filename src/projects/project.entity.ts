import { User } from "../users/user.entity";
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Task } from "../tasks/task.entity";

@Entity()
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  // Tasks relationships
  @ManyToOne(() => User, (user) => user.administratedProjects)
  admin: User;

  @ManyToMany(() => User, (user) => user.projects)
  members: User[];

  // Task relationship
  @OneToMany(() => Task, (task) => task.project, {
    cascade: true,
    onDelete: "SET NULL",
  })
  tasks: Task[];
}

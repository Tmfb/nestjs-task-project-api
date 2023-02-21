import { IsNotEmpty } from 'class-validator';
import { Task } from '../../tasks/task.entity';
import { User } from '../../auth/user.entity';

export class CreateProjectDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  tasks: Task[];

  users: User[];
}

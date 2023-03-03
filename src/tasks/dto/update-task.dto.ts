import { TaskStatus } from '../task-status.enum';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsUUID()
  resolver: string;

  @IsOptional()
  @IsUUID()
  project: string;
}

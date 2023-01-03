import { TaskStatus } from '../tasks.model';
import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export class GetTaskFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search?: string;
}

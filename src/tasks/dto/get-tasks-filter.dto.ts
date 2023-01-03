import { TaskStatus } from '../tasks.model';
import { IsString, IsEnum, IsOptional } from 'class-validator';

export class GetTaskFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}

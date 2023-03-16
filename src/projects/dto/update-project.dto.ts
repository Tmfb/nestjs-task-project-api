import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { updateProjectEnum } from '../update-project.enum';

export class updateProjectDto {
  @IsNotEmpty()
  @IsEnum(updateProjectEnum)
  action: updateProjectEnum;

  @IsOptional()
  @IsUUID()
  taskid?: string;

  @IsOptional()
  @IsUUID()
  memberid?: string;
}

import { IsOptional, IsString } from 'class-validator';
import { User } from 'src/auth/user.entity';

export class getProjectsFilterDto {
  @IsOptional()
  @IsString()
  search: string;
}

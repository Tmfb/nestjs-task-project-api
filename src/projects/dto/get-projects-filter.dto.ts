import { IsOptional, IsString } from 'class-validator';

export class GetProjectsFilterDto {
  @IsOptional()
  @IsString()
  search: string;
}

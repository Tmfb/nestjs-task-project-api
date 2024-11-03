import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetProjectsFilterDto {
  @ApiProperty({
    example: "Demo",
    description: "Text to search for a match on both title and description of the project ",
    type: "string",
  })
  @IsOptional()
  @IsString()
  search: string;
}

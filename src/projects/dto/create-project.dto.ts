import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    example: "Demo project title",
    description: "Title for the project",
    type: "string",
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: "A project for demo purposes",
    description: "Description of the project",
    type: "string",
  })
  @IsNotEmpty()
  description: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';


export class CreateTaskDto {
  @ApiProperty({
    example: "Demo Task",
    description: "Name for the created task",
    type: "string",
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: "Task created for demo purposes",
    description: "Description for the created task",
    type: "string",
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: "ba46bca0-7c87-49c8-ac60-ad00b8a40720",
    description: "Id of the task resolver",
    type: "string",
  })
  @IsOptional()
  resolverUserId: string;
}

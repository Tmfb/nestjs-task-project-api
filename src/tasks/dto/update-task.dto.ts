import { ApiProperty } from "@nestjs/swagger";
import { TaskStatus } from "../task-status.enum";
import { IsEnum, IsOptional, IsUUID } from "class-validator";

export class UpdateTaskStatusDto {
  @ApiProperty({
    example: TaskStatus.OPEN,
    description: "Status of the task to update",
    enumName: "TaskStatus",
    enum: TaskStatus,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

export class UpdateTaskResolverDto {
  @ApiProperty({
    example: "ba46bca0-7c87-49c8-ac60-ad00b8a40720",
    description: "Id of the task resolver to update",
    type: "string",
  })
  @IsOptional()
  @IsUUID()
  resolverId: string;
}

export class UpdateTaskSProjectDto {
  @ApiProperty({
    example: "43d437ac-d4ff-47bf-82bf-102fdf876d51",
    description: "Id of the task project to update",
    type: "string",
  })
  @IsOptional()
  @IsUUID()
  project: string;
}

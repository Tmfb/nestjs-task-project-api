import { ApiPropertyOptional } from "@nestjs/swagger";
import { TaskStatus } from "../task-status.enum";
import { IsString, IsEnum, IsOptional } from "class-validator";
import { string } from "@hapi/joi";

export class GetTaskFilterDto {
  @ApiPropertyOptional({
    example: Object.keys(TaskStatus),
    description: "The status of the task",
    enumName: "TaskStatus",
    enum: TaskStatus,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    example: "Demo",
    description: "Text filter to be applied",
    type: "string",
  })
  @IsOptional()
  @IsString()
  search?: string;
}

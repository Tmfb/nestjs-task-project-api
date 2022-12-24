import { Controller } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  //Constructor
  constructor(private taskService: TasksService) {}
}

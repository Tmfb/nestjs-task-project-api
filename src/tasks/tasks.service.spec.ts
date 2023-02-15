import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { TaskStatus } from './task-status.enum';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
});

const mockUser = {
  username: 'Tomas',
  id: 'someId',
  password: 'somePassword',
  tasks: [],
};

const mockTask = {
  id: 'someId',
  title: 'someTitle',
  description: 'someDescription',
  status: TaskStatus.OPEN,
  user: mockUser,
};

const mockCreateTaskDto = {
  title: 'someTitle',
  description: 'someDescription',
};

describe('TaskService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    //initialize a NestJS module with taskService and taskRepository
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTask and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTasksById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      const mockTask = {
        title: 'Test title',
        description: 'Test description',
        id: 'someId',
        status: TaskStatus.OPEN,
      };

      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findOne and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('calls TasksRepository.createTask and returns the result', async () => {
      tasksRepository.createTask.mockResolvedValue(mockTask);
      const result = await tasksService.createTask(mockCreateTaskDto, mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.createTask and handles an error', async () => {
      tasksRepository.createTask.mockImplementation(() => {
        throw new InternalServerErrorException();
      });
      expect(
        tasksService.createTask(mockCreateTaskDto, mockUser),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('deleteTask', () => {
    it('calls TaskRepository.delete', async () => {
      const spy = jest.spyOn(tasksRepository, 'delete');
      tasksRepository.delete.mockResolvedValue({ affected: 3 });
      tasksService.deleteTask(mockTask.id, mockUser);
      expect(spy).toHaveBeenCalled();
    });
    it('calls TaskService.delete and handles an error', async () => {
      tasksRepository.delete.mockResolvedValue({ affected: 0 });
      expect(tasksService.deleteTask(mockTask.id, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateTaskStatus', () => {
    it('calls TaskService.updateTaskStatus and returns the result', async () => {
      // Test default value to IN_PROGRESS change
      const spy = jest.spyOn(tasksRepository, 'save');
      tasksRepository.findOne.mockResolvedValue(mockTask);
      let result = await tasksService.updateTaskStatus(
        mockTask.id,
        TaskStatus.IN_PROGRESS,
        mockUser,
      );

      expect(result.status).toBe(TaskStatus.IN_PROGRESS);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore(); //Reset the spy

      //Test IN_PROGRESS to DONE change
      result = await tasksService.updateTaskStatus(
        mockTask.id,
        TaskStatus.DONE,
        mockUser,
      );
      expect(result.status).toBe(TaskStatus.DONE);
      expect(spy).toHaveBeenCalled();
    });
  });
});

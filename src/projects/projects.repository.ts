import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Project } from './project.entity';

@Injectable()
export class ProjectsRepository extends Repository<Project> {}

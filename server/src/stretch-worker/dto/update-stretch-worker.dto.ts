import { PartialType } from '@nestjs/mapped-types';
import { CreateStretchWorkerDto } from './create-stretch-worker.dto';

export class UpdateStretchWorkerDto extends PartialType(CreateStretchWorkerDto) {}

import { Injectable } from '@nestjs/common';
import { Worker } from 'snowflake-uuid';

@Injectable()
export class UuidService {
  worker: Worker;

  constructor() {
    this.worker = new Worker(0, 0, {
      workerIdBits: 5,
      datacenterIdBits: 5,
      sequenceBits: 12,
    });
  }

  id(): number {
    return Number(this.worker.nextId());
  }
}

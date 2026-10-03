import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'setup is running';
  }

  getPing(): string {
    return 'setup is live';
  }
}

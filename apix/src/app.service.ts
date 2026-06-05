import { Injectable } from '@nestjs/common';
import process from 'node:process';

@Injectable()
export class AppService {
  getHello(): string {
    return `
    <h1>Welcome to QA API</h1>
     <h4>Version 1.0.0</h4>
    <hr>
    <h4>Powered By <a href="https://huipper.com/">huipper.com</a></h4>
    `;
  }
}

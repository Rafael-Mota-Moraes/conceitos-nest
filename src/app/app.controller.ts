import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('')
export class AppController {
  // constructor(private readonly appService: AppService) {}

  @Get() // Método da solicitação...
  getHello(): string {
    return 'Qualquer coisa...';
  }

  @Get('outro') // Método da solicitação...
  getOutro(): string {
    return 'Qualquer coisa 2...';
  }
}

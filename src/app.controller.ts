import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Root endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Returns hello message',
    schema: {
      example: {
        success: true,
        message: 'Success',
        data: 'Hello World',
      },
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}

import { Body, Controller, Post, HttpCode, UseGuards, Get, Request, Param, Patch } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CheckUrlDto } from './dto/check-url.dto';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @Post('check-url')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async checkUrl(@Body() body: CheckUrlDto) {
    return this.monitorService.checkUrl(body.url);
  }


  @Get('test-url')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async testUrl() {
    return this.monitorService.testUrl();
  }

  @Post('create-url')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async createUrl(@Body() body: CreateUrlDto, @Request() req: any) {
    console.log('user',req.user)
    return this.monitorService.createUrl(body, req.user.userid);
  }

  @Patch('update-url/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async updateUrl(@Body() body: UpdateUrlDto, @Param('id') id: number) {
    return this.monitorService.updateUrl(body, id);
  }

  @Get('get-all-url')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getAllUrl(@Request() req: any) {
    console.log('user',req.user)
    return this.monitorService.getAllUrl();
  }

  @Post('get-url')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getUrl(@Body() body: {url: string}) {
    return this.monitorService.getUrl(body.url);
  }
}

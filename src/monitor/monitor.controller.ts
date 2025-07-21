import { Body, Controller, Post, HttpCode, UseGuards, Get, Request, Param, Patch } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CheckUrlDto } from './dto/check-url.dto';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Monitor') // จัดกลุ่ม API ทั้งหมดใน Controller นี้
@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @Post('check-url')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check the status of a specific URL' })
  @ApiBearerAuth() // ระบุว่าต้องใช้ JWT
  @ApiBody({ type: CheckUrlDto })
  @ApiResponse({ status: 200, description: 'URL status checked successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async checkUrl(@Body() body: CheckUrlDto) {
    return this.monitorService.checkUrl(body.url);
  }

  @Get('test-url')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'A test endpoint for the monitoring service' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Test successful.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async testUrl() {
    return this.monitorService.testUrl();
  }

  @Post('create-url')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create and add a new URL to monitor' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateUrlDto })
  @ApiResponse({ status: 200, description: 'URL created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async createUrl(@Body() body: CreateUrlDto, @Request() req: any) {
    return this.monitorService.createUrl(body, req.user.sub);
  }

  @Patch('update-url/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an existing monitored URL' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'The ID of the URL to update', type: 'number' })
  @ApiBody({ type: UpdateUrlDto })
  @ApiResponse({ status: 200, description: 'URL updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'URL not found.' })
  async updateUrl(@Body() body: UpdateUrlDto, @Param('id') id: number) {
    console.log('body', body);
    console.log('id', id);
    return this.monitorService.updateUrl(body, id);
  }

  @Get('get-all-url')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all URLs monitored by the current user' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Returns an array of monitored URLs.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getAllUrl(@Request() req: any) {
    return this.monitorService.getAllUrl();
  }

  @Get('homepage-url')
  @HttpCode(200)
  // @UseGuards(JwtAuthGuard) // Endpoint นี้เป็น Public ไม่ต้อง Login
  @ApiOperation({ summary: 'Get URLs for the public homepage (No Auth Required)' })
  @ApiResponse({ status: 200, description: 'Returns an array of public URLs for the homepage.' })
  async getHomepageUrl() {
    return this.monitorService.getHomepageUrl();
  }

  @Post('get-url')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get details for a specific URL by its address' })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: 'https://google.com',
        },
      },
      required: ['url'],
    },
  })
  @ApiResponse({ status: 200, description: 'Returns the details of the specified URL.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getUrl(@Body() body: { url: string }) {
    return this.monitorService.getUrl(body.url);
  }
}
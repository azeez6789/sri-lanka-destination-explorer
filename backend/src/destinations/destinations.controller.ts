import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { DestinationDto } from './dto/destination.dto';
import { DestinationsService } from './destinations.service';
import { WeatherService } from '../weather/weather.service';

@Controller('destinations')
export class DestinationsController {
  constructor(
    private readonly destinations: DestinationsService,
    private readonly weather: WeatherService,
  ) {}

  @Get()
  findAll() {
    return this.destinations.findAll();
  }

  @Get(':id/weather')
  async getWeather(@Param('id') id: string) {
    const destination = await this.destinations.findOne(id);
    return this.weather.getCurrent(destination.latitude, destination.longitude);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.destinations.findOne(id);
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  create(@Body() dto: DestinationDto) {
    return this.destinations.create(dto);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  update(@Param('id') id: string, @Body() dto: DestinationDto) {
    return this.destinations.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  remove(@Param('id') id: string) {
    return this.destinations.remove(id);
  }
}

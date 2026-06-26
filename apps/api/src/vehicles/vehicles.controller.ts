import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import type { Inspection, Vehicle } from '@scandiag/contracts';
import { AuthGuard } from '../auth/auth.guard';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
@UseGuards(AuthGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  list(): Vehicle[] {
    return this.vehiclesService.list();
  }

  @Get(':id')
  get(@Param('id') id: string): Vehicle {
    return this.vehiclesService.getOrThrow(id);
  }

  @Get(':id/inspections')
  listInspections(@Param('id') id: string): Inspection[] {
    return this.vehiclesService.listInspections(id);
  }
}

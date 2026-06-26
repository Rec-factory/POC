import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DataModule } from '../data/data.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { InspectionsController } from './inspections.controller';
import { InspectionsService } from './inspections.service';

@Module({
  imports: [AuthModule, DataModule, VehiclesModule],
  controllers: [InspectionsController],
  providers: [InspectionsService],
})
export class InspectionsModule {}

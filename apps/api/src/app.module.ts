import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DataModule } from './data/data.module';
import { InspectionsModule } from './inspections/inspections.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [DataModule, AuthModule, VehiclesModule, InspectionsModule],
  controllers: [AppController],
})
export class AppModule {}

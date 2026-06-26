import { Global, Module } from '@nestjs/common';
import { InspectionStore } from './inspection-store.service';

/** Fournit le magasin en mémoire partagé entre les modules. */
@Global()
@Module({
  providers: [InspectionStore],
  exports: [InspectionStore],
})
export class DataModule {}

import {
  Body,
  Controller,
  Headers,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  CreateInspectionRequestSchema,
  type CreateInspectionRequest,
  type Inspection,
  ScandiagMeasurementSchema,
  type ScandiagMeasurement,
} from '@scandiag/contracts';
import { AuthGuard, type AuthenticatedRequest } from '../auth/auth.guard';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { SCENARIO_HEADER, resolveScenario } from '../common/scenario';
import { ApiException } from '../common/api-exception';
import { InspectionsService } from './inspections.service';

@Controller('inspections')
@UseGuards(AuthGuard)
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Headers(SCENARIO_HEADER) scenarioHeader: string | undefined,
    @Body(new ZodValidationPipe(CreateInspectionRequestSchema))
    input: CreateInspectionRequest,
  ): Inspection {
    this.guardSave(scenarioHeader);
    return this.inspectionsService.create(input, request.user.id);
  }

  @Post(':id/measurements')
  addMeasurement(
    @Param('id') id: string,
    @Headers(SCENARIO_HEADER) scenarioHeader: string | undefined,
    @Body(new ZodValidationPipe(ScandiagMeasurementSchema))
    measurement: ScandiagMeasurement,
  ): Inspection {
    this.guardSave(scenarioHeader);
    return this.inspectionsService.addMeasurement(id, measurement);
  }

  @Post(':id/complete')
  complete(
    @Param('id') id: string,
    @Headers(SCENARIO_HEADER) scenarioHeader: string | undefined,
  ): Inspection {
    this.guardSave(scenarioHeader);
    return this.inspectionsService.complete(id);
  }

  /** Refuse l'écriture lorsque le scénario « sauvegarde refusée » est actif. */
  private guardSave(scenarioHeader: string | undefined): void {
    if (resolveScenario(scenarioHeader) === 'save-rejected') {
      throw ApiException.saveRejected();
    }
  }
}

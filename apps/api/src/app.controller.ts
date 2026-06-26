import { Controller, Get } from '@nestjs/common';
import { DEMO_SCENARIO_IDS, type DemoScenarioId } from '@scandiag/contracts';

@Controller()
export class AppController {
  /** Vérifie que l'API simulée répond. */
  @Get('health')
  health(): { status: 'ok'; mode: 'simulation' } {
    return { status: 'ok', mode: 'simulation' };
  }

  /** Liste les identifiants de scénarios de démonstration reconnus. */
  @Get('scenarios')
  scenarios(): { scenarios: readonly DemoScenarioId[] } {
    return { scenarios: DEMO_SCENARIO_IDS };
  }
}

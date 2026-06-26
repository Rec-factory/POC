import type {
  AuthSession,
  CreateInspectionRequest,
  Inspection,
  LoginRequest,
  ScandiagMeasurement,
  User,
  Vehicle,
} from '@scandiag/contracts';

/**
 * Port d'accès au back-office FACOM. Les pages ne doivent jamais
 * dépendre directement d'une implémentation concrète de ce port.
 */
export interface FacomApiPort {
  login(credentials: LoginRequest): Promise<AuthSession>;
  getCurrentUser(): Promise<User>;
  listVehicles(): Promise<Vehicle[]>;
  getVehicle(vehicleId: string): Promise<Vehicle>;
  listVehicleInspections(vehicleId: string): Promise<Inspection[]>;
  createInspection(input: CreateInspectionRequest): Promise<Inspection>;
  addMeasurement(
    inspectionId: string,
    measurement: ScandiagMeasurement,
  ): Promise<Inspection>;
  completeInspection(inspectionId: string): Promise<Inspection>;
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, type Observable } from 'rxjs';
import type {
  AuthSession,
  CreateInspectionRequest,
  Inspection,
  LoginRequest,
  ScandiagMeasurement,
  User,
  Vehicle,
} from '@scandiag/contracts';
import type { FacomApiPort } from '@scandiag/core';
import { environment } from '../../../environments/environment';
import { toFacomApiError } from './facom-api.error';

/**
 * Implémentation HTTP du port d'API. Les en-têtes d'authentification et
 * de scénario sont ajoutés par l'intercepteur HTTP.
 */
@Injectable({ providedIn: 'root' })
export class HttpFacomApiAdapter implements FacomApiPort {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  login(credentials: LoginRequest): Promise<AuthSession> {
    return this.request(
      this.http.post<AuthSession>(`${this.baseUrl}/auth/login`, credentials),
    );
  }

  getCurrentUser(): Promise<User> {
    return this.request(this.http.get<User>(`${this.baseUrl}/auth/me`));
  }

  listVehicles(): Promise<Vehicle[]> {
    return this.request(this.http.get<Vehicle[]>(`${this.baseUrl}/vehicles`));
  }

  getVehicle(vehicleId: string): Promise<Vehicle> {
    return this.request(
      this.http.get<Vehicle>(`${this.baseUrl}/vehicles/${vehicleId}`),
    );
  }

  listVehicleInspections(vehicleId: string): Promise<Inspection[]> {
    return this.request(
      this.http.get<Inspection[]>(
        `${this.baseUrl}/vehicles/${vehicleId}/inspections`,
      ),
    );
  }

  createInspection(input: CreateInspectionRequest): Promise<Inspection> {
    return this.request(
      this.http.post<Inspection>(`${this.baseUrl}/inspections`, input),
    );
  }

  addMeasurement(
    inspectionId: string,
    measurement: ScandiagMeasurement,
  ): Promise<Inspection> {
    return this.request(
      this.http.post<Inspection>(
        `${this.baseUrl}/inspections/${inspectionId}/measurements`,
        measurement,
      ),
    );
  }

  completeInspection(inspectionId: string): Promise<Inspection> {
    return this.request(
      this.http.post<Inspection>(
        `${this.baseUrl}/inspections/${inspectionId}/complete`,
        {},
      ),
    );
  }

  private async request<T>(source: Observable<T>): Promise<T> {
    try {
      return await firstValueFrom(source);
    } catch (error) {
      throw toFacomApiError(error);
    }
  }
}

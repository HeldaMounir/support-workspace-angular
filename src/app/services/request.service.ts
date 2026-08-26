import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SupportRequest } from '../data/requests';

@Injectable({
  providedIn: 'root',
})
export class RequestService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:3001/requests';

  async getRequests(): Promise<SupportRequest[]> {
    return firstValueFrom(
      this.http.get<SupportRequest[]>(this.apiUrl)
    );
  }

  async getRequestById(
    id: string
  ): Promise<SupportRequest> {
    return firstValueFrom(
      this.http.get<SupportRequest>(`${this.apiUrl}/${id}`)
    );
  }
}
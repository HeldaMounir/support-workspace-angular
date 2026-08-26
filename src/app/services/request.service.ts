import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import {
  SupportRequest,
  RequestMessage,
  RequestStatus,
  CreateMessagePayload,
} from '../data/requests';

@Injectable({
  providedIn: 'root',
})
export class RequestService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:3001/requests';

  private readonly messagesUrl =
    'http://localhost:3001/messages';


  // =========================
  // REQUESTS
  // =========================

  async getRequests(): Promise<SupportRequest[]> {
    return firstValueFrom(
      this.http.get<SupportRequest[]>(this.apiUrl)
    );
  }


  async getRequestById(
    id: string
  ): Promise<SupportRequest> {

    return firstValueFrom(
      this.http.get<SupportRequest>(
        `${this.apiUrl}/${id}`
      )
    );
  }


  async updateRequest(
    id: string,
    changes: Partial<SupportRequest>
  ): Promise<SupportRequest> {

    return firstValueFrom(
      this.http.patch<SupportRequest>(
        `${this.apiUrl}/${id}`,
        {
          ...changes,
          updatedAt: new Date().toISOString(),
        }
      )
    );
  }


  // =========================
  // CLAIM
  // =========================

  async claimRequest(
    id: string,
    agentId: string
  ): Promise<SupportRequest> {

    return this.updateRequest(id, {
      assignedAgentId: agentId,
      status: 'in-progress',
    });
  }


  // =========================
  // ASSIGN / REASSIGN
  // =========================

  async assignRequest(
    id: string,
    agentId: string | null
  ): Promise<SupportRequest> {

    return this.updateRequest(id, {
      assignedAgentId: agentId,
    });
  }


  // =========================
  // STATUS
  // =========================

  async updateStatus(
    id: string,
    status: RequestStatus
  ): Promise<SupportRequest> {

    return this.updateRequest(id, {
      status,
    });
  }


  // =========================
  // MESSAGES
  // =========================

  async getMessages(
    requestId: string
  ): Promise<RequestMessage[]> {

    return firstValueFrom(
      this.http.get<RequestMessage[]>(
        `${this.messagesUrl}?requestId=${requestId}&_sort=createdAt&_order=asc`
      )
    );
  }


  async addMessage(
    payload: CreateMessagePayload
  ): Promise<RequestMessage> {

    return firstValueFrom(
      this.http.post<RequestMessage>(
        this.messagesUrl,
        {
          id: `MSG-${crypto.randomUUID()}`,
          ...payload,
          createdAt: new Date().toISOString(),
        }
      )
    );
  }


  // =========================
  // INTERNAL NOTE
  // =========================

  async addInternalNote(
    requestId: string,
    agentId: string,
    content: string
  ): Promise<RequestMessage> {

    return this.addMessage({
      requestId,
      senderId: agentId,
      senderRole: 'agent',
      content: `[INTERNAL] ${content}`,
    });
  }
}
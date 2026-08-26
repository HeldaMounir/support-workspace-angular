import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import {
  ActivatedRoute,
  RouterLink,
} from '@angular/router';

import {
  RequestPriority,
  RequestStatus,
  SupportRequest,
} from '../../data/requests';

import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-request-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './request-details.html',
  styleUrl: './request-details.scss',
})
export class RequestDetails {

  private readonly route =
    inject(ActivatedRoute);

  private readonly location =
    inject(Location);

  private readonly requestService =
    inject(RequestService);

  request: SupportRequest | undefined;

  loading = true;

  error = '';


  constructor() {

    const requestId =
      this.route.snapshot.paramMap.get('id');

    if (requestId) {

      this.loadRequest(requestId);

    } else {

      this.loading = false;

      this.error =
        'Request ID is missing.';

    }
  }


  async loadRequest(
    requestId: string
  ): Promise<void> {

    this.loading = true;

    this.error = '';

    try {

      this.request =
        await this.requestService.getRequestById(
          requestId
        );

    } catch (error) {

      console.error(
        'Failed to load request:',
        error
      );

      this.request = undefined;

      this.error =
        'Failed to load request.';

    } finally {

      this.loading = false;

    }
  }


  goBack(): void {

    this.location.back();

  }


  getStatusLabel(
    status: RequestStatus
  ): string {

    const labels: Record<
      RequestStatus,
      string
    > = {
      open: 'Open',
      'in-progress': 'In Progress',
      resolved: 'Resolved',
      closed: 'Closed',
    };

    return labels[status];

  }


  getPriorityLabel(
    priority: RequestPriority
  ): string {

    const labels: Record<
      RequestPriority,
      string
    > = {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      urgent: 'Urgent',
    };

    return labels[priority];

  }


  formatDate(date: string): string {

    return new Intl.DateTimeFormat(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }
    ).format(new Date(date));

  }
}
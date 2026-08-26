import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  RequestPriority,
  RequestStatus,
  SupportRequest,
} from '../../data/requests';

import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
  ],
  templateUrl: './requests.html',
  styleUrl: './requests.scss',
})
export class Requests {

  private readonly requestService =
    inject(RequestService);

  requests: SupportRequest[] = [];

  searchTerm = '';

  selectedStatus: 'all' | RequestStatus = 'all';

  selectedPriority: 'all' | RequestPriority = 'all';

  loading = true;

  error = '';


  constructor() {
    this.loadRequests();
  }


  async loadRequests(): Promise<void> {

    this.loading = true;
    this.error = '';

    try {

      this.requests =
        await this.requestService.getRequests();

    } catch (error) {

      console.error(
        'Failed to load requests:',
        error
      );

      this.error =
        'Failed to load requests. Please try again.';

    } finally {

      this.loading = false;

    }
  }


  get filteredRequests(): SupportRequest[] {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();

    return this.requests.filter(
      (request: SupportRequest) => {

        const matchesSearch =
          !search ||
          request.id.toLowerCase().includes(search) ||
          request.title.toLowerCase().includes(search) ||
          request.description.toLowerCase().includes(search) ||
          request.category.toLowerCase().includes(search);

        const matchesStatus =
          this.selectedStatus === 'all' ||
          request.status === this.selectedStatus;

        const matchesPriority =
          this.selectedPriority === 'all' ||
          request.priority === this.selectedPriority;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority
        );
      }
    );
  }


  get totalRequests(): number {

    return this.requests.length;

  }


  get openRequests(): number {

    return this.requests.filter(
      (request: SupportRequest) =>
        request.status === 'open'
    ).length;

  }


  get inProgressRequests(): number {

    return this.requests.filter(
      (request: SupportRequest) =>
        request.status === 'in-progress'
    ).length;

  }


  get resolvedRequests(): number {

    return this.requests.filter(
      (request: SupportRequest) =>
        request.status === 'resolved'
    ).length;

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
      }
    ).format(new Date(date));

  }


  clearFilters(): void {

    this.searchTerm = '';

    this.selectedStatus = 'all';

    this.selectedPriority = 'all';

  }


  retry(): void {

    this.loadRequests();

  }
}
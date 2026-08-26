import {
  Component,
  OnInit,
} from '@angular/core';

import { RouterLink } from '@angular/router';

import {
  RequestService,
} from '../../services/request.service';

import {
  SupportRequest,
  type RequestStatus,
} from '../../data/requests';

type StatTone =
  | 'purple'
  | 'orange'
  | 'blue'
  | 'green';

type DashboardStat = {
  label: string;
  value: number;
  change: string;
  tone: StatTone;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  requests: SupportRequest[] = [];

  loading = true;

  error = '';

  constructor(
    private requestService: RequestService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  async loadRequests(): Promise<void> {

    try {

      this.loading = true;
      this.error = '';

      this.requests =
        await this.requestService.getRequests();

    } catch (error) {

      console.error(error);

      this.error =
        'Failed to load support requests.';

    } finally {

      this.loading = false;

    }
  }

  get stats(): DashboardStat[] {

    return [

      {
        label: 'Total requests',
        value: this.requests.length,
        change: 'All requests',
        tone: 'purple',
      },

      {
        label: 'Open requests',
        value: this.requests.filter(
          request =>
            request.status === 'open'
        ).length,
        change: 'Needs attention',
        tone: 'orange',
      },

      {
        label: 'In progress',
        value: this.requests.filter(
          request =>
            request.status === 'in-progress'
        ).length,
        change: 'Currently working',
        tone: 'blue',
      },

      {
        label: 'Resolved',
        value: this.requests.filter(
          request =>
            request.status === 'resolved'
        ).length,
        change: 'Successfully resolved',
        tone: 'green',
      },

    ];
  }

  get recentRequests(): SupportRequest[] {

    return [...this.requests]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime()
      )
      .slice(0, 5);

  }

  getStatusLabel(
    status: SupportRequest['status']
  ): string {

    const statusLabels: Record<RequestStatus, string> = {
  open: 'Open',
  'in-progress': 'In Progress',
  'waiting-customer': 'Waiting for Customer',
  resolved: 'Resolved',
  closed: 'Closed',
};

    return statusLabels[status];
  }

  getPriorityLabel(
    priority: SupportRequest['priority']
  ): string {

    const labels: Record<
      SupportRequest['priority'],
      string
    > = {

      low: 'Low',

      medium: 'Medium',

      high: 'High',

      urgent: 'Urgent',

    };

    return labels[priority];
  }

  getRequestTime(
    request: SupportRequest
  ): string {

    return this.formatRelativeDate(
      request.updatedAt
    );

  }

  private formatRelativeDate(
    date: string
  ): string {

    const requestDate =
      new Date(date);

    const now =
      new Date();

    const difference =
      now.getTime() -
      requestDate.getTime();

    const minutes =
      Math.floor(
        difference / (1000 * 60)
      );

    if (minutes < 1) {
      return 'Just now';
    }

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours =
      Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days =
      Math.floor(hours / 24);

    if (days === 1) {
      return 'Yesterday';
    }

    return `${days}d ago`;
  }
}
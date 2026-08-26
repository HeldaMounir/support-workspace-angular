import {
  Component,
  OnInit,
  inject,
  computed,
  signal,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { RequestService } from '../../services/request.service';

import {
  SupportRequest,
  RequestStatus,
  RequestPriority,
} from '../../data/requests';

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
export class Requests implements OnInit {

  private readonly requestService =
    inject(RequestService);


  requests =
    signal<SupportRequest[]>([]);

  loading =
    signal(true);

  error =
    signal('');

  search =
    signal('');

  statusFilter =
    signal<RequestStatus | 'all'>('all');

  priorityFilter =
    signal<RequestPriority | 'all'>('all');

  assignmentFilter =
    signal<'all' | 'assigned' | 'unassigned'>('all');

  currentPage =
    signal(1);

  claimingId =
    signal<string | null>(null);

  pageSize = 6;


  filteredRequests = computed(() => {

    const search =
      this.search()
        .toLowerCase()
        .trim();

    const status =
      this.statusFilter();

    const priority =
      this.priorityFilter();

    const assignment =
      this.assignmentFilter();


    return this.requests().filter(request => {

      const matchesSearch =
        !search ||
        request.id
          .toLowerCase()
          .includes(search) ||
        request.title
          .toLowerCase()
          .includes(search) ||
        request.description
          .toLowerCase()
          .includes(search);


      const matchesStatus =
        status === 'all' ||
        request.status === status;


      const matchesPriority =
        priority === 'all' ||
        request.priority === priority;


      const matchesAssignment =
        assignment === 'all' ||

        (
          assignment === 'assigned' &&
          request.assignedAgentId !== null
        ) ||

        (
          assignment === 'unassigned' &&
          request.assignedAgentId === null
        );


      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesAssignment
      );

    });

  });


  totalPages = computed(() =>
    Math.max(
      1,
      Math.ceil(
        this.filteredRequests().length /
        this.pageSize
      )
    )
  );


  paginatedRequests = computed(() => {

    const start =
      (this.currentPage() - 1) *
      this.pageSize;

    return this.filteredRequests()
      .slice(
        start,
        start + this.pageSize
      );

  });


  async ngOnInit(): Promise<void> {
    await this.loadRequests();
  }


  async loadRequests(): Promise<void> {

    try {

      this.loading.set(true);
      this.error.set('');

      const data =
        await this.requestService
          .getRequests();

      this.requests.set(data);

    } catch (error) {

      console.error(error);

      this.error.set(
        'Unable to load requests. Please try again.'
      );

    } finally {

      this.loading.set(false);

    }

  }


  onFilterChange(): void {

    this.currentPage.set(1);

  }


  nextPage(): void {

    if (
      this.currentPage() <
      this.totalPages()
    ) {

      this.currentPage.update(
        page => page + 1
      );

    }

  }


  previousPage(): void {

    if (
      this.currentPage() > 1
    ) {

      this.currentPage.update(
        page => page - 1
      );

    }

  }


  async claimRequest(
    request: SupportRequest
  ): Promise<void> {

    if (
      request.assignedAgentId ||
      this.claimingId()
    ) {
      return;
    }


    try {

      this.claimingId.set(request.id);
      this.error.set('');

      const updated =
        await this.requestService
          .claimRequest(
            request.id,
            'agent-001'
          );


      this.requests.update(
        requests =>
          requests.map(item =>
            item.id === updated.id
              ? updated
              : item
          )
      );

    } catch (error) {

      console.error(error);

      this.error.set(
        'Could not claim this request. Please try again.'
      );

    } finally {

      this.claimingId.set(null);

    }

  }

}
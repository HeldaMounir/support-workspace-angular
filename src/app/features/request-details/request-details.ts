import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink,
} from '@angular/router';

import {
  FormsModule,
} from '@angular/forms';

import {
  DatePipe,
} from '@angular/common';

import {
  RequestService,
} from '../../services/request.service';

import {
  SupportRequest,
  RequestMessage,
  InternalNote,
  RequestStatus,
} from '../../data/requests';


@Component({
  selector: 'app-request-details',

  standalone: true,

  imports: [
    FormsModule,
    RouterLink,
    DatePipe,
  ],

  templateUrl:
    './request-details.html',

  styleUrl:
    './request-details.scss',
})
export class RequestDetails
  implements OnInit {


  private readonly route =
    inject(ActivatedRoute);

  private readonly requestService =
    inject(RequestService);


  // =====================================
  // STATE
  // =====================================

  request =
    signal<SupportRequest | null>(
      null
    );

  messages =
    signal<RequestMessage[]>([]);

  internalNotes =
    signal<InternalNote[]>([]);


  loading =
    signal(true);

  messagesLoading =
    signal(true);

  notesLoading =
    signal(true);

  actionLoading =
    signal(false);

  error =
    signal('');

  success =
    signal('');


  messageText = '';

  internalNoteText = '';


  // =====================================
  // CURRENT AGENT
  // =====================================

  readonly currentAgentId =
    'agent-001';


  // =====================================
  // STATUSES
  // =====================================

  readonly statuses:
    RequestStatus[] = [

      'open',

      'in-progress',

      'waiting-customer',

      'resolved',

      'closed',

    ];


  // =====================================
  // INIT
  // =====================================

  async ngOnInit(): Promise<void> {

    const id =
      this.route
        .snapshot
        .paramMap
        .get('id');


    if (!id) {

      this.error.set(
        'Request not found.'
      );

      this.loading.set(false);

      return;
    }


    await Promise.all([
      this.loadRequest(id),
      this.loadMessages(id),
      this.loadInternalNotes(id),
    ]);
  }


  // =====================================
  // LOAD REQUEST
  // =====================================

  async loadRequest(
    id: string
  ): Promise<void> {

    try {

      this.loading.set(true);

      this.error.set('');

      const data =
        await this.requestService
          .getRequestById(id);

      this.request.set(data);

    } catch (error) {

      console.error(error);

      this.error.set(
        'Unable to load this request.'
      );

    } finally {

      this.loading.set(false);
    }
  }


  // =====================================
  // LOAD MESSAGES
  // =====================================

  async loadMessages(
    id: string
  ): Promise<void> {

    try {

      this.messagesLoading.set(true);

      const data =
        await this.requestService
          .getMessages(id);

      this.messages.set(data);

    } catch (error) {

      console.error(error);

      this.error.set(
        'Unable to load conversation.'
      );

    } finally {

      this.messagesLoading.set(false);
    }
  }


  // =====================================
  // LOAD INTERNAL NOTES
  // =====================================

  async loadInternalNotes(
    id: string
  ): Promise<void> {

    try {

      this.notesLoading.set(true);

      const data =
        await this.requestService
          .getInternalNotes(id);

      this.internalNotes.set(data);

    } catch (error) {

      console.error(error);

      this.error.set(
        'Unable to load internal notes.'
      );

    } finally {

      this.notesLoading.set(false);
    }
  }


  // =====================================
  // CLAIM
  // =====================================

  async claimRequest(): Promise<void> {

    const current =
      this.request();

    if (!current) {
      return;
    }


    if (current.assignedAgentId) {

      this.error.set(
        'This request is already assigned.'
      );

      return;
    }


    if (
      current.status === 'closed'
    ) {

      this.error.set(
        'Closed requests cannot be claimed.'
      );

      return;
    }


    try {

      this.startAction();


      const updated =
        await this.requestService
          .claimRequest(
            current.id,
            this.currentAgentId
          );


      this.request.set(updated);


      this.showSuccess(
        'Request claimed successfully.'
      );

    } catch (error) {

      console.error(error);

      this.error.set(
        'Could not claim this request.'
      );

    } finally {

      this.stopAction();
    }
  }


  // =====================================
  // SEND CUSTOMER MESSAGE
  // =====================================

  async sendMessage(): Promise<void> {

    const current =
      this.request();

    const content =
      this.messageText.trim();


    if (!current || !content) {
      return;
    }


    if (
      current.status === 'resolved' ||
      current.status === 'closed'
    ) {

      this.error.set(
        'This request is not accepting messages.'
      );

      return;
    }


    try {

      this.startAction();


      const message =
        await this.requestService
          .addMessage({

            requestId:
              current.id,

            senderId:
              this.currentAgentId,

            senderRole:
              'agent',

            content,
          });


      this.messages.update(
        list => [
          ...list,
          message,
        ]
      );


      this.messageText = '';


      this.showSuccess(
        'Message sent successfully.'
      );


    } catch (error) {

      console.error(error);

      this.error.set(
        'Message could not be sent.'
      );

    } finally {

      this.stopAction();
    }
  }


  // =====================================
  // INTERNAL NOTE
  // =====================================

  async addInternalNote(): Promise<void> {

    const current =
      this.request();

    const content =
      this.internalNoteText.trim();


    if (!current || !content) {
      return;
    }


    try {

      this.startAction();


      const note =
        await this.requestService
          .addInternalNote({

            requestId:
              current.id,

            authorId:
              this.currentAgentId,

            content,
          });


      this.internalNotes.update(
        list => [
          ...list,
          note,
        ]
      );


      this.internalNoteText = '';


      this.showSuccess(
        'Internal note added.'
      );


    } catch (error) {

      console.error(error);

      this.error.set(
        'Could not add internal note.'
      );

    } finally {

      this.stopAction();
    }
  }


  // =====================================
  // UPDATE STATUS
  // =====================================

  async updateStatus(
    status: RequestStatus
  ): Promise<void> {

    const current =
      this.request();


    if (!current) {
      return;
    }


    if (
      current.status === status
    ) {
      return;
    }


    try {

      this.startAction();


      const updated =
        await this.requestService
          .updateStatus(
            current.id,
            status
          );


      this.request.set(updated);


      this.showSuccess(
        `Status changed to ${this.statusLabel(status)}.`
      );


    } catch (error) {

      console.error(error);

      this.error.set(
        'Could not update request status.'
      );

    } finally {

      this.stopAction();
    }
  }


  // =====================================
  // STATUS LABEL
  // =====================================

  statusLabel(
    status: RequestStatus
  ): string {

    const labels:
      Record<RequestStatus, string> = {

        open:
          'Open',

        'in-progress':
          'In Progress',

        'waiting-customer':
          'Waiting for Customer',

        resolved:
          'Resolved',

        closed:
          'Closed',
      };


    return labels[status];
  }


  // =====================================
  // STATUS CLASS
  // =====================================

  statusClass(
    status: RequestStatus
  ): string {

    return status;
  }


  // =====================================
  // ACTION HELPERS
  // =====================================

  canSendMessage(): boolean {

    const status =
      this.request()?.status;

    return (
      status !== 'resolved' &&
      status !== 'closed'
    );
  }


  canAddNote(): boolean {

    return this.request()?.status !==
      'closed';
  }


  canClaim(): boolean {

    const current =
      this.request();

    if (!current) {
      return false;
    }

    return (
      !current.assignedAgentId &&
      current.status !== 'closed'
    );
  }


  // =====================================
  // START / STOP
  // =====================================

  startAction(): void {

    this.actionLoading.set(true);

    this.error.set('');

    this.success.set('');
  }


  stopAction(): void {

    this.actionLoading.set(false);
  }


  showSuccess(
    message: string
  ): void {

    this.success.set(message);


    setTimeout(() => {

      this.success.set('');

    }, 3000);
  }
}
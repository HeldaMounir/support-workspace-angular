export type UserRole =
  | 'customer'
  | 'agent'
  | 'manager';

export type RequestStatus =
  | 'open'
  | 'in-progress'
  | 'waiting-customer'
  | 'resolved'
  | 'closed';

export type RequestPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent';

export type RequestCategory =
  | 'Account'
  | 'Technical'
  | 'Billing'
  | 'General'
  | 'Orders';

export interface SupportRequest {
  id: string;

  title: string;

  description: string;

  category: RequestCategory | string;

  priority: RequestPriority;

  status: RequestStatus;

  customerId: string;

  assignedAgentId: string | null;

  createdAt: string;

  updatedAt: string;
}

export interface RequestMessage {
  id: string;

  requestId: string;

  senderId: string;

  senderRole: 'customer' | 'agent' | 'manager';

  content: string;

  createdAt: string;
}

export interface InternalNote {
  id: string;

  requestId: string;

  authorId: string;

  content: string;

  createdAt: string;
}

export interface CreateMessagePayload {
  requestId: string;

  senderId: string;

  senderRole: 'customer' | 'agent' | 'manager';

  content: string;
}

export interface CreateInternalNotePayload {
  requestId: string;

  authorId: string;

  content: string;
}
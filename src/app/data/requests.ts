export type RequestStatus =
  | 'open'
  | 'in-progress'
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
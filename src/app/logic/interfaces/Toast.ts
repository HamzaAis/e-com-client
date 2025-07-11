export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // in milliseconds
  createdAt: number; // timestamp
}

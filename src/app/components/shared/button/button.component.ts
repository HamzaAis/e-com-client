import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="classes"
      (click)="onClick.emit()"
      [disabled]="disabled || isLoading"
    >
      <ng-container *ngIf="!isLoading; else loading">
        <ng-content></ng-content>
      </ng-container>
      <ng-template #loading>
        <span class="flex items-center">
          <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </span>
      </ng-template>
    </button>
  `,
  styles: [],
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() disabled: boolean = false;
  @Input() isLoading: boolean = false;
  @Output() onClick = new EventEmitter<void>();

  get classes(): string {
    const baseClasses =
      'rounded px-4 py-2 font-medium focus:outline-none focus:ring';
    const sizeClasses = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
    }[this.size];

    const variantClasses = {
      primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300',
      secondary:
        'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400',
      danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300',
    }[this.variant];

    const disabledClasses =
      this.disabled || this.isLoading ? 'opacity-50 cursor-not-allowed' : '';

    return `${baseClasses} ${sizeClasses} ${variantClasses} ${disabledClasses}`;
  }
}

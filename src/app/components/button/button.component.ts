import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button [class]="classes" (click)="onClick.emit()" [disabled]="disabled">
      <ng-content></ng-content>
    </button>
  `,
  styles: [],
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() disabled: boolean = false;
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

    const disabledClasses = this.disabled
      ? 'opacity-50 cursor-not-allowed'
      : '';

    return `${baseClasses} ${sizeClasses} ${variantClasses} ${disabledClasses}`;
  }
}

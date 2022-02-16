import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-close-button',
  templateUrl: './close-button.component.html',
  styleUrls: ['./close-button.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CloseButtonComponent {
  @Input() isHoverStyle = true;
  @Output() closeHandler: EventEmitter<void> = new EventEmitter<void>();

  btnHandler(): void {
    this.closeHandler.emit();
  }

}

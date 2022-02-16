import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { BaseSubscriberComponent } from '@core/base-subscriber-component';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-input-area',
  templateUrl: './input-area.component.html',
  styleUrls: ['./input-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputAreaComponent extends BaseSubscriberComponent implements OnInit {
  @Output() public valueChange = new EventEmitter();
  @Output() public isError = new EventEmitter();
  @Input() public currency: string;
  @Input() public maxValue: string;

  @Input() set resetInput(value: boolean) {
    if (value) {
      this.value.setValue('0');
    }
  }

  get disabled(): boolean {
    return this._disabled;
  }

  @Input() set disabled(value: boolean) {
    this._disabled = value;
    this._disabled ? this.value.disable() : this.value.enable();
  }

  public error = ''
  public value = new FormControl();

  private _disabled: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.value.valueChanges.pipe(
      takeUntil(this.notifier),
      debounceTime(300),
      tap((value) => {
        this.error = '';
        this.valueChange.emit(value);
        console.log(value);
        if (value > this.maxValue) {
          this.error = 'Insufficient funds';
        }
        this.isError.emit(this.error);
        this.cdr.markForCheck();
      })
    ).subscribe();
  }

  setMaxValue():void {
    this.value.setValue(this.maxValue);
  }

}

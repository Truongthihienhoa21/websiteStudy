import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertModalComponent implements OnInit, OnChanges {
  @Input() showModal: boolean;
  @Output() showModalChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<boolean>();
  @Input() alertLoading: boolean;

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges() {
    // console.log(this.alertLoading, this.showModal);
  }

  onClose(decide: boolean) {
    if (!decide) this.showModalChange.emit(!this.showModal);

    this.confirm.emit(decide);
  }
}

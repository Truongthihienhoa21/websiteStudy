import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { fromEvent } from 'rxjs';

import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  pluck,
} from 'rxjs/operators';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent implements OnInit, AfterViewInit {
  @ViewChild('input') inputEle: ElementRef;
  @Output() query = new EventEmitter<string>();
  value = '';
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    fromEvent(this.inputEle.nativeElement, 'keyup')
      .pipe(
        debounceTime(1000),
        pluck('target', 'value'),
        distinctUntilChanged(),
        map((value: string) => value)
      )
      .subscribe((value) => {
        this.query.emit(value);
      });
  }
}

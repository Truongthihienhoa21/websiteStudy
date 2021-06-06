import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { fromEvent, Observable, of, Subject, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() numPage: number;
  @Output() pageClick = new EventEmitter<number>();

  listpage: number[];
  currentpage = 1;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.generatePage();
  }

  generatePage() {
    this.listpage = [
      this.currentpage - 2,
      this.currentpage - 1,
      this.currentpage,
      this.currentpage + 1,
      this.currentpage + 2,
    ].filter((idx) => idx > 0 && idx <= this.numPage);
  }

  nextPage() {
    this.currentpage++;
    this.setPage();
  }

  prevPage() {
    this.currentpage--;
    this.setPage();
  }

  onClick(page: number) {
    this.currentpage = page;
    this.setPage();
  }

  setPage() {
    this.generatePage();

    this.pageClick.emit(this.currentpage);
  }
}

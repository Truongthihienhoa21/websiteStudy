import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingProgressService {
  private loading = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean>;
  constructor() {
    this.loading$ = this.loading.asObservable();
  }

  showLoading() {
    this.loading.next(true);
  }

  hideLoading() {
    this.loading.next(false);
  }
}

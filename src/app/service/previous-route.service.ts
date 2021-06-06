import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PreviousRouteService {
  private previousUrl: BehaviorSubject<string>;
  prevRoute: Observable<string>;
  constructor() {
    this.previousUrl = new BehaviorSubject(null);
    this.prevRoute = this.previousUrl.asObservable();
  }

  setPrevRoute(url) {
    this.previousUrl.next(url);
  }
}

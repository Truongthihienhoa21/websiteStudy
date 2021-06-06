import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, pluck, shareReplay, tap } from 'rxjs/operators';
import {
  CommentGroup,
  HomePage,
  HomePost,
  LessonGroup,
  NavCategory,
  Post,
} from './model/model';

export interface Lessons {
  [key: string]: Post;
}

export interface CurrentCategory {
  [key: string]: HomePost[];
}

export interface CategoryName {
  'Lập trình': NavCategory;
  anothers: NavCategory[];
}

export interface User {
  username: string;
  _id: string;
  roleId?: string[];
  email?: string;
}

export interface State {
  commentsHot: any;
  commentsNew: any;
}

@Injectable({ providedIn: 'root' })
export class Store {
  private initalState: State = {
    commentsHot: {},
    commentsNew: {},
  };
  private storeSubject = new BehaviorSubject<State>(this.initalState);
  state$: Observable<State> = this.storeSubject.asObservable();

  get valueStore() {
    return this.storeSubject.getValue();
  }

  setStore(val: Partial<State>) {
    this.storeSubject.next({ ...this.valueStore, ...val });
  }

  selectData<T>(prop: string): Observable<T> {
    return this.state$.pipe(
      filter((val) => !!val),
      map((val) => val[prop])
    );
  }

  updateStore<T, K>(prop: string, value: K) {
    const currentValue = this.valueStore[prop];

    const fieldUpdate = currentValue[value['key']];

    const newValue = { [value['key']]: [...fieldUpdate, ...value['value']] };

    return this.setStore({ [prop]: { ...currentValue, ...newValue } });
  }
}

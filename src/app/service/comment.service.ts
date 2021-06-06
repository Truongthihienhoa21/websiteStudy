import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataStoreService, DataStoreType, Query } from 'kinvey-angular-sdk';
import { combineLatest, Observable, of } from 'rxjs';
import { distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { CollectionService } from './collection.service';

export interface CommentState {
  commentsHot: CommentGroup;
  commentsNew: CommentGroup;
}

export interface CommentGroup {
  [key: string]: Comment[];
}
const initalCommentState: CommentState = {
  commentsHot: {},
  commentsNew: {},
};

@Injectable({ providedIn: 'root' })
export class CommentService extends CollectionService<CommentState> {
  constructor(http: HttpClient) {
    super(initalCommentState, 'comments', http);
  }

  updateState<T>(prop: string, payload: { key: string; value: Comment[] }) {
    const currentValue: CommentGroup = this.valueState[prop];

    const fieldUpdate: Comment[] = currentValue[payload.key] || [];

    const newValue = { [payload.key]: [...payload.value, ...fieldUpdate] };

    return this.setState({ [prop]: { ...currentValue, ...newValue } });
  }

  getComments(id: string, sort?: string, limit = 5, skip = 0) {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('skip', (skip * limit).toString())
      .set('query', JSON.stringify({ id_post: id }));

    if (sort === 'commentsHot') {
      params = params.set('sort', '{"reply":-1}');
    }

    if (sort === 'commentsHot') {
      params = params.set('sort', '{"_kmd.ect":-1}');
    }

    return this.find<Comment>(params);
  }

  getCommentsFromStore(
    id: string,
    sort: string,
    limit?: number,
    skip?: number
  ): Observable<any> {
    return combineLatest([of(id), this.selectData<any>(sort)]).pipe(
      switchMap(([id, commentGroup]) => {
        if (!commentGroup[id]) {
          return this.getComments(id, sort, limit, skip).pipe(
            tap((val) => {
              const obj = { [id]: val };
              this.setState({ [sort]: { ...obj, ...commentGroup } });
            })
          );
        } else {
          return of(commentGroup[id]);
        }
      }),
      distinctUntilChanged()
    );
  }
}

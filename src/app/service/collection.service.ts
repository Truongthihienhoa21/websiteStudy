import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, of, zip } from 'rxjs';
import { from, Observable, throwError } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  tap,
  toArray,
} from 'rxjs/operators';

export interface Query {
  skip: number;
  fields: string[];
  limit: number;
  key: string;
  descending: string;
  equalTo: { field: string; value: string };
}

export class CollectionService<T> {
  url: string;
  collection: any;

  private subject: BehaviorSubject<T>;
  state$: Observable<T>;

  constructor(intialState: T, collectionName: string, public http: HttpClient) {
    this.subject = new BehaviorSubject(intialState);
    this.state$ = this.subject.asObservable();
    this.url = `https://baas.kinvey.com/appdata/kid_ryf8NPqt_/${collectionName}`;
  }

  get valueState() {
    return this.subject.getValue();
  }

  setState(val: Partial<T>) {
    this.subject.next({ ...this.valueState, ...val });
  }

  selectData<T>(prop: string): Observable<T> {
    return this.state$.pipe(map((val) => val[prop]));
  }

  find<T>(params?): Observable<T[]> {
    return this.http.get<T[]>(this.url, { params }).pipe(
      catchError((err) => {
        // console.log({ ...err }, 'find');
        return throwError(err);
      })
    );
  }

  findById<T>(id: string, params?): Observable<T> {
    return this.http.get<T>(`${this.url}/${id}`, { params }).pipe(
      catchError((err) => {
        // console.log({ ...err }, 'findById');

        return throwError(err);
      })
    );
  }

  // delete data
  removeById(id: string) {
    return this.http.delete(`${this.url}/${id}`).pipe(
      catchError((err) => {
        // console.log({ ...err }, 'removeById');

        return throwError(err);
      })
    );
  }

  removeMultipleValue(params: any) {
    return this.http.delete(this.url, { params }).pipe(
      catchError((err) => {
        // console.log({ ...err }, 'removeMultipleValue');
        return throwError(err);
      })
    );
  }

  create(entity: any): Observable<any> {
    return this.http.post(this.url, entity).pipe(
      catchError((err) => {
        // console.log({ ...err }, 'insave');
        return throwError(err);
      })
    );
  }

  update(entity, id): Observable<any> {
    return this.http.put(`${this.url}/${id}`, entity).pipe(
      catchError((err) => {
        // console.log({ ...err }, 'insave');
        return throwError(err);
      })
    );
  }

  count(params): Observable<any> {
    const url = `${this.url}/_count`;
    return this.http.get(url, { params }).pipe(map((val: any) => val.count));
  }

  // collect column
  group(columnName: string, query?: any): Observable<string[]> {
    return this.groupDefault(columnName, query).pipe(
      filter((val) => val['count'] !== 0),
      mergeMap((val: []) => from(val)),
      map((val) => val[columnName]),
      toArray()
    );
  }

  groupDefault(columnName: string, query?: any): Observable<any> {
    const url = `${this.url}/_group`;

    const body = {
      key: {
        [columnName]: true,
      },
      initial: {
        count: 0,
      },
      reduce: 'function(doc,out){ out.count++;}',
      condition: { ...query },
    };

    return this.http.post(url, body);
  }

  getTotalItem(name?: string, key?: string) {
    let params = new HttpParams();
    if (name) {
      params = params.set('query', JSON.stringify({ content: name }));
    }

    if (key) {
      params = params.set(
        'query',
        JSON.stringify({ title: { $regex: `^${key}` } })
      );
    }
    return this.count(params).pipe(
      filter((val) => !!val),
      map((val) => Math.ceil(val / 10))
    );
  }

  createHostCategory(
    columnName: string,
    query: any,
    id: string,
    fields?: string
  ): Observable<any> {
    return this.group(columnName, query).pipe(
      mergeMap((val) => from(val)),
      mergeMap((val) => {
        const params = new HttpParams().set(
          'query',
          JSON.stringify({ $and: [{ [columnName]: val }, { idcha: id }] })
        );
        if (fields) {
          params.append('fields', fields);
        }
        const temp = this.find(params);
        return zip(of(val), temp);
      }),
      map(([val, temp]) => ({ [val]: temp })),
      toArray()
    );
  }
}

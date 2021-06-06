import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  from,
  Observable,
  of,
  throwError,
} from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  shareReplay,
  switchAll,
  switchMapTo,
  tap,
  toArray,
} from 'rxjs/operators';
import { Category, NavCategory } from '../model/model';
import { CategoryName, Store } from '../store';
import { CollectionService } from './collection.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoadingService } from './loading.service';

export interface CategoryState {
  categoryName: CategoryName;
}

const initialCategoryState: CategoryState = {
  categoryName: null,
};

@Injectable({ providedIn: 'root' })
export class CategoryService extends CollectionService<CategoryState> {
  categories$: any;

  private categorySubject = new BehaviorSubject<CategoryState>(
    initialCategoryState
  );
  categoryState$: Observable<CategoryState> =
    this.categorySubject.asObservable();

  constructor(http: HttpClient) {
    super(initialCategoryState, 'category', http);
    const params = new HttpParams().set('sort', '{"_kmd.lmt":-1}');
    this.categories$ = this.find(params).pipe(shareReplay());
  }

  getGroup(idparent: string): Observable<any[]> {
    return this.categories$.pipe(
      map((val: any) => val.filter((item) => item.idparent === idparent)),
      switchAll(),
      map((val) => ({
        parent: {
          title: val['title'],
          _id: val['_id'],
          desc: val['desc'] || '',
          img: val['img'] || '',
        },
        childs: [],
      })),
      mergeMap((val: any) =>
        combineLatest([of(val), this.getGroup(val.parent._id)])
      ),
      tap(([parent, child]) => {
        parent.childs = [...parent.childs, ...child];
      }),
      map(([parent]) => parent),
      toArray()
    );
  }

  getCategoryForEdit(): Observable<Partial<Category>[]> {
    return this.find<Category>().pipe(
      mergeMap((val) => from(val)),
      map((category: any) => ({
        idparent: category.idparent,
        title: category.title,
        _id: category['_id'],
      })),
      toArray(),
      catchError((err) => throwError(err))
    );
  }

  findPath(idparent: string, arr: Category[]): Observable<any> {
    return this.categories$.pipe(
      map((val: any) => val.find((item) => item._id === idparent)),
      tap((val: any) => arr.unshift(val)),
      mergeMap((val: any) => {
        if (!val.idparent) {
          return of(null);
        } else {
          return this.findPath(val.idparent, arr);
        }
      })
    );
  }
}

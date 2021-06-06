import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Query } from 'kinvey-angular-sdk';
import { Observable, of } from 'rxjs';
import {
  filter,
  map,
  mergeMap,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators';
import { CategoryService } from 'src/app/service/category.service';

import { Category, NavCategory, Post } from 'src/app/model/model';
import { LessonService } from 'src/app/service/lesson.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-host-category',
  templateUrl: './host-category.component.html',
  styleUrls: ['./host-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HostCategoryComponent implements OnInit {
  subCategory$: Observable<NavCategory[]>;
  currentRoute: string;
  description: string;
  currentId$: Observable<string>;
  reviews$: Observable<Post[]>;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private lessonService: LessonService,
    private router: Router,
    private http: HttpClient
  ) {
    this.currentId$ = this.route.params.pipe(
      tap(({ name }) => (this.currentRoute = name)),
      switchMap(({ name }) => {
        const query = { title: name };
        const params = new HttpParams()
          .set('fields', '_id,desc,idparent')
          .set('query', JSON.stringify(query));
        return this.categoryService.find<Category>(params);
      }),
      map((val) => val[0]),
      tap((val) => {
        if (val) {
          this.description = val.desc;
        }
      }),
      map((val) => {
        if (val) {
          return val._id;
        } else {
          this.router.navigateByUrl('/not-found');
          return null;
        }
      }),
      shareReplay()
    );

    this.subCategory$ = this.currentId$.pipe(
      filter((val) => !!val),
      switchMap((id) => this.categoryService.getGroup(id))
    );

    this.reviews$ = this.currentId$.pipe(
      filter((val) => !!val),
      mergeMap(() => this.lessonService.getHotPostFromStore())
    );
  }

  ngOnInit(): void { }
}

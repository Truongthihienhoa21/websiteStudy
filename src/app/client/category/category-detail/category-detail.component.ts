import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Query } from 'kinvey-angular-sdk';
import { combineLatest, Observable, of } from 'rxjs';
import {
  filter,
  map,
  mergeMap,
  shareReplay,
  switchMap,
  tap,
  throttleTime,
} from 'rxjs/operators';
import { Category, HomePost, NavCategory, Post } from 'src/app/model/model';
import { LessonService } from 'src/app/service/lesson.service';
import { CategoryService } from 'src/app/service/category.service';
import { CurrentCategory, Store } from 'src/app/store';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryDetailComponent implements OnInit {
  title: string;
  description: string;
  arrName$: Observable<NavCategory[]>;
  posts$: Observable<HomePost[]>;
  currentId$: Observable<string>;
  reviews$: Observable<any[]>;
  numPage$: Observable<number>;
  skipPage = 1;

  constructor(
    private lessonService: LessonService,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const currentRoute$ = this.route.params.pipe(shareReplay());
    this.currentId$ = currentRoute$.pipe(
      switchMap(({ name }) => {
        const query = { title: name };
        const params = new HttpParams().set('query', JSON.stringify(query));
        return this.categoryService.find<Category>(params).pipe(
          map((val) => val[0]),
          tap((val) => {
            if (val) {
              this.description = val.desc;
              this.title = val.title;
            }
          }),
          map((val) => {
            if (val) {
              return val._id;
            } else {
              this.router.navigateByUrl('/not-found');
              return null;
            }
          })
        );
      }),
      shareReplay()
    );

    this.arrName$ = this.currentId$.pipe(
      filter((val) => !!val),
      switchMap((id: string) => {
        return this.categoryService.getGroup(id);
      })
    );

    this.posts$ = this.currentId$.pipe(
      filter((val) => !!val),
      mergeMap(() => currentRoute$),
      switchMap(({ name }) =>
        this.lessonService.getCategoryDetailFromStore(name, this.skipPage)
      )
    );

    this.reviews$ = this.currentId$.pipe(
      filter((val) => !!val),
      mergeMap(() => this.lessonService.getHotPostFromStore()),
      shareReplay()
    );

    this.numPage$ = currentRoute$.pipe(
      switchMap(({ name }) => this.lessonService.getTotalItem(name))
    );
  }

  changePosts(numberClick: number) {
    this.skipPage = numberClick;

    this.posts$ = this.lessonService.getCategoryDetailFromStore(
      this.title,
      this.skipPage
    );

    window.scrollTo(0, 200);
  }
}

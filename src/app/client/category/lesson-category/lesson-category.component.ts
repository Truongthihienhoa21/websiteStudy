import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, EMPTY, forkJoin, Observable, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators';
import { LessonService } from 'src/app/service/lesson.service';
import { Category, GroupPost } from 'src/app/model/model';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-lesson-category',
  templateUrl: './lesson-category.component.html',
  styleUrls: ['./lesson-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonCategoryComponent implements OnInit {
  currentLessons$: Observable<GroupPost[]>;
  category$: Observable<Category>;
  currentId$: Observable<string>;
  reviews$: Observable<any>;
  constructor(
    private route: ActivatedRoute,
    private lessonService: LessonService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.currentId$ = this.route.params.pipe(
      map(({ id }) => id),
      shareReplay()
    );

    this.category$ = this.currentId$.pipe(
      switchMap((id) => this.categoryService.findById<Category>(id)),
      catchError((err) => {
        if (err.name === 'NotFoundError') {
          this.router.navigateByUrl('/not-found');
        }
        return of(null);
      }),
      shareReplay()
    );

    this.currentLessons$ = this.category$.pipe(
      filter((val) => !!val),
      mergeMap(() => this.currentId$),
      switchMap((id) => this.lessonService.getRelatePostsFromStore(id))
    );

    this.reviews$ = this.category$.pipe(
      filter((val) => !!val),
      mergeMap(() => this.lessonService.getHotPostFromStore())
    );
  }

  ngOnInit(): void {}
}

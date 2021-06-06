import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  finalize,
  pluck,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators';
import { GroupPost, Post } from 'src/app/model/model';
import { ErrorHandleService } from 'src/app/service/error-handle.service';
import { LessonService } from 'src/app/service/lesson.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-postdetail',
  templateUrl: './postdetail.component.html',
  styleUrls: ['./postdetail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostdetailComponent implements OnInit, OnDestroy {
  post$: Observable<Post>;
  relatePost$: Observable<GroupPost[]>;
  idParent: string;
  loadingPost: boolean;

  constructor(
    private route: ActivatedRoute,
    private lessonService: LessonService,
    private router: Router,
    private handleErr: ErrorHandleService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const canLoadPost$ = this.authService
      .selectAuthData<boolean>('canLoadPost')
      .pipe(
        filter((val) => !!val),
        shareReplay()
      );

    this.post$ = canLoadPost$.pipe(
      switchMap(() =>
        this.route.params.pipe(
          switchMap(({ id }) => this.lessonService.getPostDetail(id)),
          catchError((err) => {
            this.handleErr.handleError(err);

            return of(null);
          }),

          distinctUntilChanged(),
          shareReplay()
        )
      )
    );

    this.relatePost$ = canLoadPost$.pipe(
      switchMap(() =>
        this.post$.pipe(
          filter((val) => !!val),
          pluck('idcha'),
          tap((id) => (this.idParent = id)),
          switchMap((id) => this.lessonService.getRelatePostsFromStore(id))
        )
      )
    );
  }

  ngOnDestroy() {}
}

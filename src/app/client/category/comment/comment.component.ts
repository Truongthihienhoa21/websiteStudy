import { HttpParams } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Query } from 'kinvey-angular-sdk';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import {
  catchError,
  filter,
  map,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { CommentService } from 'src/app/service/comment.service';
import { ErrorHandleService } from 'src/app/service/error-handle.service';
import { SwalAlertComponent } from 'src/app/shared/swal-alert/swal-alert.component';
import { Comment } from '../../../model/model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  providers: [SwalAlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent implements OnInit, OnDestroy {
  id_post: string;
  activeComment = true;
  commentList$: Observable<Comment[]>;
  skipHot = 0;
  skipNew = 0;
  totalComment$: Observable<number>;
  sort = 'commentsHot';
  subscription: Subscription[] = [];
  constructor(
    private commentService: CommentService,
    private route: ActivatedRoute,
    private router: Router,
    private swal: SwalAlertComponent,
    private handleErr: ErrorHandleService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit(): void {
    const id$ = this.route.params.pipe(
      map(({ id }) => id),
      shareReplay()
    );

    this.totalComment$ = id$.pipe(
      tap((id) => (this.id_post = id)),
      switchMap((id) => this.getTotalComment(id)),
      shareReplay()
    );

    this.commentList$ = id$.pipe(
      switchMap((id) =>
        this.commentService.getCommentsFromStore(id, this.sort)
      ),
      catchError((err) => {
        this.handleErr.handleError(err);

        return of(null);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  filterComment(sort: string) {
    this.activeComment = !this.activeComment;
    this.sort = sort;
    this.commentList$ = this.commentService.getCommentsFromStore(
      this.id_post,
      this.sort
    );
  }

  onSubmit(newComment: Comment) {
    // create new comment
    newComment.id_comment = this.id_post;
    newComment.id_post = this.id_post;
    const sub = this.commentService.create(newComment).subscribe((val) => {
      const payload = {
        key: this.id_post,
        value: [val],
      };
      this.commentService.updateState(this.sort, payload);
      this.swal.swalSuccess(null, 'Comment created');
      this.totalComment$ = this.totalComment$.pipe(map((val) => val + 1));
    });

    this.subscription.push(sub);
  }

  loadMoreComment() {
    if (this.sort === 'commentsHot') {
      this.skipHot++;
    } else {
      this.skipNew++;
    }
    const newComment$ = this.commentService.getComments(
      this.id_post,
      this.sort,
      5,
      this.sort === 'commentsHot' ? this.skipHot : this.skipNew
    );

    const sub = newComment$.subscribe((val) => {
      const payload = { key: this.id_post, value: [...val] };
      this.commentService.updateState(this.sort, payload);
    });

    this.subscription.push(sub);
  }

  getTotalComment(id: string) {
    const params = new HttpParams().set(
      'query',
      JSON.stringify({ id_post: id })
    );
    return this.commentService.count(params);
  }
}

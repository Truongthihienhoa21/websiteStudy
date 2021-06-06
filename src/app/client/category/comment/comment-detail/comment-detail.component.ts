import {
  Component,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { CommentService } from 'src/app/service/comment.service';
import { Comment } from '../../../../model/model';

@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
  styleUrls: ['./comment-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Input() commentList$: Observable<Comment[]>;
  @Input() sort: string;
  @Output() sortChange = new EventEmitter<string>();
  subComment$: Observable<any[]>;
  id_post: string;
  id_comment: string;
  currentComment: Comment;
  showTextEditor = false;

  sub: Subscription;
  constructor(private commentService: CommentService) { }

  ngOnInit(): void { }

  ngOnChanges(changes: any) { }

  showSubComment(id: string) {
    this.id_post = id;

    this.subComment$ = this.commentService.getCommentsFromStore(
      id,
      this.sort,
      10
    );
  }

  showEditor(comment: Comment) {
    this.showTextEditor = true;
    this.currentComment = comment;
  }

  getTimeComment(fullTime: Date) {
    const time =
      (new Date().getTime() - new Date(fullTime).getTime()) / 3600000;

    return Math.floor(time);
  }

  onSubmit(newComment: Comment) {
    // create new comment
    newComment.id_comment = this.currentComment.id_comment;
    newComment.id_post = this.currentComment._id;
    const newComment$ = this.commentService.create(newComment);

    // update currentComment
    // console.log(this.currentComment);

    this.currentComment.reply = this.currentComment.reply + 1;
    const commentUpdated$ = this.commentService.update(
      this.currentComment,
      this.currentComment._id
    );

    this.sub = combineLatest([newComment$, commentUpdated$]).subscribe(
      (val) => {
        const payload = {
          key: this.currentComment._id,
          value: [val[0]],
        };
        this.commentService.updateState(this.sort, payload);
        this.currentComment = null;
      }
    );
    this.showTextEditor = false;
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}

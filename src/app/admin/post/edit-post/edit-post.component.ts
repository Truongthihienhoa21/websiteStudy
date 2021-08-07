import { LoadingProgressService } from './../../../loading-progress/loading-progress.service';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { finalize, mergeMap } from 'rxjs/operators';
import { Post } from 'src/app/model/model';
import { CommentService } from 'src/app/service/comment.service';
import { LessonService } from 'src/app/service/lesson.service';
import { SwalAlertComponent } from 'src/app/shared/swal-alert/swal-alert.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
  providers: [SwalAlertComponent],
})
export class EditPostComponent implements OnInit, OnDestroy {
  posts$: Observable<Partial<Post>[]>;
  numPage$: Observable<number>;
  skipPage = 0;
  postDelete: Post;
  currentSearch: string;
  sub: Subscription;
  constructor(
    private lessonService: LessonService,
    private commentService: CommentService,
    private swal: SwalAlertComponent,
    private loading: LoadingProgressService
  ) {

  }

  ngOnInit(): void {
    this.getPosts();
    this.getPaginationPage();
  }

  onDelete(post: Post) {
    this.postDelete = post;
    this.swal.swalConfirm(post.title + ' post').then((result) => {
      if (result.value) {
        this.loading.showLoading();
        this.sub = this.resolveDelete()
          .pipe(finalize(() => this.loading.hideLoading()))
          .subscribe(
            (val) => {
              // this.lessonService.deletePost(post);
              this.getPosts()

              const numpage = Math.ceil(
                this.lessonService.valueState.postsEdit.length / 10
              );
              this.numPage$ = of(numpage);
              this.swal.swalSuccess();
            },
            (err) => {
              // console.log({ ...err });
              if (err.request.status === 0) {
                this.swal.swalError500();
              }
            }
          );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.postDelete = null;
        this.swal.swalCancel('Post');
      }
    });
  }

  resolveDelete() {
    return this.lessonService
      .removeById(this.postDelete._id)
      .pipe(mergeMap(() => this.deleteMultiple(this.postDelete._id)));
  }

  deleteMultiple(idparent: string) {
    const params = new HttpParams().set(
      'query',
      JSON.stringify({ id_comment: idparent })
    );
    return this.commentService.removeMultipleValue(params);
  }

  getPosts(key?: string) {
    const query = {
      limit: 10,
      skip: 10 * (this.skipPage),
      fields: 'title',
      sort: '{"_kmd.lmt":-1}',
    };
    let params = new HttpParams()
    .set('sort', '{"_kmd.lmt":-1}')
    .set('limit', '10')
    .set('skip', (10 * (this.skipPage - 1)).toString())
    .set('fields', 'title')
    if (key) {
       params = params.set('query', JSON.stringify({ title: { $regex: `^${key}` } }));

      this.posts$ = this.lessonService.find(params);
    } else {
      this.posts$ = this.lessonService.find(params);
    }

    // this.categorys$ = this.categoryService.find<Category>(params);
    // this.posts$ = this.lessonService.find(params);

  }

  getPaginationPage(key?: string) {
    this.numPage$ = this.lessonService.getTotalItem(null, key);
  }

  onSearch(key: string) {
    this.getPosts(key);
    this.getPaginationPage(key);
    this.currentSearch = key;
  }

  changePosts(event: any) {
    
    this.skipPage = event.page;
    this.getPosts(this.currentSearch);
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}

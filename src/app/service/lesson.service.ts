import { CommentService } from 'src/app/service/comment.service';
import { Injectable } from '@angular/core';
import { DataStoreService, DataStoreType, Query } from 'kinvey-angular-sdk';
import { combineLatest, from, of } from 'rxjs';
import { map, mergeMap, switchMap, tap, toArray } from 'rxjs/operators';
import { HomePage, HomePost, LessonGroup, Post } from '../model/model';
import { CurrentCategory, Lessons, Store } from '../store';
import { CollectionService } from './collection.service';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface PostsEdit {
  [key: number]: Partial<Post>[];
}

export interface PostState {
  currentCategory: CurrentCategory;
  homePagePost: HomePage[];
  hotPosts: Post[];
  lessonGroup: LessonGroup;
  lessons: Lessons;
  postsEdit: Partial<Post>[];
}

const initialPostState: PostState = {
  currentCategory: {},
  homePagePost: null,
  hotPosts: null,
  lessonGroup: {},
  lessons: {},
  postsEdit: null,
};

@Injectable({ providedIn: 'root' })
export class LessonService extends CollectionService<PostState> {
  constructor(http: HttpClient, private commentService: CommentService) {
    super(initialPostState, 'posts', http);
    // this.state$.subscribe(console.log);

  }

  updatePostState<T>(
    prop: string,
    payload: { key: string | number; value: T[]; existNum?: number }
  ) {
    const currentValue = this.valueState[prop];

    let fieldUpdate: any;
    if (payload.key) {
      fieldUpdate = currentValue[payload.key];
      const newValue = { [payload.key]: [...fieldUpdate, ...payload.value] };
      return this.setState({ [prop]: { ...currentValue, ...newValue } });
    } else {
      fieldUpdate = currentValue;

      if (payload.existNum) {
        fieldUpdate.splice(payload.existNum, 10, ...payload.value);

        return this.setState({ [prop]: [...fieldUpdate] });
      }
      return this.setState({ [prop]: [...fieldUpdate, ...payload.value] });
    }
  }

  createquery(content?: string) {
    let params = new HttpParams()
      .set('sort', '{"_kmd.lmt":-1}')
      .set('limit', '5')
      .set('fields', 'desc,title,img');

    if (content) {
      params = params.set('query', JSON.stringify({ content: content }));
    }
    return params;
  }

  getHomeTutorial(homeFields: { field: string; order: number }[]) {
    return from(homeFields).pipe(
      mergeMap((item) => {
        const query = this.createquery(item.field);
        return combineLatest([of(item), this.find<HomePost>(query)]);
      }),
      map(([item, val]) => ({
        posts: { [item.field]: val },
        order: item.order,
      })),
      toArray(),
      map((arr) => arr.sort((a, b) => a.order - b.order)),
      tap((val) => {
        this.setState({ homePagePost: val });
      })
    );
  }

  // hot posts
  getHotPost() {
    return this.commentService.groupDefault('id_comment').pipe(
      mergeMap((val) => from(val)),
      mergeMap((val: any) =>
        combineLatest([of(val.count), this.findById<Post>(val.id_comment)])
      ),
      map(([count, post]) => ({ ...post, count: count })),
      toArray(),
      map((val) => val.sort((a, b) => b.count - a.count))
    );
  }

  getHotPostFromStore() {
    return this.selectData<Post[]>('hotPosts').pipe(
      mergeMap((hotPosts) => {
        if (!hotPosts) {
          return this.getHotPost().pipe(
            tap((val) => {
              this.setState({ hotPosts: val });
            })
          );
        } else {
          return of(hotPosts);
        }
      })
    );
  }

  // lessoncategory - related posts;
  getRelatePosts(idparent: string) {
    const params = { idcha: idparent };

    return this.createHostCategory('group', params, idparent, 'title,group');
  }

  getRelatePostsFromStore(idparent: string) {
    return this.selectData<LessonGroup>('lessonGroup').pipe(
      switchMap((groups) => {
        if (!groups[idparent]) {
          return this.getRelatePosts(idparent).pipe(
            tap((val) => {
              const obj = { [idparent]: val };
              this.setState({ lessonGroup: { ...obj, ...groups } });
            })
          );
        } else {
          return of(groups[idparent]);
        }
      })
    );
  }

  // postdetail
  getPostDetail(id: string) {
    return this.selectData<Lessons>('lessons').pipe(
      switchMap((lessons) => {
        if (!lessons[id]) {
          return this.findById<Post>(id).pipe(
            tap((val) => {
              const obj = { [id]: val };
              this.setState({ lessons: { ...obj, ...lessons } });
            })
          );
        } else {
          return of(lessons[id]);
        }
      })
    );
  }

  // categoryDetail;
  getPostCategoryDetail(name: string, skip: number) {
    const params = new HttpParams()
      .set('query', JSON.stringify({ content: name }))
      .set('limit', '10')
      .set('skip', (10 * (skip - 1)).toString())
      .set('fields', 'desc,title,img');
    return this.find<HomePost>(params);
  }

  getCategoryDetailFromStore(name: string, skip: number) {
    return this.selectData<CurrentCategory>('currentCategory').pipe(
      switchMap((currentCategory) => {
        if (!currentCategory[name]) {
          return this.getPostCategoryDetail(name, skip).pipe(
            tap((val) => {
              const obj = { [name]: val };
              this.setState({
                currentCategory: { ...obj, ...currentCategory },
              });
            })
          );
        } else if (
          !currentCategory[name][10 * (skip - 1)] &&
          currentCategory[name].length !== 0
        ) {
          return this.getPostCategoryDetail(name, skip).pipe(
            tap((val) => {
              const payload = {
                key: name,
                value: val,
              };
              this.updatePostState<HomePost>('currentCategory', payload);
            })
          );
        } else {
          return of(currentCategory[name].slice(10 * (skip - 1), 10 * skip));
        }
      })
    );
  }

  getPostsEdit(query: any) {
    const { sort, limit, skip, fields } = query;

    let params = new HttpParams()
      .set('sort', sort)
      .set('limit', limit.toString())
      .set('skip', skip.toString())
      .set('fields', fields);

    return this.selectData<Partial<Post>[]>('postsEdit').pipe(
      switchMap((currentPosts) => {
        if (!currentPosts) {
          return this.find<Partial<Post>>(params).pipe(
            tap((val) => {
              console.log(val);

              this.setState({ postsEdit: [...val] });
            })
          );
        } else if (
          currentPosts[query.skip] === undefined &&
          currentPosts.length !== 0
        ) {
          return this.find<Partial<Post>>(params).pipe(
            tap((val) => {
              const payload = {
                key: '',
                value: val,
              };

              if (!currentPosts[query.skip - 10] && query.skip > 10) {
                const emptyArr = new Array(10);
                emptyArr.fill(null);
                payload.value = [...emptyArr, ...payload.value];
              }

              this.updatePostState<Partial<Post>>('postsEdit', payload);
            })
          );
        } else if (currentPosts[query.skip] === null) {
          return this.find<Partial<Post>>(params).pipe(
            tap((val) => {
              const payload = {
                key: '',
                value: val,
                existNum: query.skip,
              };

              this.updatePostState<Partial<Post>>('postsEdit', payload);
            })
          );
        } else {
          return of(currentPosts.slice(query.skip, 10 + query.skip));
        }
      })
    );
  }

  deletePost(post: Post) {
    const currentPosts = this.valueState.postsEdit;

    const newValue = currentPosts.filter((item) => item._id !== post._id);

    return this.setState({ postsEdit: [...newValue] });
  }

  updatePost(post: Partial<Post>, type: string) {
    let currentPosts = this.valueState.postsEdit;
    if (currentPosts) {
      if (type === 'update') {
        let indexUpdate = currentPosts.findIndex(
          (item) => item._id === post._id
        );

        currentPosts[indexUpdate] = post;
      } else {
        currentPosts.unshift(post);
        currentPosts.pop();
      }
    }
  }
}

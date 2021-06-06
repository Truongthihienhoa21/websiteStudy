import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Query } from 'kinvey-angular-sdk';
import { combineLatest, Observable, of } from 'rxjs';
import {
  filter,
  map,
  mergeMap,
  shareReplay,
  switchAll,
  tap,
  toArray,
} from 'rxjs/operators';
import { Category, Post } from '../model/model';
import { CategoryService } from './category.service';
import { LessonService } from './lesson.service';

export abstract class category {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  abstract countPost(): number;
}

export class cateParent extends category {
  children: cateParent[];
  value?: number;

  constructor(name: string, children: cateParent[]) {
    super(name);
    this.children = children;
  }

  countPost() {
    const a = this.value ? this.value : 0;
    return (
      a +
      this.children.reduce(
        (a, b) => (b.value ? a + b.value : a + b.countPost()),
        0
      )
    );
  }

  addChild(category: cateParent) {
    this.children.push(category);
  }
}

export interface DateData {
  date: number;
  value: number;
  day: string;
}

export interface PostDt {
  day: string;
  date: number;
  year: number;
  month: number;
  week: number;
}

@Injectable()
export class ChartService {
  totalPostDt: Observable<PostDt[]>;
  allCategories$: any;
  constructor(
    private lessonService: LessonService,
    private categoryService: CategoryService
  ) {
    this.totalPostDt = this.countPostDate().pipe(shareReplay());
    this.allCategories$ = this.categoryService.find().pipe(shareReplay());
  }

  ISO8601_week_no(dt: Date) {
    var tdt = new Date(dt);
    var dayn = (tdt.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);
    var firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) {
      tdt.setMonth(0, 1 + ((4 - tdt.getDay() + 7) % 7));
    }
    return 1 + Math.ceil((firstThursday - +tdt) / 604800000);
  }

  // chart
  countPostDate() {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return this.lessonService.groupDefault('_kmd.ect').pipe(
      map((val) =>
        val.map((item) => {
          const time = new Date(item['_kmd.ect']);
          return {
            day: days[time.getDay()],
            date: time.getDate(),
            month: time.getMonth() + 1,
            year: time.getFullYear(),
            week: this.ISO8601_week_no(time),
          };
        })
      )
    );
  }

  countPostOfYear(year: number) {
    return this.totalPostDt.pipe(
      map((val) => val.filter((item) => item.year === year)),
      map((yearData) => {
        let obj = {
          value: yearData.length,
          childs: [],
        };

        yearData.forEach((item) => {
          const monthIdx = obj.childs.findIndex((i) => i.month === item.month);

          if (monthIdx === -1) {
            const dataMonth = { month: item.month, value: 1 };
            obj.childs.push(dataMonth);
          } else {
            obj.childs[monthIdx].value += 1;
          }
        });
        obj.childs.sort((a, b) => a.month - b.month);

        return obj;
      }),

      shareReplay()
    );
  }

  countPostOfMonth(year: number, month: number) {
    return this.totalPostDt.pipe(
      map((val) =>
        val.filter((item) => item.year === year && item.month === month)
      ),
      map((monthData) => {
        let obj: {
          value: number;
          childs: DateData[];
        };
        obj = {
          value: monthData.length,
          childs: [],
        };
        monthData.forEach((item) => {
          const dateIdx = obj.childs.findIndex((i) => i.date === item.date);

          if (dateIdx === -1) {
            const dataDate = { date: item.date, value: 1, day: item.day };
            obj.childs.push(dataDate);
          } else {
            obj.childs[dateIdx].value += 1;
          }
        });
        obj.childs.sort((a, b) => a.date - b.date);
        return obj;
      })
    );
  }

  countPostOfWeek(year: number, week: number) {
    return this.totalPostDt.pipe(
      switchAll(),
      filter((val) => val.year === year && val.week === week),
      toArray(),
      map((weekData) => {
        let obj: {
          value: number;
          childs: DateData[];
        } = {
          value: weekData.length,
          childs: [],
        };

        weekData.forEach((item) => {
          const dateIdx = obj.childs.findIndex((i) => i.date === item.date);

          if (dateIdx === -1) {
            const dataDate = {
              date: item.date,
              value: 1,
              day: item.day,
            };
            obj.childs.push(dataDate);
          } else {
            obj.childs[dateIdx].value += 1;
          }
        });
        obj.childs.sort((a, b) => a.date - b.date);
        return obj;
      })
    );
  }

  // chart with category
  getPostExist(): Observable<{ [key: string]: number }> {
    return this.lessonService.groupDefault('idcha').pipe(
      map((val) => {
        let output = {};
        val.forEach((item) => {
          let obj = {};
          obj[item['idcha']] = item['count'];
          output = { ...output, ...obj };
        });

        return output;
      })
    );
  }

  getPostOfCategory(
    idparent: string,
    postExist: Observable<{ [key: string]: number }>
  ): Observable<cateParent[]> {
    const params = new HttpParams().set(
      'query',
      JSON.stringify({ idparent: idparent })
    );

    return this.allCategories$.pipe(
      map((val: any[]) => val.filter((item) => item.idparent === idparent)),
      switchAll(),

      map((val: any) => ({
        cate: new cateParent(val.title, []),
        _id: val['_id'],
      })),
      mergeMap((val: any) =>
        combineLatest([
          of(val),
          this.getPostOfCategory(val._id, postExist),
          postExist,
        ])
      ),
      tap(([parent, child, post]) => {
        child.forEach((item) => {
          parent.cate.addChild(item);
        });
        if (child.length === 0) {
          parent.cate.value = post[parent._id] || 0;
        }
      }),
      map(([parent]) => parent.cate),
      toArray()
    );
  }

  filterCategory(): Observable<{ id: string; title: string }[]> {
    const allCategory$ = this.categoryService.find<Category>().pipe(
      map((val) => {
        let output = {};
        val.forEach((item) => {
          let obj = {};
          obj[item._id] = item.title;
          output = { ...output, ...obj };
        });
        return output;
      })
    );

    const query = new Query();
    query.fields = ['title, _id'];
    const cateFilter$ = this.categoryService.groupDefault('idparent').pipe(
      switchAll(),
      filter((val) => val['count'] > 1),
      filter((val) => val['idparent'] !== ''),
      toArray()
    );

    return combineLatest([allCategory$, cateFilter$]).pipe(
      map(([all, filter]) => {
        return filter.map((item: any) => ({
          id: item.idparent,
          title: all[item.idparent],
        }));
      })
    );
  }

  // chart with view
  countPostOfView(year: number, month: number, limit: number = 5) {
    const key = year.toString() + month;

    const params = new HttpParams()
      .set('sort', JSON.stringify({ [`view.${key}`]: -1 }))
      .set('limit', limit.toString())
      .set('fields', 'idcha,title,view,content');

    return this.lessonService.find<Post>(params).pipe(
      switchAll(),
      map((post: any) => ({
        content: post.content,
        idcha: post.idcha,
        view: post.view ? post.view[key] : 0,
        title: post.title,
        _id: post._id,
      })),
      toArray()
    );
  }

  countPostViewByCategory(year: number, month: number) {
    return this.countPostOfView(year, month, 0).pipe(
      map((val) => {
        let output = {};

        val.forEach((item) => {
          let obj = {};
          if (output[item.idcha]) {
            output[item.idcha] = output[item.idcha] + item.view;
          } else {
            output[item.idcha] = item.view;
          }
        });
        return output;
      })
    );
  }
}

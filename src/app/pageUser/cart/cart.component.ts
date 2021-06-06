import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { CoursesService } from 'src/app/service/courses.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  coursesInCart$: Observable<any[]>;
  totalPrice$: Observable<number>;
  relatedCourses$: Observable<any[]>;
  constructor(private coursesService: CoursesService) { }

  ngOnInit(): void {
    this.coursesInCart$ = this.coursesService.courseInCart
      .asObservable()
      .pipe(shareReplay());

    this.totalPrice$ = this.coursesInCart$.pipe(
      map((val) =>
        val.reduce((total, item) => total + parseFloat(item.price), 0)
      )
    );

    // this.relatedCourses$ = this.coursesInCart$.pipe(
    //   switchMap((val) => {
    //     console.log(val);

    //     const categories = val.map((item) => item.category.value);

    //     const id = val.map((item) => item._id);

    //     return this.getRelatedCourses([...new Set(categories)], id);
    //   })
    // );

    // this.relatedCourses$.subscribe();
  }

  removeCourse(course) {
    this.coursesService.removeCourseInCart(course);
  }
  // {"$and":[{"$or":[{"category.value":"design"},{"category.value":"dev"}]},

  // {"$or":[{"_id":{"$ne": "60842a1891751b0013e6ddc3"}},{"_id":{"$ne": "60842a1891751b0013e6ddc3"}}]}

  getRelatedCourses(categories: any[], id: string[]) {
    // let querycategory = [];

    // categories.forEach(item => {
    //   if(!querycategory.includes(item.))
    // })

    const querycategory = categories
      .map((item) =>
        JSON.stringify({
          'category.value': item,
        })
      )
      .join(',');

    // console.log(querycategory);

    const cate = JSON.stringify({ $or: [`${querycategory}`] });
    // console.log(cate);

    const idquery = id
      .map((item) => JSON.stringify({ _id: { $ne: item } }))
      .join(',');

    const idq = JSON.stringify({ $and: [`${idquery}`] });

    const query = {
      $and: [cate, idq],
    };

    // console.log(JSON.stringify(query));

    const params = new HttpParams()
      // .set('fields', 'img,title,rating,student,price')
      .set('query', JSON.stringify(query));
    // .set('limit', '10')
    // .set('sort', JSON.stringify({ student: -1 }));

    return this.coursesService.find(params);
  }
}

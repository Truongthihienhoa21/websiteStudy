import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { Category } from 'src/app/model/model';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-path-category',
  templateUrl: './path-category.component.html',
  styleUrls: ['./path-category.component.scss'],
})
export class PathCategoryComponent implements OnInit, OnChanges {
  @Input() idCategory: string;
  @Input() postTitle: string;
  path$: Observable<Category[]>;

  constructor(private categoryService: CategoryService) { }

  ngOnChanges() {
    if (this.idCategory)
      this.path$ = this.findPath(this.idCategory).pipe(
        map((val) => val.filter((item) => item.title !== 'Lập trình')),
        catchError((err) => {
          // console.log({ ...err }, '22222222222222222222222');
          return throwError(err);
        }),
        shareReplay()
      );
  }

  ngOnInit(): void { }

  findPath(id: string): Observable<Category[]> {
    let arr = [];
    return this.categoryService.findPath(id, arr).pipe(map(() => arr));
  }

  getRouteLink(index: number, item: Category) {
    switch (index) {
      case 0:
        return ['/category', item.title];

      case 1:
        return ['/category/detail', item.title];

      case 2:
        return ['/category', item.title, item._id];
    }
  }
}

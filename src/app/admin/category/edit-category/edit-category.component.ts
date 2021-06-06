import { HttpParams } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Query } from 'kinvey-angular-sdk';
import { combineLatest, from, Observable, of } from 'rxjs';
import { filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Category } from 'src/app/model/model';
import { CategoryService } from 'src/app/service/category.service';
import { DataStoreComponent } from 'src/app/service/test.service';
import { SearchInputComponent } from 'src/app/shared/search-input/search-input.component';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss'],
})
export class EditCategoryComponent implements OnInit {
  categorys$: Observable<Category[]>;
  numPage$: Observable<number>;
  skipPage = 0;
  currentSearch: string;
  @ViewChild(SearchInputComponent, { static: true })
  search: SearchInputComponent;

  constructor(private categoryService: CategoryService) {
    this.getCategory();
    this.getPaginationPage();
  }

  ngOnInit(): void { }

  getCategory(key?: string) {
    let params = new HttpParams()
      .set('sort', '{"_kmd.lmt":-1}')
      .set('limit', '10')
      .set('skip', (10 * (this.skipPage - 1)).toString());

    if (key) {
      params = params.set(
        'query',
        JSON.stringify({ title: { $regex: `^${key}` } })
      );
    }

    this.categorys$ = this.categoryService.find<Category>(params);
  }

  getPaginationPage(key?: string) {
    this.numPage$ = this.categoryService.getTotalItem(null, key);
  }

  changeCategory(event) {
    this.skipPage = event.page;
    this.getCategory(this.currentSearch);
  }

  onSearch(key: string) {
    this.getCategory(key);
    this.getPaginationPage(key);
    this.currentSearch = key;
    this.skipPage = 0
  }

  deleted() {
    this.skipPage = 0;
    this.getCategory();
    this.getPaginationPage(this.currentSearch);
    this.search.inputEle.nativeElement.value = '';
  }
}

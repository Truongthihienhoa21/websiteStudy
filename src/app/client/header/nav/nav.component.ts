import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { finalize, map, shareReplay, tap } from 'rxjs/operators';
import { NavCategory } from 'src/app/model/model';
import { CategoryService } from 'src/app/service/category.service';
import { LoadingService } from 'src/app/service/loading.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  Main_block = 'Lập trình';
  Course_block = 'Khóa học';
  Assign_block = 'Bài tập';
  laptrinh: NavCategory;
  anothers: NavCategory[];
  subscription: Subscription[] = [];
  constructor(
    private categoryService: CategoryService,
    private loading: LoadingService
  ) {}

  ngOnInit(): void {
    this.loading.loadingOn();
    const sub = this.categoryService
      .getGroup('')
      .subscribe((categories: NavCategory[]) => {
        this.loading.loadingOff();

        this.laptrinh = categories.find(
          (item) => item.parent.title === this.Main_block
        );

        this.anothers = categories.filter(
          (item) => item.parent.title !== this.Main_block
        );
      });

    this.subscription.push(sub);
  }

  ngOnDestroy() {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }
}

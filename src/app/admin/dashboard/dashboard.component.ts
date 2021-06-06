import { Category, Post } from './../../model/model';
import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Query } from 'kinvey-angular-sdk';
import { Label } from 'ng2-charts';
import { LessonService } from 'src/app/service/lesson.service';
import { ChartService } from 'src/app/service/chart.service';
import {
  map,
  tap,
  switchAll,
  mergeMap,
  toArray,
  shareReplay,
  takeUntil,
} from 'rxjs/operators';
import { CategoryService } from 'src/app/service/category.service';
import { combineLatest, of, Observable, from, Subject } from 'rxjs';

export interface DateChart {
  day?: string;
  date?: number;
  month?: number;
  year?: number;
  sweek?: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [ChartService],
})
export class DashboardComponent implements OnInit, OnDestroy {
  type = ['Năm', 'Tháng', 'Tuần', 'Category', 'Top 5 post trong tháng'];

  barChartOptions1: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          ticks: {
            min: 0,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            min: 0,
          },
        },
      ],
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: 'blue',
      },
    },
  };

  barChartOptions2: ChartOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        color: 'blue',
      },
    },
  };
  barChartLabels: Label[];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [pluginDataLabels];
  barChartData: ChartDataSets[];

  chartReady: boolean;
  yearSelect: number[];
  monthSelect: number[];
  weekSelect: number[];
  categorySelect: { id: string; title: string }[];

  currentTab = 0;
  currentYear = 2021;
  currentMonth = 1;
  currentWeek = 1;
  currentCategory = '';
  totalPost: number;
  postExist: Observable<{ [key: string]: number }>;

  unsubscribeSignal: Subject<void> = new Subject();
  unSub$ = this.unsubscribeSignal.asObservable();

  constructor(
    private chartService: ChartService,
    private lesson: LessonService
  ) {}

  ngOnInit(): void {
    this.getChart(this.currentTab, this.currentYear);

    this.postExist = this.chartService.getPostExist().pipe(shareReplay());

    this.chartService
      .filterCategory()
      .pipe(takeUntil(this.unSub$))
      .subscribe((val) => {
        this.categorySelect = val;
      });
  }

  transformData<T>(value: T, chartLabel: string[], type: string) {
    let data = {};
    let arrOutput = [];
    this.totalPost = value['value'];
    value['childs'].forEach((item) => {
      let obj = {};
      obj[item[type]] = item.value;
      data = { ...data, ...obj };
    });

    chartLabel.forEach((item) => {
      if (data[item]) {
        arrOutput.push(data[item].toString());
      } else {
        arrOutput.push(undefined);
      }
    });

    return arrOutput;
  }

  getDataChartYear(year: number) {
    const month = [...Array(12).keys()].map((item) => (item + 1).toString());
    this.barChartLabels = month;
    return this.chartService
      .countPostOfYear(year)
      .pipe(map((val) => this.transformData<any>(val, month, 'month')));
  }

  getDataChartMonth(year: number, month: number) {
    const dayInMonth = this.getDayInMonth(year, month);
    const arrDay = [...Array(dayInMonth).keys()].map((item) =>
      (item + 1).toString()
    );
    this.barChartLabels = arrDay;
    return this.chartService
      .countPostOfMonth(year, month)
      .pipe(map((val) => this.transformData<any>(val, arrDay, 'date')));
  }

  getDataChartWeek(year: number, week: number) {
    const weekArr = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    this.barChartLabels = weekArr;
    return this.chartService
      .countPostOfWeek(year, week)
      .pipe(map((val) => this.transformData<any>(val, weekArr, 'day')));
  }

  getChart(index: number, year?: number, month?: number, week?: number) {
    if (index === 0) {
      this.chartReady = false;

      this.getDataChartYear(year)
        .pipe(takeUntil(this.unSub$))
        .subscribe((val) => {
          this.barChartData = [{ data: [...val], label: 'posts' }];
          this.yearSelect = [2020, 2021, 2022];
          this.monthSelect = null;
          this.weekSelect = null;
          this.chartReady = true;
        });
    } else if (index === 1) {
      this.chartReady = false;

      this.getDataChartMonth(year, month)
        .pipe(takeUntil(this.unSub$))
        .subscribe((val) => {
          this.barChartData = [{ data: [...val], label: 'posts' }];
          const month = [...Array(12).keys()].map((item) => item + 1);
          this.monthSelect = [...month];
          this.weekSelect = null;
          this.chartReady = true;
        });
    } else if (index === 2) {
      this.chartReady = false;

      this.getDataChartWeek(year, week)
        .pipe(takeUntil(this.unSub$))
        .subscribe((val) => {
          this.barChartData = [{ data: [...val], label: 'posts' }];
          const week = [...Array(52).keys()].map((item) => item + 1);
          this.weekSelect = [...week];
          this.monthSelect = null;
          this.chartReady = true;
        });
    } else if (index === 3) {
      this.chartReady = false;

      this.weekSelect = null;
      this.monthSelect = null;

      this.chartService
        .getPostOfCategory(this.currentCategory, this.postExist)
        .pipe(takeUntil(this.unSub$))
        .subscribe((val) => {
          let barLabel = [];
          let barData = [];
          val.forEach((item) => {
            barLabel.push(item.name);
            barData.push(item.countPost());
          });
          this.barChartLabels = barLabel;
          this.barChartData = [{ data: [...barData], label: 'posts' }];

          this.totalPost = barData.reduce((a, b) => a + b);

          this.chartReady = true;
        });
    } else if (index === 4) {
      this.chartReady = false;
      this.weekSelect = null;
      const monthItem = [...Array(12).keys()].map((item) => item + 1);
      this.monthSelect = [...monthItem];
      this.chartService.countPostOfView(year, month).subscribe((val) => {
        let barLabel = [];
        let barData = [];
        val.forEach((item) => {
          barLabel.push(item.title);
          barData.push(item.view);
        });
        this.barChartLabels = barLabel;
        this.barChartData = [{ data: [...barData], label: 'posts' }];

        this.totalPost = null;

        this.chartReady = true;
      });
    }
  }

  onClick(index: number) {
    this.currentTab = index;
    // this.currentYear = 2021;
    // this.currentMonth = 1;
    // this.currentWeek = 1;
    this.getChart(
      this.currentTab,
      this.currentYear,
      this.currentMonth,
      this.currentWeek
    );
  }

  getDayInMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate();
  }

  changeChart(e: any) {
    const { id, value } = e.target;

    if (id === 'year') {
      this.currentYear = parseInt(value);
    } else if (id === 'month') {
      this.currentMonth = parseInt(value);
    } else if (id === 'week') {
      this.currentWeek = parseInt(value);
    } else {
      const name = e.target.value;
      const category = this.categorySelect.find((item) => item.title === name);
      category
        ? (this.currentCategory = category.id)
        : (this.currentCategory = '');
    }

    this.getChart(
      this.currentTab,
      this.currentYear,
      this.currentMonth,
      this.currentWeek
    );
  }

  ngOnDestroy() {
    this.unsubscribeSignal.next();
    this.unsubscribeSignal.unsubscribe();
  }
}

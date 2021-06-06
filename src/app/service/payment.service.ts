import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, mergeMap, pluck, shareReplay, switchAll } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { CollectionService } from './collection.service';

const initalPaymentState = {};

@Injectable({
  providedIn: 'root',
})
export class PaymentService extends CollectionService<any> {
  totalSales: Observable<any[]>;
  constructor(
    http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    super(initalPaymentState, 'infopayment', http);
    this.totalSales = this.countSaleDate().pipe(shareReplay());
  }

  createPayment(body) {
    return this.http.post(this.url, body);
  }

  getDataPayments() {
    return this.find().pipe(
      map((val: any[]) => {
        return val.map((item) => {
          return {
            courses: item.courses.length || [],
            id: item.id,
            orderBy: item.user.username,
            status: item.status,
            date: item.update_time,
            price: item.purchase_units[0].amount.value,
          };
        });
      })
    );
  }

  countSaleDate() {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const params = new HttpParams().set('fields', '_kmd.ect,courses');
    return this.find(params).pipe(
      map((val) => {
        return val.map((item: any) => {
          const time = new Date(item._kmd.ect);
          return {
            day: days[time.getDay()],
            date: time.getDate(),
            month: time.getMonth() + 1,
            year: time.getFullYear(),
            week: this.ISO8601_week_no(time),
            total_courses: item.courses.length,
            prices: item.courses.reduce((val, item) => val + item.price, 0),
          };
        });
      })
    );
  }

  countSalesOfMonth(year: number, month: number) {
    return this.totalSales.pipe(
      map((val) =>
        val.filter((item) => item.year === year && item.month === month)
      ),
      map((monthData) => {

        let obj = {};
        monthData.forEach((item) => {
          if (obj[item.date]) {
            obj[item.date] = {
              total_courses: obj[item.date].total_courses + item.total_courses,
              prices: obj[item.date].prices + item.prices,
            };
          } else {
            obj[item.date] = {
              total_courses: item.total_courses,
              prices: item.prices,
            };
          }
        });

        return obj;
      })
    );
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
}

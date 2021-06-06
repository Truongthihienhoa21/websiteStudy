import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { PaymentService } from 'src/app/service/payment.service';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
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

  barChartLabels: Label[];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [pluginDataLabels];
  barChartData: ChartDataSets[];
  constructor(private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.barChartData = [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    ];

    this.getDataChartMonth(2021, 4);
  }

  getDataChartMonth(year: number, month: number) {
    const dayInMonth = this.getDayInMonth(year, month);
    const arrDay = [...Array(dayInMonth).keys()].map((item) =>
      (item + 1).toString()
    );
    this.barChartLabels = arrDay;
    this.paymentService.countSalesOfMonth(year, month).subscribe((val) => {

      const coursesSale = arrDay.map(day => {
        return val[day]?.total_courses || undefined
      })

      const priceSale = arrDay.map(day => {
        return +val[day]?.prices.toFixed(2) || undefined
      })

      this.barChartData = [{
        data: coursesSale, label: 'Khóa học đã bán'
      },
      { data: priceSale, label: 'Tổng thu nhập' }]

    });
  }

  getDayInMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate();
  }
}

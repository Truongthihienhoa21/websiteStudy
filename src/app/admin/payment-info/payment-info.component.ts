import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'ng2-charts';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { PaymentService } from 'src/app/service/payment.service';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss'],
})
export class PaymentInfoComponent implements OnInit {
  payments: any[];
  loading = true;
  statuses = [
    {
      label: 'Completed',
      value: 'completed',
    },
    {
      label: 'Inprogress',
      value: 'inprogress',
    },
  ];
  unsubscription$ = new Subject();
  constructor(private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.getDataPayments();
  }

  getDataPayments() {
    this.paymentService.getDataPayments().subscribe((val) => {
      this.payments = val;
      this.loading = false;
      // console.log(val);
    });
  }
}

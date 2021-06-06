import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingProgressService } from './loading-progress.service';

@Component({
  selector: 'app-loading-progress-spinner',
  templateUrl: './loading-progress-spinner.component.html',
  styleUrls: ['./loading-progress-spinner.component.scss'],
})
export class LoadingProgressSpinnerComponent implements OnInit {
  loading$: Observable<boolean>;

  constructor(private loadingProgressService: LoadingProgressService) {}

  ngOnInit(): void {
    this.loading$ = this.loadingProgressService.loading$;
  }
}

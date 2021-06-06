import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingProgressSpinnerComponent } from './loading-progress-spinner.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@NgModule({
  declarations: [LoadingProgressSpinnerComponent],
  imports: [CommonModule, ProgressSpinnerModule],
  exports: [LoadingProgressSpinnerComponent],
})
export class LoadingProgressModule {}

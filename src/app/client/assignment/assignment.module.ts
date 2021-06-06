import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignmentRoutingModule } from './assignment-routing.module';
import { ListAssignmentComponent } from './list-assignment/list-assignment.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AssignmentDetailComponent } from './assignment-detail/assignment-detail.component';
import { AssignmentResolveComponent } from './assignment-resolve/assignment-resolve.component';
import { SplitterModule } from 'primeng/splitter';

@NgModule({
  declarations: [ListAssignmentComponent, AssignmentDetailComponent],
  imports: [
    CommonModule,
    AssignmentRoutingModule,
    ProgressSpinnerModule,
    DataViewModule,
    DropdownModule,
    InputTextModule,
    CardModule,
    ButtonModule,
    DropdownModule,
    SplitterModule,
  ],
  providers: [],
})
export class AssignmentModule {}

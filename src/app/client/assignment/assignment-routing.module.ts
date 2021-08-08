import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseGuard } from 'src/app/service/course.guard';
import { AssignmentDetailComponent } from './assignment-detail/assignment-detail.component';
import { AssignmentResolveComponent } from './assignment-resolve/assignment-resolve.component';
import { ListAssignmentComponent } from './list-assignment/list-assignment.component';

const routes: Routes = [
  { path: '', component: ListAssignmentComponent },

  { path: ':id', component: AssignmentDetailComponent, canActivate: [CourseGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignmentRoutingModule { }

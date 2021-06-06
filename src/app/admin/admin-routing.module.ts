import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCategoryComponent } from './category/add-category/add-category.component';
import { AddPostComponent } from './post/add-post/add-post.component';
import { EditCategoryComponent } from './category/edit-category/edit-category.component';
import { EditPostComponent } from './post/edit-post/edit-post.component';
import { AdminComponent } from './home-admin/admin.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { UserComponent } from './user/user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CoursesComponent } from './courses/courses.component';
import { CoursesCurriculumComponent } from './courses/courses-curriculum/courses-curriculum.component';
import { CoursesLandingpageComponent } from './courses/courses-landingpage/courses-landingpage.component';
import { AddCourseComponent } from './courses/add-course/add-course.component';
import { GoalsCourseComponent } from './courses/goals-course/goals-course.component';
import { EditCourseComponent } from './courses/edit-course/edit-course.component';
import { AssignmentsComponent } from './assignments/assignments.component';
import { PaymentInfoComponent } from './payment-info/payment-info.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'add-category', component: AddCategoryComponent },
      { path: 'edit-category', component: EditCategoryComponent },
      { path: 'add-post', component: AddPostComponent },
      { path: 'edit-post', component: EditPostComponent },
      { path: 'edit-post/:id', component: AddPostComponent },
      { path: 'users', component: UserComponent },
      { path: 'add-user', component: AddUserComponent },
      { path: 'courses', component: CoursesComponent },
      {
        path: 'courses/add',
        component: AddCourseComponent,
        children: [
          { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
          { path: 'landing-page', component: CoursesLandingpageComponent },
          { path: 'curriculum', component: CoursesCurriculumComponent },
          { path: 'goals', component: GoalsCourseComponent },
        ],
      },
      {
        path: 'courses/edit/:id',

        children: [
          { path: 'landing-page', component: CoursesLandingpageComponent },
          { path: 'curriculum', component: CoursesCurriculumComponent },
          { path: 'goals', component: GoalsCourseComponent },
        ],
      },
      { path: 'assignment', component: AssignmentsComponent },
      // { path: 'payment', component: PaymentInfoComponent },
      { path: 'payment', component: PaymentComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}

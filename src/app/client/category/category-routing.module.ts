import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { CoursesDetailComponent } from '../courses/courses-detail/courses-detail.component';
import { CoursesPaymentComponent } from '../courses/courses-payment/courses-payment.component';
import { CoursesComponent } from '../courses/courses.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { HostCategoryComponent } from './host-category/host-category.component';
import { LessonCategoryComponent } from './lesson-category/lesson-category.component';
import { PostdetailComponent } from './postdetail/postdetail.component';
import { CourseLearnComponent } from '../courses/course-learn/course-learn.component';
import { LearningComponent } from '../courses/learning/learning.component';
import { CourseGuard } from '../../service/course.guard';
import { LearningGuard } from '../../service/learning.guard';

const routes: Routes = [
  { path: 'post/:id', component: PostdetailComponent },
  {
    path: '',
    children: [
      { path: 'courses', component: CoursesComponent },
      { path: 'courses/:id', component: CoursesDetailComponent },
      {
        path: 'learn/:id',
        component: CourseLearnComponent,
        canActivate: [LearningGuard],
      },
      {
        path: 'checkout',
        component: CoursesPaymentComponent,
        canActivate: [CourseGuard],
      },
      {
        path: 'learning',
        component: LearningComponent,
        canActivate: [CourseGuard],
      },
      {
        path: ':name',
        component: HostCategoryComponent,
      },
      {
        path: 'detail/:name',
        component: CategoryDetailComponent,
      },
      { path: ':name/:id', component: LessonCategoryComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryRoutingModule {}

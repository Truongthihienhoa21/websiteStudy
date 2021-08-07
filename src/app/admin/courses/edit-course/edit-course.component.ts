import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { CoursesService } from 'src/app/service/courses.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss'],
})
export class EditCourseComponent implements OnInit {
  items: MenuItem[];
  unsubscription$ = new Subject();
  constructor(
  ) {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'Thông tin chính',
        routerLink: 'landing-page',
      },
      {
        label: 'Nội dung khóa học',
        routerLink: 'curriculum',
      },
      {
        label: 'Mục tiêu khóa học',
        routerLink: 'goals',
      },
    ];

    
  }
}

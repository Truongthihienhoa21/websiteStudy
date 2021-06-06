import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss'],
})
export class AddCourseComponent implements OnInit {
  items: MenuItem[];
  constructor() { }

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

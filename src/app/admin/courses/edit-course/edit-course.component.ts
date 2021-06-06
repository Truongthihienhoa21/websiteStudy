import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss'],
})
export class EditCourseComponent implements OnInit {
  items: MenuItem[];
  constructor() {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'Landing Page',
        routerLink: 'landing-page',
      },
      {
        label: 'Curriculum',
        routerLink: 'curriculum',
      },
      {
        label: 'Target your student',
        routerLink: 'goals',
      },
    ];
  }
}

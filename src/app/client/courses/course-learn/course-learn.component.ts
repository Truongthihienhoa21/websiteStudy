import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Accordion } from 'primeng/accordion';
import { Observable, Subscription } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { CoursesService } from 'src/app/service/courses.service';

@Component({
  selector: 'app-course-learn',
  templateUrl: './course-learn.component.html',
  styleUrls: ['./course-learn.component.scss'],
})
export class CourseLearnComponent implements OnInit, OnDestroy {
  course$: Observable<any>;
  videoUrl;
  activeIndex = 0;
  currentLecture = 0;
  currentTab = 0;

  @ViewChild('accor') accor: Accordion;
  constructor(
    private coursesService: CoursesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.course$ = this.route.params.pipe(
      switchMap(({ id }) => this.coursesService.findById(id)),
      shareReplay()
    );

    this.course$.subscribe((val) => {
      // console.log(val);
      this.videoUrl = val.section[0].chapter[0].videoUrl;
    });
  }

  ngOnDestroy() { }

  selectLecture(lecture, indexLecture, indexTab) {
    this.videoUrl = lecture.videoUrl;
    this.currentLecture = indexLecture;
    this.currentTab = indexTab;
  }

  onTabOpen(e) {
    // console.log(e);
  }

  nextVideo() {
    this.activeIndex++;
  }
}

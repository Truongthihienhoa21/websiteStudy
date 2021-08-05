import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter, mergeMap, shareReplay, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { HomePage, Post } from '../../model/model';
import { LessonService } from '../../service/lesson.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  tutorial$: Observable<HomePage[]>;
  reviews$: Observable<Post[]>;
  homeFields = [
    { field: '', order: 1 },
    { field: 'Tin học', order: 2 },
    { field: 'Thủ thuật', order: 3 },
    { field: 'Môn học', order: 4 },
  ];

  constructor(
    private lessonService: LessonService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const canLoadPost$ = this.authService
      .selectAuthData<boolean>('canLoadPost')
      .pipe(
        filter((val) => !!val),
        shareReplay()
      );

    this.tutorial$ = canLoadPost$.pipe(
      filter((val) => !!val),
      switchMap(() =>
        this.lessonService.selectData<HomePage[]>('homePagePost').pipe(
          mergeMap((val) => {
            if (!val) {
              return this.lessonService.getHomeTutorial(this.homeFields);
            } else {
              return of(val);
            }
          })
        )
      )
    );

    this.reviews$ = canLoadPost$.pipe(
      switchMap(() => this.lessonService.getHotPostFromStore())
    );
  }
}

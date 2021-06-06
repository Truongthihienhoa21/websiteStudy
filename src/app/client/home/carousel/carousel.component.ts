import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Query } from 'kinvey-angular-sdk';
import { Observable } from 'rxjs';
import { Post } from 'src/app/model/model';
import { LessonService } from 'src/app/service/lesson.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
  posts$: Observable<Post[]>;
  constructor(private lessonService: LessonService) {}

  ngOnInit(): void {
    const query = new Query();
    query.equalTo('content', 'Mã giảm giá');
    query.fields = ['title', 'img'];
    query.limit = 10;
    query.descending('_kmd.lmt');

    const params = new HttpParams()
      .set('sort', '{"_kmd.ect":-1}')
      .set('limit', '10')
      .set('fields', 'title,img')
      .set('query', JSON.stringify({ content: 'Mã giảm giá' }));
    this.posts$ = this.lessonService.find<Post>(params);
  }
}

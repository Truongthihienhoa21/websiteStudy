import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { HomePost } from 'src/app/model/model';

@Component({
  selector: 'app-sub-category',
  templateUrl: './home-post-item.html',
  styleUrls: ['./home-post-item.scss'],
})
export class SubCategoryComponent implements OnInit, OnChanges {
  @Input() tutorials: HomePost[];
  @Input() title: string;
  newPost: HomePost;
  subPosts: HomePost[];

  constructor() {}

  ngOnChanges(): void {
    this.newPost = this.tutorials[0];
    this.subPosts = this.tutorials.slice(1);
  }

  ngOnInit(): void {}
}

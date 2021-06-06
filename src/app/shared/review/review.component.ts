import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { GroupPost } from 'src/app/model/model';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {
  @Input() relate$: Observable<GroupPost[]>;
  @Input() title: string;
  @Output() changePost = new EventEmitter<boolean>();
  currentPost$: Observable<string>;
  constructor(private route: ActivatedRoute, private router: Router) {
    this.currentPost$ = this.route.params.pipe(pluck('id'));
  }

  ngOnInit(): void {}

  ngOnChanges() {}

  onClick(item: GroupPost) {
    this.router.navigate(['/category/post', item._id]);
    this.changePost.emit(true);
  }
}

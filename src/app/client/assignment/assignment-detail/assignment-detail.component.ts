import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { pluck, switchMap } from 'rxjs/operators';
import { AssignmentService } from '../assignment.service';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.scss'],
})
export class AssignmentDetailComponent implements OnInit {
  assignment$: Observable<any>;

  constructor(
    private assignmentService: AssignmentService,
    private route: ActivatedRoute
  ) {
    this.assignment$ = this.route.params.pipe(
      switchMap(({ id }) => this.assignmentService.getListsAssignment(id))
    );

    // this.assignment$.subscribe((val) => console.log(val));
  }

  ngOnInit(): void { }
}

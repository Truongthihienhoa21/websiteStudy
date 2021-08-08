import { AuthService } from 'src/app/service/auth.service';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subject, combineLatest } from 'rxjs';
import { mergeMap, pluck, switchAll, switchMap, toArray, takeUntil, tap, find } from 'rxjs/operators';
import { AssignmentService } from '../assignment.service';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.scss'],
})
export class AssignmentDetailComponent implements OnInit, OnDestroy {
  assignment$: Observable<any>;
  unSubscribe$ = new Subject();
  idAssignment: string;
  constructor(
    private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    this.assignment$ = combineLatest([this.route.params, this.authService.userDetail$]).pipe(
      switchMap(([idAss, userInfo]) => {
        const assignment = userInfo.assignment;
        if (assignment && assignment.length) {
          const assDetail = assignment.find(ass => ass._id === idAss.id);
          if (assDetail) {
            return of(assDetail.lists_assignment)
          }
        }
        return this.assignmentService.getListsAssignment(idAss.id)

      }),
      takeUntil(this.unSubscribe$)
    )

  }

  ngOnDestroy() {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }
}

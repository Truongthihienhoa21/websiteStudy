import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { CollectionService } from 'src/app/service/collection.service';

const initalCoursesState = {};
@Injectable({
  providedIn: 'root',
})
export class AssignmentService extends CollectionService<any> {
  constructor(
    http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    super(initalCoursesState, 'assignment', http);
  }

  getListsAssignment(id): Observable<any> {
    const params = new HttpParams().set('fields', 'lists_assignment');
    return this.findById(id, params).pipe(pluck('lists_assignment'));
  }
}

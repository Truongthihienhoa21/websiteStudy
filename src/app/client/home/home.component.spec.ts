// import { Query } from '@angular/core';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { Observable, of } from 'rxjs';
// import { HomePage } from '../model/model';
// import { AuthService } from '../service/auth.service';
// import { LessonService } from '../service/lesson.service';
// import { GetKeyObjPipe } from '../shared/get-key-obj.pipe';
// import { GetValueObjPipe } from '../shared/get-value-obj.pipe';
// import { State, Store } from '../store';

// import { HomeComponent } from './home.component';

// class FakeLessonService {
//   find(query?: Query) {
//     return [
//       {
//         _id: null,
//         img: null,
//         name: null,
//         group_name: null,
//         'sub-group': null,
//         main_group: null,
//       },
//     ];
//   }
// }

// class FakeStoreService {
//   store: State;
//   constructor() {
//     this.store = {
//       categoryName: null,
//       currentCategory: {},
//       lessonGroup: {},
//       lessons: {},
//       homePagePost: [
//         {
//           posts: {
//             ['1']: [
//               {
//                 _id: 'string1',
//                 desc: 'string1',
//                 title: 'string1',
//                 img: 'string1',
//               },
//             ],
//           },
//           order: 2,
//         },
//         {
//           posts: {
//             ['2']: [
//               {
//                 _id: 'string2',
//                 desc: 'string2',
//                 title: 'string2',
//                 img: 'string2',
//               },
//             ],
//           },
//           order: 2,
//         },
//       ],
//     };
//   }

//   selectData<T>(key: string): Observable<T> {
//     return of(this.store[key]);
//   }

//   setStore() {}
// }

// class FakeAuthService {}

// describe('HomeComponent', () => {
//   let component: HomeComponent;
//   let fixture: ComponentFixture<HomeComponent>;
//   let store: Store;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [HomeComponent, GetKeyObjPipe, GetValueObjPipe],
//       providers: [
//         { provide: LessonService, useClass: FakeLessonService },
//         { provide: Store, useClass: FakeStoreService },
//         { provide: AuthService, useClass: FakeAuthService },
//       ],
//     });
//     store = TestBed.inject(Store);
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(HomeComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should get HomePage Data', () => {
//     const expectedData: HomePage[] = [
//       {
//         posts: {
//           ['1']: [
//             {
//               _id: 'string1',
//               desc: 'string1',
//               title: 'string1',
//               img: 'string1',
//             },
//           ],
//         },
//         order: 2,
//       },
//       {
//         posts: {
//           ['2']: [
//             {
//               _id: 'string2',
//               desc: 'string2',
//               title: 'string2',
//               img: 'string2',
//             },
//           ],
//         },
//         order: 2,
//       },
//     ];
//     component.tutorial$ = store.selectData<HomePage[]>('homePagePost');
//     component.ngOnInit();
//     fixture.detectChanges();
//     component.tutorial$.subscribe((value) => {
//       expect(value).toEqual(expectedData);
//     });
//   });
// });

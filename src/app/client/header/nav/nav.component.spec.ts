// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { of } from 'rxjs';
// import { Store } from 'src/app/store';
// import { GetKeyObjPipe } from '../../get-key-obj.pipe';
// import { GetValueObjPipe } from '../../get-value-obj.pipe';
// import { NavComponent } from './nav.component';

// class FakeStoreService {
//   selectData(data: string) {
//     return of({
//       'Lập trình': [
//         { 'web frontend': ['angular', 'js', 'html'] },
//         { 'web backend': ['php', 'laravel', 'nodejs'] },
//       ],
//       concac: [{ python: ['python ez', 'python advanced'] }],
//       concac1: [{ javascript: ['javascript1'] }],
//     });
//   }
// }

// describe('NavComponent', () => {
//   let component: NavComponent;
//   let fixture: ComponentFixture<NavComponent>;
//   let service: Store;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [NavComponent, GetKeyObjPipe, GetValueObjPipe],
//       providers: [{ provide: Store, useClass: FakeStoreService }],
//     });
//     fixture = TestBed.createComponent(NavComponent);
//     component = fixture.componentInstance;
//     service = TestBed.inject(Store);
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should return Lap trinh data', () => {
//     component.laptrinh$.subscribe((data) => {
//       expect(data).toEqual([
//         { 'web frontend': ['angular', 'js', 'html'] },
//         { 'web backend': ['php', 'laravel', 'nodejs'] },
//       ]);
//     });
//   });

//   it('should return other categories data', () => {
//     component.another$.subscribe((data) => {
//       expect(data).toEqual([
//         { concac: [{ python: ['python ez', 'python advanced'] }] },
//         { concac1: [{ javascript: ['javascript1'] }] },
//       ]);
//     });
//   });
// });

// import { AppRoutingModule, routes } from './app-routing.module';
// import { Location } from '@angular/common';
// import { fakeAsync, TestBed, flush } from '@angular/core/testing';
// import { Router } from '@angular/router';
// import {
//   RouterTestingModule,
//   SpyNgModuleFactoryLoader,
// } from '@angular/router/testing';
// import { of } from 'rxjs';
// import { AdminComponent } from './admin/home-admin/admin.component';
// import { AppComponent } from './app.component';
// import { AuthService } from './service/auth.service';
// import { CategoryNameService } from './service/categoryName.service';
// import { LoadingService } from './service/loading.service';
// import { FooterComponent } from './shared/footer/footer.component';
// import { HeaderComponent } from './shared/header/header.component';

// class FakeAuthService {}

// class FakeCategoryNameService {
//   connectArr() {}
//   group() {}
//   createGr() {}
//   find() {
//     return of(['concac1', 'concac2', 'concac3']);
//   }
// }

// class FakeLoadingService {}

// describe('AppComponent', () => {
//   let location: Location;
//   let router: Router;
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [AppRoutingModule, RouterTestingModule.withRoutes(routes)],
//       declarations: [
//         AppComponent,
//         HeaderComponent,
//         FooterComponent,
//         AdminComponent,
//       ],
//       providers: [
//         { provide: AuthService, useClass: FakeAuthService },
//         { provide: CategoryNameService, useClass: FakeCategoryNameService },
//         { provide: LoadingService, useClass: FakeLoadingService },
//       ],
//     }).compileComponents();
//     router = TestBed.inject(Router);
//     location = TestBed.inject(Location);
//     router.initialNavigation();
//   });

//   it('should create the app', () => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.componentInstance;
//     expect(app).toBeTruthy();
//   });

//   it('should redirect to home component if navigate to ""', fakeAsync(() => {
//     router.navigate(['']).then(() => {
//       expect(location.path()).toBe('/');
//     });
//   }));

//   it('should navigate to login page', fakeAsync(() => {
//     router.navigate(['login']).then(() => {
//       expect(location.path()).toBe('/login');
//     });
//     flush();
//   }));
// });

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { LoadingProgressModule } from './loading-progress/loading-progress.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SubCategoryComponent } from './client/home/home-post-item/home-post-item';
import { HomeComponent } from './client/home/home.component';
import { CarouselComponent } from './client/home/carousel/carousel.component';
import { RegisterComponent } from './register/register.component';
import { NavComponent } from './client/header/nav/nav.component';
import { HeaderComponent } from './client/header/header.component';
import { FooterComponent } from './client/footer/footer.component';
import { LoginComponent } from './login/login.component';
import { HomeClientComponent } from './client/home-client/home-client.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { RequestInterceptor } from './service/interceptor';
import { UserInfoComponent } from './pageUser/user-info/user-info.component';
import { CartComponent } from './pageUser/cart/cart.component';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CarouselModule } from 'primeng/carousel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputLogComponent } from './register/input-log/input-log.component';
import { SplitterModule } from 'primeng/splitter';
import { MonacoEditorModule, MONACO_PATH } from '@materia-ui/ngx-monaco-editor';
import { AssignmentResolveComponent } from './client/assignment/assignment-resolve/assignment-resolve.component';

@NgModule({
  declarations: [
    AppComponent,
    SubCategoryComponent,
    HomeComponent,
    CarouselComponent,
    RegisterComponent,
    NavComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    HomeClientComponent,
    UserInfoComponent,
    CartComponent,
    InputLogComponent,
    AssignmentResolveComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    SweetAlert2Module.forRoot(),
    BrowserAnimationsModule,
    BadgeModule,
    CardModule,
    ProgressSpinnerModule,
    CarouselModule,
    ToastModule,
    SplitterModule,
    MonacoEditorModule,
    LoadingProgressModule,
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    MessageService,
    {
      provide: MONACO_PATH,
      useValue: 'https://unpkg.com/monaco-editor@0.23.0/min/vs',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

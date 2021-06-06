import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from './safe-html.pipe';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { LoadingComponent } from './loading/loading.component';
import { ChangeUrlPipe } from './change-url.pipe';
import { GetKeyObjPipe } from './get-key-obj.pipe';
import { GetValueObjPipe } from './get-value-obj.pipe';
import { PaginationComponent } from './pagination/pagination.component';
import { SearchInputComponent } from './search-input/search-input.component';

import { ReactiveFormsModule } from '@angular/forms';
import { ReviewComponent } from './review/review.component';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { InputComponent } from './input/input.component';
import { ErrorNetworkComponent } from './error-network/error-network.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SwalAlertComponent } from './swal-alert/swal-alert.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { LoadingPlaceholderComponent } from './loading-placeholder/loading-placeholder.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { DropdownModule } from 'primeng/dropdown';
import { SafeUrlPipe } from './safe-url.pipe';
@NgModule({
  declarations: [
    SafeHtmlPipe,
    TextEditorComponent,
    LoadingComponent,
    ChangeUrlPipe,
    GetKeyObjPipe,
    GetValueObjPipe,
    PaginationComponent,
    SearchInputComponent,
    ReviewComponent,
    AlertModalComponent,
    InputComponent,
    ErrorNetworkComponent,
    NotFoundComponent,
    SwalAlertComponent,
    LoadingPlaceholderComponent,
    SafeUrlPipe,
  ],
  imports: [
    CommonModule,
    EditorModule,
    ReactiveFormsModule,
    SweetAlert2Module.forChild(),
    InputTextModule,
    ButtonModule,
    MenubarModule,
    AvatarModule,
    DropdownModule,
  ],
  exports: [
    SafeHtmlPipe,
    TextEditorComponent,
    LoadingComponent,
    ChangeUrlPipe,
    GetKeyObjPipe,
    GetValueObjPipe,
    PaginationComponent,
    SearchInputComponent,
    ReviewComponent,
    AlertModalComponent,
    InputComponent,
    ErrorNetworkComponent,
    SwalAlertComponent,
    LoadingPlaceholderComponent,
    ButtonModule,
    MenubarModule,
    AvatarModule,
    DropdownModule,
    InputTextModule,
    SafeUrlPipe,
  ],
})
export class SharedModule {}

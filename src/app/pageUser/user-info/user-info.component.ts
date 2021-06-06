import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { CoursesService } from 'src/app/service/courses.service';
import { FalconMessageService } from 'src/app/service/falcon-message.service';

@Component({
  selector: 'app-user',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  providers: [FalconMessageService],
})
export class UserInfoComponent implements OnInit, OnDestroy {
  formUserInfo: FormGroup;
  userInfo: any;
  loading = false;
  placeholderHeadline = "'Engineer at Udemy' or 'Architect'";
  defaultimg =
    'https://icon-library.com/images/account-icon/account-icon-16.jpg';
  constructor(
    private userService: AuthService,
    private fb: FormBuilder,
    private coursesService: CoursesService,
    private messageService: FalconMessageService
  ) {}
  languages: any[];
  unsubscription$ = new Subject();
  ngOnInit(): void {
    this.formUserInfo = this.initFormUser();
    this.loading = true;
    this.coursesService
      .getCountries()
      .pipe(takeUntil(this.unsubscription$))
      .subscribe((val) => (this.languages = val));

    const userId = JSON.parse(localStorage.getItem('userInfo'));

    this.userService
      .getUser(userId)
      .pipe(
        finalize(() => (this.loading = false)),
        takeUntil(this.unsubscription$)
      )
      .subscribe(
        (val) => {
          this.formUserInfo.patchValue({ ...val });
          this.userInfo = val;
        },
        (err) => {
          this.messageService.showError('Error', "Some thing wen't wrong");
        }
      );
  }

  ngOnDestroy() {
    this.unsubscription$.next();
    this.unsubscription$.unsubscribe();
  }

  initFormUser(): FormGroup {
    return this.fb.group({
      firstName: [''],
      lastName: [''],
      headline: [''],
      language: [null],
      biography: [''],
      img: [this.defaultimg],
      social: this.fb.group({
        website: [''],
        twitter: [''],
        facebook: [''],
        youtube: [''],
      }),
    });
  }

  get formSocial() {
    return this.formUserInfo.get('social');
  }

  onSubmit() {
    const newValueUser = { ...this.userInfo, ...this.formUserInfo.value };

    this.loading = true;
    this.userService
      .updateUser(this.userInfo._id, newValueUser)
      .pipe(
        finalize(() => (this.loading = false)),
        takeUntil(this.unsubscription$)
      )
      .subscribe(
        (val) => {
          this.messageService.showSuccess('Success', 'Update successed');
        },
        (err) => {
          this.messageService.showError('Error', "Some thing wen't wrong");
        }
      );
  }
}

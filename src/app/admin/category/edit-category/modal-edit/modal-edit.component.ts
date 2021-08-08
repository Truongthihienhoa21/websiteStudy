import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AsyncValidator } from '@angular/forms';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
import { Category } from 'src/app/model/model';
import { CategoryService } from 'src/app/service/category.service';
import { SwalAlertComponent } from 'src/app/shared/swal-alert/swal-alert.component';
import { CheckCategoryName } from 'src/app/shared/validators/check-category-name';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './modal-edit.component.html',
  styleUrls: ['./modal-edit.component.scss'],
  providers: [SwalAlertComponent],
})
export class ModalEditComponent implements OnInit, OnChanges, OnDestroy {
  @Input() showModal: boolean;
  @Output() showModalChange = new EventEmitter<boolean>();
  @Input() categoryEdit: Category;
  @Output() categoryEditChange = new EventEmitter<Category>();
  initialValue: Observable<unknown>;
  isEdit: boolean;
  formEdit: FormGroup;
  sub: Subscription;
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private swal: SwalAlertComponent,
    private checkCategoryName: CheckCategoryName
  ) {
    this.formEdit = this.initForm();
  }

  initForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required, this.checkCategoryName.validate],
      img: [''],
      group: [''],
      desc: [''],
    });
  }

  ngOnChanges() {
    if (this.categoryEdit) {
      this.formEdit.patchValue({
        ...this.categoryEdit,
      });

      this.initialValue = this.formEdit.value;
      const valueChanges = this.formEdit.valueChanges;

      // this.isEdit = combineLatest([this.initialValue, valueChanges]).pipe(
      //   map(([initialValue, valueChanges]) => {
      //     console.log(111);

      //     if (JSON.stringify(initialValue) !== JSON.stringify(valueChanges)) {
      //       return true;
      //     } else {
      //       return false;
      //     }
      //   }),
      //   distinctUntilChanged(),
      //   shareReplay()
      // );
    }
  }

  ngOnInit(): void {

    this.formEdit.valueChanges.subscribe(val => {

      if (JSON.stringify(this.initialValue) !== JSON.stringify(val)) {
        this.isEdit = true;
      } else {
        this.isEdit = false;
      }
    })
  }

  onClose() {
    this.showModalChange.emit(!this.showModal);
  }

  onSubmit() {

    const { value } = this.formEdit;

    this.categoryEdit = {
      ...this.categoryEdit,
      ...value,
    };

    this.sub = this.categoryService
      .update(this.categoryEdit, this.categoryEdit._id)
      .subscribe((val) => {
        this.categoryEditChange.emit(val);
        this.swal.swalSuccess(null, 'Chỉnh sửa thành công!');
      });

    this.onClose();
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}

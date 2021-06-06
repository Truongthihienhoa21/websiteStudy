import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from 'src/app/service/loading.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-swal-alert',
  templateUrl: './swal-alert.component.html',
  styleUrls: ['./swal-alert.component.scss'],
})
export class SwalAlertComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }

  swalSuccess(text?: string, title: string = 'Đã xóa!') {
    let timerInterval: any;

    return Swal.fire({
      icon: 'success',
      text: text,
      html: 'Cửa sổ sẽ tự đóng sau <b></b> milliseconds.',
      title: title,
      timer: 3000,
      timerProgressBar: true,
      showCloseButton: true,
      didOpen: () => {
        Swal.showLoading();
        timerInterval = setInterval(() => {
          const content = Swal.getContent();
          if (content) {
            const b = content.querySelector('b');
            if (b) {
              b.innerHTML = Swal.getTimerLeft().toString();
            }
          }
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
  }

  swalConfirm(text?: string) {
    return Swal.fire({
      icon: 'warning',
      text: `Bạn có muốn xóa ${text}. Tất cả thông tin liên quan sẽ bị xóa vĩnh viến. Hành động này không thể quay lại?`,
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy bỏ',
    });
  }

  swalCancel(text?: string) {
    return Swal.fire('Hủy bỏ', `Bạn đã hủy bỏ`, 'error');
  }

  swalError500() {
    return Swal.fire(
      '500',
      ' Kết nối của bạn đã bị gián đoạn, vui lòng kết nối lại',
      'error'
    );
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  showHeaderFooter = true
  public listFooter = [
    {
      name: 'Liên hệ',
      listFooter: [
        'Giới thiệu',
        'Chính sách',
        'Điều khoản',
        'Liên hệ',
        'Guest Post',
      ],
    },
    {
      name: 'Mã giảm giá',
      listFooter: ['TinoHost', 'Azdigi', 'Vultr', 'Hawkhost', 'Stablehost'],
    },
    {
      name: 'Khóa học',
      listFooter: ['Javascript', 'Front-end', 'NodeJS', 'ReactJS', 'FullStack'],
    },
    {
      name: 'Giới thiệu',
      listFooter: [
        'Admin HienHoa, quản lý của website.',
        'Email: Email: hienhoa@gmail.com',
        'Phone/Zalo: 0979306603',
        'Skype: hienhoaSkype',
      ],
    },
  ];

  constructor() {
  }
  ngOnInit(): void {

  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-network',
  templateUrl: './error-network.component.html',
  styleUrls: ['./error-network.component.scss'],
})
export class ErrorNetworkComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  onClick() {
    this.router.navigateByUrl('/');
  }
}

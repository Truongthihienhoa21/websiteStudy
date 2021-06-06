import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { Store, User } from 'src/app/store';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  userDropdown: boolean = false;
  sidebarToggle: boolean = true;
  wasInside: boolean = false;
  user: User
  subscription: Subscription[] = []
  constructor(private authService: AuthService, private _router: Router) {
    const sub = this.authService.userDetail$.subscribe((data) => {
      this.user = data
    })

    this.subscription.push(sub)
  }

  ngOnInit(): void { }

  ngOnDestroy() {
    this.subscription.forEach(sub => sub.unsubscribe())
  }

  toggleUserDropdown() {
    this.userDropdown = !this.userDropdown;
    this.wasInside = true;
  }

  toggerSidebar() {
    this.sidebarToggle = !this.sidebarToggle;
  }

  @HostListener('document:click')
  clickOutside() {
    if (!this.wasInside) {
      this.userDropdown = false;
    }
    this.wasInside = false;
  }

  onLogout() {
    localStorage.setItem('logged', 'false');
    localStorage.setItem('typeUser', '');
    localStorage.removeItem('userInfo');
    this._router.navigateByUrl('/')
  }
}

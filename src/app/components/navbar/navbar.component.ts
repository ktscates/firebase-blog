import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(private router: Router) {}

  nagivateToBlog() {
    this.router.navigate(['/posts']);
  }

  nagivateToProfile() {
    this.router.navigate(['/profile']);
  }
}

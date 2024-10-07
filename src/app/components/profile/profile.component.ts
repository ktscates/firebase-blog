import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Subscribe to the current user observable & Update currentUser when it changes
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user; //
      console.log('User', this.currentUser);
    });
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['']);
    });
  }
}

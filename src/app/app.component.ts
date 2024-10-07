import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'firebase-blogs';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user) => {
      if (!user) {
        // If no user is authenticated, navigate to the login route
        this.router.navigate(['/auth']);
      } else {
        // If a user is authenticated, navigate to the dashboard route
        this.router.navigate(['/posts']);
      }
    });
  }
}

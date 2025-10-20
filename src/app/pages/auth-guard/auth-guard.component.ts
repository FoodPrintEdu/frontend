import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-auth-guard',
  imports: [RouterOutlet],
  templateUrl: './auth-guard.component.html',
})
export class AuthGuardComponent {
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    if (!this.userService.checkLoggedIn()) {
      if (this.userService.checkRefreshToken()) {
        this.userService.refreshTokens().add(() => {
          if (!this.userService.checkLoggedIn()) {
            this.router.navigate(['/login']);
          }
        });
      } else {
        this.router.navigate(['/login']);
      }
    }
  }
}

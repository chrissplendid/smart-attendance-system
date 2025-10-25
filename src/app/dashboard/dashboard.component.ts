import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {

  constructor(public authService: AuthService) { }

  toggleSidebar() {
    const wrapper = document.getElementById('wrapper');
    if (wrapper) {
      wrapper.classList.toggle('collapsed');
      wrapper.classList.toggle('show-sidebar');
    }
  }

  closeSidebar() {
    const wrapper = document.getElementById('wrapper');
    if (wrapper) {
      wrapper.classList.remove('show-sidebar');
    }
  }

  logout() {
    this.authService.signout();
  }

}

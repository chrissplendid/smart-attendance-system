import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
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
}

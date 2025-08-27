import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-staff-dashboard',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './staff-dashboard.component.html',
  styleUrl: './staff-dashboard.component.css'
})
export class StaffDashboardComponent {
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

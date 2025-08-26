import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminAnalyticsComponent } from './admin-analytics/admin-analytics.component';

export const routes: Routes = [
    {path:"", component: LoginComponent},
    {path:"register", component: RegisterComponent},
    {path:"reset-password", component: ResetpasswordComponent},
    {path:"admin-dashboard", component: DashboardComponent, children: [
        {path: "", component: AdminAnalyticsComponent}
    ]},
];

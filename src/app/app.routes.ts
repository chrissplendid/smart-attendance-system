import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminAnalyticsComponent } from './admin-analytics/admin-analytics.component';
import { StaffDashboardComponent } from './staff-dashboard/staff-dashboard.component';
import { StaffAnalyticsComponent } from './staff-analytics/staff-analytics.component';
import { AdminAttendanceLogsComponent } from './admin-attendance-logs/admin-attendance-logs.component';
import { AdminEnrollBiometricComponent } from './admin-enroll-biometric/admin-enroll-biometric.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { AdminUserManagementComponent } from './admin-user-management/admin-user-management.component';
import { StaffAttendanceLogsComponent } from './staff-attendance-logs/staff-attendance-logs.component';
import { StaffProfileComponent } from './staff-profile/staff-profile.component';
import { RoleGuard } from './role.guard';
import { LogoutGuard } from './logout.guard';
import { AdminManualAttendanceComponent } from './admin-manual-attendance/admin-manual-attendance.component';
import { AdminStudentManagementComponent } from './admin-student-management/admin-student-management.component';
import { AdminStudentManualAttendanceComponent } from './admin-student-manual-attendance/admin-student-manual-attendance.component';

export const routes: Routes = [
    {path:"", component: LoginComponent, canActivate: [LogoutGuard]},
    {path:"register", component: RegisterComponent, canActivate: [LogoutGuard]},
    {path:"reset-password", component: ResetpasswordComponent, canActivate: [LogoutGuard]},
    {path:"admin-dashboard", component: DashboardComponent, canActivate: [RoleGuard], canActivateChild: [RoleGuard], data: { role: 'ADMIN' }, children: [
        {path: "", component: AdminAnalyticsComponent, data: { role: 'ADMIN' }},
        {path: "dashboard", component: AdminAnalyticsComponent, data: { role: 'ADMIN' }},
        {path: "attendance-logs", component: AdminAttendanceLogsComponent, data: { role: 'ADMIN' }},
        {path: "enroll-biometric", component: AdminEnrollBiometricComponent, data: { role: 'ADMIN' }},
        {path: "settings", component: AdminSettingsComponent, data: { role: 'ADMIN' }},
        {path: "user-management", component: AdminUserManagementComponent, data: { role: 'ADMIN' }},
        {path: "manual-attendance", component: AdminManualAttendanceComponent, data: { role: 'ADMIN' }},
        {path: "student-management", component: AdminStudentManagementComponent, data: { role: 'ADMIN' }},
        {path: "student-manual-attendance", component: AdminStudentManualAttendanceComponent, data: { role: 'ADMIN' }},
    ]},
    {path:"staff-dashboard", component: StaffDashboardComponent, canActivate: [RoleGuard], canActivateChild: [RoleGuard], data: { role: 'STAFF' }, children: [
        {path: "", component: StaffAnalyticsComponent, data: { role: 'STAFF' }},
        {path: "analytics", component: StaffAnalyticsComponent, data: { role: 'STAFF' }},
        {path: "attendance-logs", component: StaffAttendanceLogsComponent, data: { role: 'STAFF' }},
        {path: "profile", component: StaffProfileComponent, data: { role: 'STAFF' }}
    ]},
];

import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormBuilder} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CookieService } from 'ngx-cookie-service';
import { CommunicatorService } from '../communicator.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatGridListModule, MatCheckboxModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  private _formBuilder = inject(FormBuilder);
  response: any[] = [];

  // FRONT END VALIDATION FOR LOGIN INPUT
  LoginFormGroup = this._formBuilder.group({
    password: ['', Validators.required]
  })

  // ACCOUNT LOGIN METHOD
  login() {
    // A JSON DATA OF THE LOGIN INPUTS
    let loginData = {
      email: this.emailFormControl.value,
      password: this.LoginFormGroup.value.password
    }
    // SEND LOGIN INPUTS TO THE SERVER THROUGH A SERVICE METHOD
  this.communicatorService.onSubmitLoginService(loginData).subscribe({
    next: (res) => {
      this.response = res;
      
      console.log(res);
    },
    error: () => {}
  })
  }
  
  // A CONSTRUCTOR METHOD THAT RUNS BEFORE THE PAGE LOADS
  constructor(private cookieService: CookieService, private communicatorService: CommunicatorService) {}

}

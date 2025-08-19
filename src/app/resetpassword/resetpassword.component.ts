import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormBuilder} from '@angular/forms';
import { CommunicatorService } from '../communicator.service';
import { RouterModule } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-resetpassword',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, FormsModule, RouterModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css'
})
export class ResetpasswordComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  private _formBuilder = inject(FormBuilder);
  response: any[] = [];

}

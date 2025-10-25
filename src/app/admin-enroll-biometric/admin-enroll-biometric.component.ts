// admin-enroll-biometric.component.ts
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CookieService } from 'ngx-cookie-service';
import { CommunicatorService } from '../communicator.service';
import { UserService } from '../user.service';
import { FaceService } from '../services/face.service';
import { FingerprintService } from '../services/fingerprint.service';
import { KeyService } from '../services/key.service';

interface EnrollmentPayload {
  user_uuid: string;
  fingerprint_template?: string;
  face_template?: string;
}

@Component({
  selector: 'app-admin-enroll-biometric',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-enroll-biometric.component.html',
  styleUrl: './admin-enroll-biometric.component.css',
})
export class AdminEnrollBiometricComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private communicatorService = inject(CommunicatorService);
  private userService = inject(UserService);
  private faceService = inject(FaceService);
  private fpService = inject(FingerprintService);
  private keyService = inject(KeyService);
  private destroyRef = inject(DestroyRef);

  @ViewChild('videoEl', { static: false })
  videoRef?: ElementRef<HTMLVideoElement>;

  enrollForm!: FormGroup;
  users: any[] = [];
  logs: string[] = [];
  response: any;
  errorMessage = '';
  loadingModels = false;

  fingerprintStatus = 'Idle';
  faceStatus = 'Idle';
  useEncryption = false; // 🔄 toggle for dev vs prod
  faceProgress = 0; // For face enrollment progress (0–100)
  fingerprintProgress = 0; // For fingerprint enrollment progress (0–100)

  async ngOnInit() {
    this.initForm();
    this.loadUsers();

    // Preload crypto key
    try {
      await this.keyService.loadKeyFromServer();
    } catch {
      console.warn('⚠️ Could not preload crypto key (non-fatal)');
    }

    // Load face-api models once
    this.loadingModels = true;
    try {
      await this.faceService.loadModels();
    } catch {
      this.errorMessage = 'Failed to load face models.';
    } finally {
      this.loadingModels = false;
    }
  }

  ngAfterViewInit() {
    if (this.enrollForm.value.face && this.videoRef?.nativeElement) {
      this.startWebcam();
    }
  }

  private loadUsers() {
    this.userService
      .getUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (users) => (this.users = users),
        error: (err) => {
          this.errorMessage =
            err.status === 401
              ? "You don't have permission to view users."
              : 'Failed to load users.';
        },
      });
  }

  private initForm() {
    this.enrollForm = this.fb.group({
      user: [null, Validators.required],
      fingerprint: [true],
      face: [true],
    });
  }

  private log(msg: string) {
    this.logs.unshift(`${new Date().toLocaleString()} = ${msg}`);
  }

  private async startWebcam() {
    if (!this.videoRef?.nativeElement) return;
    try {
      await this.faceService.initWebcam(this.videoRef.nativeElement);
      this.faceStatus = 'Camera Ready';
    } catch {
      this.errorMessage = 'Webcam access denied.';
    }
  }

  // ------------------ Enrollment ------------------
  async startEnrollment() {
    this.errorMessage = '';
    const formValue = this.enrollForm.value;
    const selectedUser = formValue.user;
    if (!selectedUser) {
      this.errorMessage = 'Please select a valid user.';
      return;
    }

    const payload: EnrollmentPayload = { user_uuid: selectedUser.uuid };

    if (formValue.fingerprint) {
      await this.handleFingerprint(selectedUser, payload);
    }
    if (formValue.face) {
      await this.handleFace(selectedUser, payload);
    }

    if (!payload.face_template && !payload.fingerprint_template) {
      this.errorMessage = 'No biometric captured—please try again.';
      return;
    }

    this.communicatorService
      .enrollBiometric(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resp) => {
          this.response = resp;
          this.log(`${selectedUser.firstname} - Enrollment Success`);
        },
        error: () => {
          this.errorMessage = 'Failed to enroll biometric data.';
          this.log(`${selectedUser.firstname} - Enrollment Failed`);
        },
      });
  }

  private async handleFingerprint(user: any, payload: EnrollmentPayload) {
    try {
      this.fingerprintStatus = 'Capturing...';
      const { templateB64, quality } = await this.fpService.capture();
      const data = { fmt: 'ISO_19794_2', templateB64, quality };
      payload.fingerprint_template = this.useEncryption
        ? await this.keyService.encryptJson(data)
        : JSON.stringify(data);

      this.fingerprintStatus = 'Success';
      this.log(
        `${user.firstname} - Fingerprint (Success, q=${quality ?? 'n/a'})`
      );
    } catch (err: any) {
      this.fingerprintStatus = 'Failed';
      this.log(
        `${user.firstname} - Fingerprint (Failed: ${err?.message || 'error'})`
      );
    }
  }

  private async handleFace(user: any, payload: EnrollmentPayload) {
    try {
      this.faceStatus = 'Capturing...';
      if (this.videoRef?.nativeElement) await this.startWebcam();

      const embedding = await this.faceService.captureEmbedding();
      if (!embedding) throw new Error('No face detected—please try again.');

      const data = { model: 'faceapi-facenet-128d', embedding };
      payload.face_template = this.useEncryption
        ? await this.keyService.encryptJson(data)
        : JSON.stringify(embedding); // plain array if not encrypted

      this.faceStatus = 'Success';
      this.log(`${user.firstname} - Face (Success)`);
    } catch (err: any) {
      this.faceStatus = 'Failed';
      this.log(`${user.firstname} - Face (Failed: ${err?.message || 'error'})`);
    }
  }

  // ------------------ Attendance Sign-In ------------------
  async startAttendanceSign() {
    this.errorMessage = '';
    this.faceStatus = 'Capturing...';

    try {
      if (this.videoRef?.nativeElement) await this.startWebcam();

      const embedding = await this.faceService.captureEmbedding();
      if (!embedding) throw new Error('No face detected—please try again.');

      const resp = await this.communicatorService.signInAttendance({
        face_embedding: embedding, // raw embedding
      });

      if (resp?.success) {
        this.faceStatus = 'Signed In';
        this.log(
          `Attendance Sign-In Success for ${resp.firstname} ${resp.lastname} (${resp.method})`
        );
      } else {
        this.faceStatus = 'Failed';
        this.errorMessage = resp?.message || 'Attendance sign-in failed.';
        this.log(`Attendance Sign-In Failed: ${this.errorMessage}`);
      }
    } catch (err: any) {
      this.faceStatus = 'Failed';
      this.errorMessage =
        err?.error?.message || err?.message || 'Server error during sign-in.';
      this.log(`Attendance Sign-In Failed: ${this.errorMessage}`);
    }
  }

  abortEnrollment() {
    this.fingerprintStatus = 'Aborted';
    this.faceStatus = 'Aborted';
    this.faceService.stopWebcam();
    this.log('Enrollment Aborted');
  }

  retryEnrollment() {
    this.fingerprintStatus = 'Retrying...';
    this.faceStatus = 'Retrying...';
    this.log('Enrollment Retrying');
    this.startEnrollment();
  }
}

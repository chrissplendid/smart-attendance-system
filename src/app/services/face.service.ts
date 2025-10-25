import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import * as tf from '@tensorflow/tfjs';

@Injectable({ providedIn: 'root' })
export class FaceService {
  private faceapi: typeof import('@vladmandic/face-api') | null = null;
  private videoEl?: HTMLVideoElement;
  private modelsLoaded = false;
  private readonly isBrowser: boolean;
  private readonly modelPath: string;

  // private readonly apiUrl = 'http://127.0.0.1:5000/api'; // Flask backend local URL
  private readonly apiUrl = 'https://attendance.yonnegroup.co/smart-attendance-package/backend/smart-attendance-backend/api';

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Respect Angular <base href="/smart-attendance-system/">
    const baseUrl = this.document.baseURI.replace(/\/$/, '');
    this.modelPath = `${baseUrl}/assets/models`;
  }

  /** Load face-api models */
  async loadModels(): Promise<void> {
    if (!this.isBrowser || this.modelsLoaded) return;

    try {
      const faceapi = await import('@vladmandic/face-api');
      this.faceapi = faceapi;

      await tf.ready();

      let modelPath = 'models';

      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(modelPath),
        faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
        faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
      ]);

      this.modelsLoaded = true;
      console.info('✅ Face-api models loaded:', modelPath);
    } catch (err) {
      console.error('❌ Failed to load face-api models:', err);
      throw new Error('Face-api model loading failed');
    }
  }

  /** Initialize webcam */
  async initWebcam(video: HTMLVideoElement): Promise<void> {
    if (!this.isBrowser) return;

    try {
      this.videoEl = video;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      video.srcObject = stream;
      await video.play();
      console.info('📷 Webcam initialized');
    } catch (err) {
      console.error('❌ Failed to initialize webcam:', err);
      throw new Error('Webcam initialization failed');
    }
  }

  /** Capture face embedding */
  async captureEmbedding(): Promise<number[] | null> {
    if (!this.isBrowser || !this.videoEl || !this.faceapi) return null;

    try {
      const detection = await this.faceapi
        .detectSingleFace(
          this.videoEl,
          new this.faceapi.SsdMobilenetv1Options({ minConfidence: 0.6 })
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        console.warn('⚠️ No face detected');
        return null;
      }

      return Array.from(detection.descriptor);
    } catch (err) {
      console.error('❌ Error capturing face embedding:', err);
      return null;
    }
  }

  /** Enroll face for a user (admin-only flow) */
  async enrollFace(userUuid: string): Promise<boolean> {
    const embedding = await this.captureEmbedding();
    if (!embedding) return false;

    try {
      const res = await this.http
        .post<{ message?: string }>(
          `${this.apiUrl}/biometrics/enroll`,
          {
            user_uuid: userUuid,
            face_template: btoa(JSON.stringify(embedding)), // base64 encode
          },
          { withCredentials: true }
        )
        .toPromise();

      console.info('✅ Face enrollment response:', res);
      return true;
    } catch (err) {
      console.error('❌ Face enrollment failed:', err);
      return false;
    }
  }

  /** Sign-in with face (attendance) */
  async signInFace(): Promise<{
    success: boolean;
    user?: any;
    message?: string;
  }> {
    const embedding = await this.captureEmbedding();
    if (!embedding) {
      return { success: false, message: 'No face detected' };
    }

    try {
      const res = await this.http
        .post<any>(
          `${this.apiUrl}/attendance/signin`,
          {
            face_embedding: embedding,
          },
          { withCredentials: true }
        )
        .toPromise();

      return res ?? { success: false, message: 'No response from server' };
    } catch (err) {
      console.error('❌ Face sign-in failed:', err);
      return { success: false, message: 'Server error' };
    }
  }

  /** Stop webcam */
  stopWebcam(): void {
    if (!this.isBrowser || !this.videoEl) return;

    const stream = this.videoEl.srcObject;
    if (stream instanceof MediaStream) {
      stream.getTracks().forEach((t) => t.stop());
      this.videoEl.srcObject = null;
      console.info('🛑 Webcam stopped');
    }
  }

  areModelsLoaded(): boolean {
    return this.modelsLoaded;
  }
}

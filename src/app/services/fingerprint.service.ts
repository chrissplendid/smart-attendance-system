import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FingerprintService {
  private ws?: WebSocket;

  connect(url = 'ws://127.0.0.1:9000'): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(new Error('Fingerprint bridge not reachable'));
    });
  }

  async capture(): Promise<{ templateB64: string; quality?: number }> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      await this.connect();
    }
    const ws = this.ws!;

    return new Promise((resolve, reject) => {
      const req = { action: 'captureFingerprint', params: { timeoutMs: 10000, format: 'ISO_19794_2' } };
      ws.send(JSON.stringify(req));

      const onMessage = (ev: MessageEvent) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.action === 'captureFingerprint') {
            ws.removeEventListener('message', onMessage);
            if (msg.success) {
              resolve({ templateB64: msg.data.templateB64, quality: msg.data.quality });
            } else {
              reject(new Error(msg.error || 'Fingerprint capture failed'));
            }
          }
        } catch (err) {
          ws.removeEventListener('message', onMessage);
          reject(err);
        }
      };
      ws.addEventListener('message', onMessage);
    });
  }

  disconnect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.close();
  }
}

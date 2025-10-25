import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class KeyService {
  private cryptoKey?: CryptoKey;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  // http://127.0.0.1:5000/api/crypto/session-key // local
  // https://attendance.yonnegroup.co/smart-attendance-package/backend/smart-attendance-backend/api/crypto/session-key // production

  /**
   * Fetches session AES key from backend and imports it into SubtleCrypto.
   */
  async loadKeyFromServer(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return; // ✅ skip SSR

    try {
      const res = await fetch('https://attendance.yonnegroup.co/smart-attendance-package/backend/smart-attendance-backend/api/crypto/session-key', {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch key: ${res.status}`);
      }

      const { keyB64 } = await res.json();
      if (!keyB64) {
        throw new Error('Invalid response: missing keyB64');
      }

      const raw = Uint8Array.from(atob(keyB64), (c) => c.charCodeAt(0));
      this.cryptoKey = await crypto.subtle.importKey(
        'raw',
        raw,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );
    } catch (err) {
      console.error('Error loading crypto key:', err);
      throw err;
    }
  }

  /**
   * Encrypts a JSON-serializable object using AES-GCM.
   * Returns base64(iv|ciphertext).
   */
  async encryptJson(obj: unknown): Promise<string> {
    if (!isPlatformBrowser(this.platformId)) {
      throw new Error('Encryption is only available in the browser');
    }

    if (!this.cryptoKey) {
      await this.loadKeyFromServer();
    }

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plaintext = new TextEncoder().encode(JSON.stringify(obj));

    const ct = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.cryptoKey!,
      plaintext
    );

    const cipherBytes = new Uint8Array(ct);
    const out = new Uint8Array(iv.length + cipherBytes.length);
    out.set(iv, 0);
    out.set(cipherBytes, iv.length);

    return btoa(String.fromCharCode(...out));
  }
}

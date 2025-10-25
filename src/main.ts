import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/***************************************************************************************************
 * TextEncoder / TextDecoder polyfill
 * - Browsers already provide these natively
 * - Only patch globalThis if missing (e.g., older environments or SSR)
 ***************************************************************************************************/
(function applyTextEncodingPolyfill() {
  if (typeof globalThis.TextEncoder === 'undefined') {
    globalThis.TextEncoder = class {
      encode(str: string): Uint8Array {
        const encoder = new (window as any).TextEncoder();
        return encoder.encode(str);
      }
    } as any;
  }

  if (typeof globalThis.TextDecoder === 'undefined') {
    globalThis.TextDecoder = class {
      decode(buffer: Uint8Array): string {
        const decoder = new (window as any).TextDecoder();
        return decoder.decode(buffer);
      }
    } as any;
  }
})();

// 🚀 Start the Angular app
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));

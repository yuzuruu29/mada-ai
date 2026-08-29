import { describe, expect, it } from 'vitest';
import { assertSafeUrl, SsrfBlockedError } from './index.js';

describe('SSRF guards', () => {
  it('blocks localhost', async () => {
    await expect(assertSafeUrl('http://localhost/secret')).rejects.toBeInstanceOf(SsrfBlockedError);
  });

  it('blocks private IPs', async () => {
    await expect(assertSafeUrl('http://127.0.0.1/')).rejects.toBeInstanceOf(SsrfBlockedError);
    await expect(assertSafeUrl('http://192.168.1.10/')).rejects.toBeInstanceOf(SsrfBlockedError);
  });

  it('blocks non-http protocols', async () => {
    await expect(assertSafeUrl('file:///etc/passwd')).rejects.toBeInstanceOf(SsrfBlockedError);
  });
});

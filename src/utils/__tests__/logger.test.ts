import { describeError, redactForLog } from '../logger';

describe('logger', () => {
  it('redacts PII-bearing keys and keeps safe ones', () => {
    const redacted = redactForLog({
      accountNumber: '0400012345678',
      consumerName: 'Someone',
      meterNo: '123',
      rawOcrText: 'text',
      billImageUri: 'file://x',
      encryptionKey: 'abc',
      status: 'ready',
      count: 3,
    });
    expect(redacted).toEqual({
      accountNumber: '[REDACTED]',
      consumerName: '[REDACTED]',
      meterNo: '[REDACTED]',
      rawOcrText: '[REDACTED]',
      billImageUri: '[REDACTED]',
      encryptionKey: '[REDACTED]',
      status: 'ready',
      count: 3,
    });
  });

  it('describes errors by class name only, never by message', () => {
    expect(describeError(new TypeError('secret 0400012345678'))).toBe('TypeError');
    expect(describeError('string')).toBe('UnknownError');
  });
});

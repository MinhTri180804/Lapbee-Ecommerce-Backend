import { JwtPayload, sign } from 'jsonwebtoken';
import { JWTGenerator } from '../utils/JwtGenerator.util.js';
import { env } from '../configs/env.config';
import jsonwebtoken from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mocked.jwt.token'),
  decode: jest.fn(() => ({ jti: 'mock-jti-uuid' }))
}));

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-jti-uuid')
}));

describe('JWTGenerator - setPassword', () => {
  const mockUserAuthId = '12345';

  beforeEach(() => {
    jest.clearAllMocks();

    env.jwt = {
      SECRET_KEY: {
        SET_PASSWORD: 'test-secret-key'
      }
      // eslint-disable-next-line
    } as any;

    env.expiredTime = {
      day: {
        TOKEN_SET_PASSWORD: '1d'
      }
      // eslint-disable-next-line
    } as any;
  });

  it('should generate JWT token with correct payload and secret', () => {
    const token = JWTGenerator.setPassword({ userAuthId: mockUserAuthId });
    const { jti } = jsonwebtoken.decode(token) as JwtPayload;

    expect(sign).toHaveBeenCalledWith({}, 'test-secret-key', {
      subject: mockUserAuthId,
      expiresIn: '1d',
      jwtid: jti
    });

    expect(token).toBe('mocked.jwt.token');
  });
});

describe('JWTGenerator method isMatchWithTypeStringValue', () => {
  it('It Not Match', () => {
    const value = '5';
    const result = JWTGenerator.isMatchWithTypeStringValue(value);

    expect(result).toBe(false);
  });

  it('It Not Match', () => {
    const value = '7x';
    const result = JWTGenerator.isMatchWithTypeStringValue(value);

    expect(result).toBe(false);
  });

  it('It Match', () => {
    const value = '7d';
    const result = JWTGenerator.isMatchWithTypeStringValue(value);

    expect(result).toBe(true);
  });

  it('It Match', () => {
    const value = '7 d';
    const result = JWTGenerator.isMatchWithTypeStringValue(value);

    expect(result).toBe(true);
  });
});

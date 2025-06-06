import { JwtPayload, sign } from 'jsonwebtoken';
import { JWTGenerator } from '../utils/JwtGenerator.util.js';
import { env } from '../configs/env.config';
import jsonwebtoken from 'jsonwebtoken';
import { UserAuthRoleEnum } from '../enums/userAuthRole.enum.js';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mocked.jwt.token'),
  decode: jest.fn(() => ({ jti: 'mock-jti-uuid' }))
}));

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-jti-uuid')
}));

describe('JWTGenerator - setPassword', () => {
  const mockUserAuthId = '12345';
  const mockRole = UserAuthRoleEnum.CUSTOMER;

  beforeEach(() => {
    jest.clearAllMocks();

    env.jwt = {
      SECRET_KEY: {
        SET_PASSWORD: 'test-secret-key',
        ACCESS_TOKEN: 'test-access-token',
        REFRESH_TOKEN: 'test-refresh-token'
      }
      // eslint-disable-next-line
    } as any;

    env.expiredTime = {
      day: {
        TOKEN_SET_PASSWORD: '1d',
        REFRESH_TOKEN: '7d'
      },
      hours: {
        ACCESS_TOKEN: '1h'
      }
      // eslint-disable-next-line
    } as any;
  });

  it('should generate JWT token with correct payload and secret', () => {
    const token = JWTGenerator.createPassword({ userAuthId: mockUserAuthId });
    const { jti } = jsonwebtoken.decode(token) as JwtPayload;

    expect(sign).toHaveBeenCalledWith({}, 'test-secret-key', {
      subject: mockUserAuthId,
      expiresIn: '1d',
      jwtid: jti
    });

    expect(token).toBe('mocked.jwt.token');
  });

  it('should generate JWT accessToken with correct payload and secret', () => {
    const token = JWTGenerator.accessToken({ userAuthId: mockUserAuthId, role: mockRole });
    const { jti } = jsonwebtoken.decode(token) as JwtPayload;

    expect(sign).toHaveBeenCalledWith(
      {
        role: mockRole
      },
      'test-access-token',
      {
        subject: mockUserAuthId,
        expiresIn: '1h',
        jwtid: jti
      }
    );

    expect(token).toBe('mocked.jwt.token');
  });

  it('should generate JWT refreshToken with correct payload and secret', () => {
    const token = JWTGenerator.refreshToken({ userAuthId: mockUserAuthId });
    const { jti } = jsonwebtoken.decode(token) as JwtPayload;

    expect(sign).toHaveBeenCalledWith({}, 'test-refresh-token', {
      subject: mockUserAuthId,
      expiresIn: '7d',
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

import { sign } from 'jsonwebtoken';
import { JWTGenerator } from '../utils/JwtGenerator.util.js';
import { env } from '../configs/env.config';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mocked.jwt.token')
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

    expect(sign).toHaveBeenCalledWith({}, 'test-secret-key', {
      subject: mockUserAuthId,
      expiresIn: '1d'
    });

    expect(token).toBe('mocked.jwt.token');
  });
});

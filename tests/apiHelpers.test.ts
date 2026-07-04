jest.mock('../src/utils/cache', () => ({
  kv: {
    incr: jest.fn(),
    expire: jest.fn(),
    get: jest.fn(),
    incrby: jest.fn(),
    pipeline: jest.fn(() => ({
      incr: jest.fn().mockReturnThis(),
      incrby: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    })),
  },
}));

jest.mock('../src/services/valorantService', () => ({}));

import {
  validateRouteParams,
  validateQueryParams,
  errorResponse,
} from '../src/utils/apiHelpers';

describe('validateRouteParams', () => {
  it('acepta regiones válidas', () => {
    expect(validateRouteParams('na', 'Player', 'TAG')).toBeNull();
    expect(validateRouteParams('LATAM', 'Player', 'TAG')).toBeNull();
  });

  it('rechaza regiones inválidas', () => {
    const res = validateRouteParams('invalid', 'Player', 'TAG');
    expect(res?.status).toBe(400);
  });

  it('rechaza nombre o tag vacíos', () => {
    expect(validateRouteParams('na', '', 'TAG')?.status).toBe(400);
    expect(validateRouteParams('na', 'Player', '')?.status).toBe(400);
  });
});

describe('validateQueryParams', () => {
  it('aplica valores por defecto', () => {
    const result = validateQueryParams(null, null, null);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.lang).toBe('es');
      expect(result.data.type).toBe('1');
    }
  });

  it('conserva format, lang y type personalizados', () => {
    const result = validateQueryParams('text', 'en', '3');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.format).toBe('text');
      expect(result.data.lang).toBe('en');
      expect(result.data.type).toBe('3');
    }
  });
});

describe('errorResponse', () => {
  it('devuelve JSON con status y mensaje', async () => {
    const res = errorResponse(404, 'Player not found');
    expect(res.status).toBe(404);
    expect(res.headers.get('Content-Type')).toContain('application/json');
    await expect(res.json()).resolves.toEqual({ status: 404, error: 'Player not found' });
  });
});

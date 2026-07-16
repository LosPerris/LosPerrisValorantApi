jest.mock('../src/utils/cache', () => ({
  kv: {
    incr: jest.fn(),
    expire: jest.fn(),
    ttl: jest.fn(),
    get: jest.fn(),
    incrby: jest.fn(),
    pipeline: jest.fn(() => ({
      incr: jest.fn().mockReturnThis(),
      incrby: jest.fn().mockReturnThis(),
      expire: jest.fn().mockReturnThis(),
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
  it('acepta regiones válidas y las normaliza', () => {
    const na = validateRouteParams('na', 'Player', 'TAG');
    expect(na.ok).toBe(true);
    if (na.ok) expect(na.data.region).toBe('na');

    const latam = validateRouteParams('LATAM', 'Player', 'TAG');
    expect(latam.ok).toBe(true);
    if (latam.ok) expect(latam.data.region).toBe('latam');
  });

  it('rechaza regiones inválidas', () => {
    const res = validateRouteParams('invalid', 'Player', 'TAG');
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error.status).toBe(400);
  });

  it('rechaza nombre o tag vacíos', () => {
    const emptyName = validateRouteParams('na', '', 'TAG');
    const emptyTag = validateRouteParams('na', 'Player', '');
    expect(emptyName.ok).toBe(false);
    expect(emptyTag.ok).toBe(false);
    if (!emptyName.ok) expect(emptyName.error.status).toBe(400);
    if (!emptyTag.ok) expect(emptyTag.error.status).toBe(400);
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

  it('normaliza format/lang y conserva type', () => {
    const result = validateQueryParams('TEXT', 'EN', '3');
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

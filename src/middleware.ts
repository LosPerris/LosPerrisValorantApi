import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (_context, next) => {
    const response = await next();
    
    // Inyectar headers de seguridad agnósticos
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com https://code.iconify.design https://vlr.losperris.dev https://los-perris-valorant-api.vercel.app; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://code.iconify.design https://vlr.losperris.dev https://los-perris-valorant-api.vercel.app; font-src 'self' https://fonts.gstatic.com https://vlr.losperris.dev https://los-perris-valorant-api.vercel.app; img-src 'self' data: https://media.valorant-api.com https://vlr.losperris.dev https://los-perris-valorant-api.vercel.app; connect-src 'self' https://api.henrikdev.xyz https://valorant-api.com https://unpkg.com https://code.iconify.design https://api.iconify.design https://api.simplesvg.com https://api.unisvg.com; object-src 'none'; upgrade-insecure-requests; frame-ancestors 'self'");
    
    return response;
});

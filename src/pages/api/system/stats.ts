import type { APIRoute } from 'astro';
import { getRequestMetrics } from '../../../utils/apiHelpers';

export const GET: APIRoute = async () => {
    const { requests, latency } = await getRequestMetrics();

    return new Response(
        JSON.stringify({
            status: 200,
            data: { latency, requests }
        }),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
            }
        }
    );
};

import cache from '../utils/cache';
import { config } from '../config';
import { ValorantApiResponse } from '../types/valorant';


function handleApiError(status: number, data: unknown): never {
    throw { status, data, message: 'API Error' };
}

const inFlightRequests = new Map<string, Promise<unknown>>();

export async function fetchWithCache<T>(
    key: string,
    endpoint: string,
    ttl: number = 300 // 5 minutos por defecto (en segundos)
): Promise<ValorantApiResponse<T>> {
    // 1. Verificar Caché (Redis)
    const cachedData = await cache.get<ValorantApiResponse<T>>(key);
    if (cachedData) return cachedData;

    // 2. Verificar In-Flight Cache (Deduplicación de Promesas para Dogpiling)
    if (inFlightRequests.has(key)) {
        return inFlightRequests.get(key) as Promise<ValorantApiResponse<T>>;
    }

    // 3. Crear nueva promesa y guardarla en In-Flight
    const fetchPromise = (async () => {
        try {
            const response = await fetch(`${config.henrikBaseUrl}${endpoint}`, {
                headers: {
                    'Authorization': config.henrikApiKey || '',
                    'accept': 'application/json'
                }
            });
            
            const data = await response.json();

            if (!response.ok) {
                return handleApiError(response.status, data);
            }

            if (data && data.status === 200) {
                await cache.set(key, data, { ttl });
            }
            return data;
        } catch (error: unknown) {
            const errObj = error as Record<string, unknown>;
            if (errObj?.status) throw error;
            
            // Evitar exponer grandes bloques de HTML o stack traces internos
            const rawErrorMsg = errObj?.message || String(error);
            const safeErrorMsg = rawErrorMsg.length > 200 ? 'Service Unavailable or parsing error' : rawErrorMsg;

            throw {
                status: 500,
                message: 'Internal Server Error',
                error: safeErrorMsg
            };
        } finally {
            // Eliminar de in-flight al terminar (éxito o error)
            inFlightRequests.delete(key);
        }
    })();

    inFlightRequests.set(key, fetchPromise);
    return fetchPromise;
}

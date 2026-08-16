import cache from '../utils/cache';
import { config } from '../config';
import { ValorantApiResponse } from '../types/valorant';


function handleApiError(status: number, data: unknown) {
    return { status, data, message: 'API Error' } as any;
}

const inFlightRequests = new Map<string, Promise<unknown>>();

export async function fetchWithCache<T>(
    key: string,
    endpoint: string,
    ttl: number = 300, // 5 minutos por defecto (en segundos)
    apiKey?: string
): Promise<ValorantApiResponse<T>> {
    // 1. Verificar Caché (Redis)
    const cachedData = await cache.get<ValorantApiResponse<T>>(key);
    if (cachedData) return cachedData;

    // 2. Verificar In-Flight Cache (Deduplicación de Promesas para Dogpiling)
    // La clave incluye los últimos 6 chars de la api_key para no mezclar promesas entre keys distintas
    const inflightKey = apiKey ? `${key}:${apiKey.slice(-6)}` : key;
    if (inFlightRequests.has(inflightKey)) {
        return inFlightRequests.get(inflightKey) as Promise<ValorantApiResponse<T>>;
    }

    // 3. Crear nueva promesa y guardarla en In-Flight
    const fetchPromise = (async () => {
        try {
            const response = await fetch(`${config.henrikBaseUrl}${endpoint}`, {
                headers: {
                    'Authorization': apiKey || config.henrikApiKey || '',
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
            if (errObj?.status) return errObj as any;
            
            // Evitar exponer grandes bloques de HTML o stack traces internos
            const rawErrorMsg = typeof errObj?.message === 'string' ? errObj.message : String(error);
            const safeErrorMsg = rawErrorMsg.length > 200 ? 'Service Unavailable or parsing error' : rawErrorMsg;

            return {
                status: 500,
                message: 'Internal Server Error',
                error: safeErrorMsg
            } as any;
        } finally {
            // Eliminar de in-flight al terminar (éxito o error)
            inFlightRequests.delete(inflightKey);
        }
    })();

    inFlightRequests.set(inflightKey, fetchPromise);
    return fetchPromise;
}

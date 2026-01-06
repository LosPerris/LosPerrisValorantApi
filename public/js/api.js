async function fetchPlayerSummary(region, name, tag) {
    const url = `${CONFIG.apiBaseUrl}/summary/${region}/${name}/${tag}`;
    console.log('[DEBUG] Fetching:', url);

    try {
        const response = await fetch(url);
        console.log('[DEBUG] Response Status:', response.status);

        const text = await response.text();
        console.log('[DEBUG] Raw Body:', text);

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('[DEBUG] JSON Parse Error:', e);
            throw { error: 'SERVER_ERROR', message: 'Invalid JSON response' };
        }

        if (!response.ok) {
            console.error('[DEBUG] Response not OK:', data);
            throw data;
        }

        return data;
    } catch (err) {
        console.error('[DEBUG] Network/Fetch Error:', err);
        throw err;
    }
}

async function fetchPreview(payload) {
    const response = await fetch(`${CONFIG.apiBaseUrl}/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok) {
        throw data;
    }

    return data;
}

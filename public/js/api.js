async function fetchPlayerSummary(region, name, tag) {
    const url = `${CONFIG.apiBaseUrl}/summary/${region}/${name}/${tag}`;

    try {
        const response = await fetch(url);
        const text = await response.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            throw { error: 'SERVER_ERROR', message: 'Invalid JSON response' };
        }

        if (!response.ok) {
            throw data;
        }

        return data;
    } catch (err) {
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

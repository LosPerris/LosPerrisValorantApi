async function fetchPlayerSummary(region, name, tag) {
    const url      = `${CONFIG.apiBaseUrl}/summary/${region}/${name}/${tag}`;
    const response = await fetch(url);
    const data     = await response.json();

    if (!response.ok) throw data;
    return data;
}

async function fetchPreview(payload) {
    const response = await fetch(`${CONFIG.apiBaseUrl}/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok) throw data;
    return data;
}

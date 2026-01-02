async function fetchPlayerSummary(region, name, tag) {
    const response = await fetch(`${apiBase}/summary/${region}/${name}/${tag}`);
    const data = await response.json();

    if (!response.ok) {
        throw data;
    }

    return data;
}

async function fetchPreview(payload) {
    const response = await fetch(`${apiBase}/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return await response.json();
}

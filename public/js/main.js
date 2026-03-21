let currentLang = 'es';
let fullSummaryData = null;
let currentConfigMode = 'rank';
const MAX_RECENT_SEARCHES = 3;

const safeAddEventListener = (id, event, handler) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, handler);
};

function init() {
    renderRecentSearchesMain();
    updateLanguageUI(currentLang);
    updateCommandsUI(null);
    if (typeof setUIState === 'function') setUIState('INITIAL');

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLang = btn.dataset.lang;
            updateLanguageUI(currentLang);
            if (fullSummaryData) {
                renderRankCard(fullSummaryData.data.rank, currentLang);
                renderMatchCard(fullSummaryData.data.match, fullSummaryData.data.rank.puuid, currentLang);
                updateCommandsUI(fullSummaryData);
            }
        });
    });

    safeAddEventListener('btn-config-rank', 'click', () => {
        currentConfigMode = 'rank';
        toggleConfigMode('rank');
        updateCommandsUI(fullSummaryData);
    });

    safeAddEventListener('btn-config-match', 'click', () => {
        currentConfigMode = 'match';
        toggleConfigMode('match');
        updateCommandsUI(fullSummaryData);
    });

    const botConfigInputs = ['bot-platform', 'bot-lang', 'bot-type', 'bot-match-type'];

    botConfigInputs.forEach(id => {
        safeAddEventListener(id, 'change', () => {
            updateCommandsUI(fullSummaryData);
        });
    });
}

function initOverlayListeners() {
    const overlayInputIds = ['overlay-lang', 'overlay-color', 'overlay-bg-color', 'overlay-text-color', 'overlay-twitch', 'overlay-align', 'overlay-scale', 'overlay-hide-rr', 'overlay-hide-mmr', 'overlay-layout', 'overlay-autohide', 'overlay-progress', 'overlay-kda'];

    overlayInputIds.forEach(id => {
        safeAddEventListener(id, 'change', () => {
            updateOverlayUI(fullSummaryData);
        });

        safeAddEventListener(id, 'input', () => {
            updateOverlayUrlOnly();
            clearTimeout(colorDebounceTimer);
            colorDebounceTimer = setTimeout(() => {
                updateOverlayIframeOnly();
            }, 600);
        });
    });
}

let colorDebounceTimer;

init();

function getOverlayUrlStr() {
    const regionEl = document.getElementById('region');
    const nameEl = document.getElementById('name');
    const tagEl = document.getElementById('tag');
    const langEl = document.getElementById('overlay-lang');
    const colorEl = document.getElementById('overlay-color');
    const bgEl = document.getElementById('overlay-bg-color');
    const textEl = document.getElementById('overlay-text-color');
    const twitchEl = document.getElementById('overlay-twitch');

    const alignEl = document.getElementById('overlay-align');
    const scaleEl = document.getElementById('overlay-scale');
    const hideRrEl = document.getElementById('overlay-hide-rr');
    const hideMmrEl = document.getElementById('overlay-hide-mmr');

    const layoutEl = document.getElementById('overlay-layout');
    const progressEl = document.getElementById('overlay-progress');
    const autohideEl = document.getElementById('overlay-autohide');
    const kdaEl = document.getElementById('overlay-kda');

    if (!regionEl || !nameEl || !tagEl || !langEl) return null;

    let colorValue = colorEl ? colorEl.value.replace('#', '') : 'ff4655';
    if (!colorValue) colorValue = 'ff4655';

    let bgValue = bgEl ? bgEl.value.replace('#', '') : '0A0F16';
    if (!bgValue) bgValue = '0A0F16';

    let textValue = textEl ? textEl.value.replace('#', '') : 'ECE8E1';
    if (!textValue) textValue = 'ECE8E1';

    let urlParams = new URLSearchParams({
        region: regionEl.value,
        name: nameEl.value,
        tag: tagEl.value,
        lang: langEl.value,
        color: colorValue,
        bg: bgValue,
        text: textValue
    });

    if (twitchEl && twitchEl.value.trim()) {
        urlParams.append('twitch', twitchEl.value.trim());
    }

    if (alignEl && alignEl.value !== 'left') {
        urlParams.append('align', alignEl.value);
    }
    if (scaleEl && scaleEl.value !== '1') {
        urlParams.append('scale', scaleEl.value);
    }
    if (hideRrEl && hideRrEl.checked) {
        urlParams.append('hide_rr', 'true');
    }
    if (hideMmrEl && hideMmrEl.checked) {
        urlParams.append('hide_mmr', 'true');
    }

    if (layoutEl && layoutEl.value !== 'default') {
        urlParams.append('layout', layoutEl.value);
    }
    if (progressEl && progressEl.checked) {
        urlParams.append('progress', 'true');
    }
    if (autohideEl && autohideEl.checked) {
        urlParams.append('autohide', 'true');
    }
    if (kdaEl && kdaEl.checked) {
        urlParams.append('kda', 'true');
    }

    return `${window.location.origin}${CONFIG.apiBaseUrl}/overlay?${urlParams.toString()}`;
}

function getOverlayPreviewUrlStr() {
    const base = getOverlayUrlStr();
    if (!base) return null;
    return `${base}&preview=true`;
}

function updateOverlayUrlOnly() {
    const urlStr = getOverlayUrlStr();
    if (!urlStr) return;

    const inputUrl = document.getElementById('overlay-url');
    if (inputUrl) inputUrl.value = urlStr;
}

function updateOverlayIframeOnly() {
    const urlStr = getOverlayPreviewUrlStr();
    if (!urlStr) return;

    const iframe = document.getElementById('overlay-iframe');
    if (iframe) {
        iframe.src = urlStr;
    }
}

function updateOverlayUI(data) {
    if (!data) return;
    updateOverlayUrlOnly();
    updateOverlayIframeOnly();
}

safeAddEventListener('rank-form', 'submit', async (e) => {
    e.preventDefault();

    const regionEl = document.getElementById('region');
    const nameEl = document.getElementById('name');
    const tagEl = document.getElementById('tag');

    if (!regionEl || !nameEl || !tagEl) return;

    const region = regionEl.value;
    const name = nameEl.value;
    const tag = tagEl.value;

    showLoading(currentLang);

    try {
        const data = await fetchPlayerSummary(region, name, tag);
        fullSummaryData = data;
        saveRecentSearch(region, name, tag);

        renderRankCard(data.data.rank, currentLang);

        if (data.data.match) {
            renderMatchCard(data.data.match, data.data.rank.puuid, currentLang);
        }

        if (data.data.history) {
            renderChart(data.data.history);
        }

        if (typeof window.loadResultComponents === 'function') {
            const wasFirstLoad = await window.loadResultComponents();
            if (wasFirstLoad) {
                initOverlayListeners();
            }
        }

        updateCommandsUI(fullSummaryData);
        updateOverlayUI(fullSummaryData);
        showResults();

    } catch (error) {
        console.error('Error:', error);
        showError(error, currentLang);
    } finally {
        hideLoading(currentLang);
    }
});

document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        if (!input) return;

        navigator.clipboard.writeText(input.value).then(() => {
            const originalText = btn.textContent;
            btn.textContent = 'COPIED!';
            setTimeout(() => btn.textContent = originalText, 2000);
        }).catch(() => {
            input.select();
            document.execCommand('copy');
            const originalText = btn.textContent;
            btn.textContent = 'COPIED!';
            setTimeout(() => btn.textContent = originalText, 2000);
        });
    });
});

safeAddEventListener('btn-copy-json', 'click', () => {
    if (!fullSummaryData) return;

    const jsonStr = JSON.stringify(fullSummaryData, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
        const btn = document.getElementById('btn-copy-json');
        if (btn) {
            const originalHtml = btn.innerHTML;
            btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            setTimeout(() => btn.innerHTML = originalHtml, 2000);
        }
    });
});

function saveRecentSearch(region, name, tag) {
    let searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    searches = searches.filter(s => !(s.name.toLowerCase() === name.toLowerCase() && s.tag.toLowerCase() === tag.toLowerCase()));
    searches.unshift({ region, name, tag });
    if (searches.length > MAX_RECENT_SEARCHES) {
        searches.pop();
    }
    localStorage.setItem('recentSearches', JSON.stringify(searches));
    renderRecentSearchesMain();
}

function renderRecentSearchesMain() {
    const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    renderRecentSearches(searches, (s) => {
        const regionEl = document.getElementById('region');
        const nameEl = document.getElementById('name');
        const tagEl = document.getElementById('tag');
        const submitBtn = document.getElementById('submit-btn');

        if (regionEl) regionEl.value = s.region;
        if (nameEl) nameEl.value = s.name;
        if (tagEl) tagEl.value = s.tag;
        if (submitBtn) submitBtn.click();
    });
}

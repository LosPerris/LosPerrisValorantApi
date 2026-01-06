let currentLang = 'es';
let fullSummaryData = null;
let currentConfigMode = 'rank';
const MAX_RECENT_SEARCHES = 3;

const safeAddEventListener = (id, event, handler) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, handler);
};

document.addEventListener('DOMContentLoaded', () => {
    renderRecentSearchesMain();
    updateLanguageUI(currentLang);
    updateCommandsUI(null);
});

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

const configInputs = ['bot-platform', 'bot-lang', 'bot-type', 'bot-match-type'];
configInputs.forEach(id => {
    safeAddEventListener(id, 'change', () => {
        updateCommandsUI(fullSummaryData);
    });
});

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
        console.log('API Data received:', data);
        fullSummaryData = data;
        saveRecentSearch(region, name, tag);

        console.log('Rendering Rank Card...');
        renderRankCard(data.data.rank, currentLang);

        if (data.data.match) {
            console.log('Rendering Match Card...');
            renderMatchCard(data.data.match, data.data.rank.puuid, currentLang);
        }

        if (data.data.history) {
            renderChart(data.data.history);
        }

        updateCommandsUI(fullSummaryData);
        console.log('Showing Results...');
        showResults();

    } catch (error) {
        showError(error, currentLang);
    } finally {
        hideLoading(currentLang);
    }
});

document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        if (input) {
            input.select();
            document.execCommand('copy');
        }

        const originalText = btn.textContent;
        btn.textContent = 'COPIED!';
        setTimeout(() => btn.textContent = originalText, 2000);
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

const safeSetText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
};

const safeSetHtml = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
};

const safeSetSrc = (id, src) => {
    const el = document.getElementById(id);
    if (el) el.src = src;
};

const safeSetQueryText = (selector, text) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
};

let mmrChartInstance = null;
let chartJSLoaded = false;

function setUIState(state) {
    const sections = {
        results: document.getElementById('results-section'),
        docs: document.getElementById('docs-section'),
        error: document.getElementById('error-section')
    };

    Object.values(sections).forEach(section => {
        if (section) section.classList.add('view-hidden');
    });

    switch (state) {
        case 'INITIAL':
            if (sections.docs) sections.docs.classList.remove('view-hidden');
            break;
        case 'LOADING':
            break;
        case 'RESULTS':
            if (sections.results) {
                sections.results.classList.remove('view-hidden', 'hidden');
                sections.results.classList.remove('fade-in');
                void sections.results.offsetWidth;
                sections.results.classList.add('fade-in');
            }
            break;
        case 'ERROR':
            if (sections.error) {
                sections.error.classList.remove('view-hidden', 'hidden');
                sections.error.classList.remove('fade-in');
                void sections.error.offsetWidth;
                sections.error.classList.add('fade-in');
            }
            break;
    }
}

async function loadChartJS() {
    if (chartJSLoaded) return true;
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/chart.js@4.4.1/dist/chart.umd.js';
        script.onload = () => {
            chartJSLoaded = true;
            resolve(true);
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function updateLanguageUI(lang) {
    const t = translations[lang];
    safeSetHtml('title', t.title);
    safeSetText('subtitle', t.subtitle);
    safeSetQueryText('label[for="region"]', t.region);
    safeSetQueryText('label[for="name"]', t.riotId);
    safeSetQueryText('label[for="tag"]', t.tag);
    safeSetText('submit-btn', t.search);
    safeSetText('last-match-title', t.lastMatch);
    safeSetText('error-msg', t.error);

    safeSetText('chart-title', t.chartTitle);

    safeSetQueryText('.config-card h3', t.botConfig);
    safeSetQueryText('label[for="bot-platform"]', t.botPlatform);
    safeSetQueryText('label[for="bot-lang"]', t.botLang);

    safeSetQueryText('label[for="bot-type"]', t.rankFormat);
    const typeSelect = document.getElementById('bot-type');
    if (typeSelect) {
        typeSelect.options[0].text = t.format1;
        typeSelect.options[1].text = t.format2;
        typeSelect.options[2].text = t.format3;
    }

    safeSetQueryText('label[for="bot-match-type"]', t.matchFormat);
    const matchTypeSelect = document.getElementById('bot-match-type');
    if (matchTypeSelect) {
        matchTypeSelect.options[0].text = t.matchType1;
        matchTypeSelect.options[1].text = t.matchType2;
        matchTypeSelect.options[2].text = t.matchType3;
    }

    safeSetText('btn-config-rank', t.rankConfig);
    safeSetText('btn-config-match', t.matchConfig);

    safeSetQueryText('.commands-card h3', t.botCmds);

    const botLang = document.getElementById('bot-lang').value;
    updateBotCommandLabels(botLang);

    safeSetText('docs-title', t.docsTitle);
    safeSetText('docs-desc-rank', t.docsDescRank);
    safeSetText('docs-desc-match', t.docsDescMatch);
    safeSetHtml('docs-note', t.docsNote);

    safeSetHtml('footer-info', t.footerInfo);
    safeSetText('footer-disclaimer', t.footerDisclaimer);

    safeSetText('overlay-title', t.overlayTitle);
    safeSetQueryText('label[for="overlay-lang"]', t.overlayLang);
    safeSetText('lbl-overlay-url', t.overlayUrl);
    safeSetText('lbl-overlay-preview', t.overlayPreview);

    document.querySelectorAll('.example-label').forEach(el => {
        el.textContent = t.exampleLabel;
    });
}

function renderRankCard(data, lang) {
    safeSetText('player-name', `${data.name}#${data.tag}`);

    const displayRank = formatRankName(data.rank, lang);
    safeSetText('rank-text', displayRank);

    safeSetSrc('rank-img', data.rank_image);
    safeSetText('elo', data.elo);

    const mmrChange = data.mmr_change;
    const mmrEl = document.getElementById('mmr-change');
    if (mmrEl) {
        mmrEl.textContent = mmrChange > 0 ? `+${mmrChange}` : mmrChange;
        mmrEl.style.color = mmrChange >= 0 ? 'var(--success)' : 'var(--danger)';
    }

    const rr = data.ranking_in_tier || 0;
    const progressEl = document.getElementById('rank-progress');
    if (progressEl) progressEl.style.width = `${rr}%`;

    if (data.card && data.card.wide) {
        const bgEl = document.getElementById('player-card-bg');
        if (bgEl) bgEl.style.backgroundImage = `url('${data.card.wide}')`;
    }
}

function renderMatchCard(matchData, playerPuuid, lang) {
    if (!matchData) return;

    const meta = matchData.metadata;
    const stats = matchData.players.all_players.find(p => p.puuid === playerPuuid);
    const isWin = matchData.teams.red.has_won ? (stats.team === 'Red') : (stats.team === 'Blue');

    safeSetText('match-map', meta.map);

    const matchDate = new Date(meta.game_start * 1000);
    const dateOptions = { day: 'numeric', month: 'short' };
    safeSetText('match-date', matchDate.toLocaleDateString(lang, dateOptions));

    const resultEl = document.getElementById('match-result');
    if (resultEl) {
        resultEl.textContent = formatMatchResult(isWin, lang);
        resultEl.className = `match-result ${isWin ? 'win' : 'loss'}`;
    }

    safeSetText('match-kda', `${stats.stats.kills}/${stats.stats.deaths}/${stats.stats.assists}`);

    if (matchData.derived) {
        safeSetText('match-hs', `${matchData.derived.hs_percent}%`);
        safeSetSrc('match-agent-icon', matchData.derived.agent_icon);

        const bgImage = matchData.derived.map_image || matchData.derived.agent_image;
        if (bgImage) {
            const cardEl = document.querySelector('.match-card');
            if (cardEl) cardEl.style.setProperty('--match-bg', `url('${bgImage}')`);
        }
    }
}

async function renderChart(history) {
    const canvas = document.getElementById('mmrChart');
    if (!canvas) return;

    await loadChartJS();

    const ctx = canvas.getContext('2d');

    if (mmrChartInstance) {
        mmrChartInstance.destroy();
    }

    const labels = history.map(h => h.map);
    const dataPoints = history.map(h => h.elo);

    const styles = getComputedStyle(document.documentElement);
    const accentColor = styles.getPropertyValue('--accent-color').trim();

    const hexToRgba = (hex, alpha) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, hexToRgba(accentColor, 0.5));
    gradient.addColorStop(1, hexToRgba(accentColor, 0));

    mmrChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'ELO',
                data: dataPoints,
                borderColor: accentColor,
                backgroundColor: gradient,
                borderWidth: 2,
                pointBackgroundColor: '#fff',
                pointBorderColor: accentColor,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y;
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8b9bb4',
                        font: {
                            family: 'Roboto'
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8b9bb4',
                        font: {
                            family: 'Roboto'
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

function renderRecentSearches(searches, onSearchClick) {
    const container = document.getElementById('recent-searches');
    if (!container) return;
    if (searches.length === 0) {
        container.classList.add('hidden');
        return;
    }

    container.innerHTML = '';
    container.classList.remove('hidden');

    searches.forEach(s => {
        const chip = document.createElement('div');
        chip.className = 'search-chip';
        chip.innerHTML = `<span>${s.name}#${s.tag}</span>`;
        chip.addEventListener('click', () => onSearchClick(s));
        container.appendChild(chip);
    });
}

function updateCommandsUI(fullSummaryData) {
    const botLangEl = document.getElementById('bot-lang');
    if (!botLangEl) return;
    const botLang = botLangEl.value;

    updateBotCommandLabels(botLang);

    if (!fullSummaryData) return;

    const regionEl = document.getElementById('region');
    const nameEl = document.getElementById('name');
    const tagEl = document.getElementById('tag');

    if (!regionEl || !nameEl || !tagEl) return;

    const region = regionEl.value;
    const name = nameEl.value;
    const tag = tagEl.value;

    const botPlatformEl = document.getElementById('bot-platform');
    const botTypeEl = document.getElementById('bot-type');
    const botMatchTypeEl = document.getElementById('bot-match-type');

    if (!botPlatformEl || !botTypeEl || !botMatchTypeEl) return;

    const botPlatform = botPlatformEl.value;
    const botType = botTypeEl.value;
    const botMatchType = botMatchTypeEl.value;

    const baseUrl = window.location.origin + CONFIG.apiBaseUrl;

    const rankUrl = `${baseUrl}/rank/${region}/${name}/${tag}?format=text&lang=${botLang}&type=${botType}`;
    const matchUrl = `${baseUrl}/match/last/${region}/${name}/${tag}?format=text&lang=${botLang}&type=${botMatchType}`;

    const cmdRankEl = document.getElementById('cmd-rank');
    if (cmdRankEl) cmdRankEl.value = getCommandSyntax(botPlatform, rankUrl);

    const cmdMatchEl = document.getElementById('cmd-match');
    if (cmdMatchEl) cmdMatchEl.value = getCommandSyntax(botPlatform, matchUrl);

    updateExamplePreviews(fullSummaryData, botLang, botType, botMatchType);
    updateBotCommandLabels(botLang);
}

function updateBotCommandLabels(botLang) {
    const t = translations[botLang];
    if (t) {
        safeSetText('lbl-cmd-rank', t.cmdRank);
        safeSetText('lbl-cmd-match', t.cmdMatch);

        document.querySelectorAll('.example-label').forEach(el => {
            el.textContent = t.exampleLabel;
        });
    }
}

async function updateExamplePreviews(data, botLang, botType, botMatchType) {
    const r = data.data.rank;
    const m = data.data.match;

    try {
        const result = await fetchPreview({
            type: 'rank',
            lang: botLang,
            botType: botType,
            data: {
                rank: r.rank,
                rr: r.ranking_in_tier,
                elo: r.elo,
                name: r.name,
                tag: r.tag
            }
        });
        const exRank = document.getElementById('example-rank');
        if (exRank) exRank.textContent = result.text;
    } catch (e) {
        console.error('Preview Error (Rank):', e);
    }

    if (m) {
        try {
            const stats = m.players.all_players.find(p => p.puuid === r.puuid);
            const isWin = m.teams.red.has_won ? (stats.team === 'Red') : (stats.team === 'Blue');

            const result = await fetchPreview({
                type: 'match',
                lang: botLang,
                botMatchType: botMatchType,
                data: {
                    map: m.metadata.map,
                    isWin: isWin,
                    kda: `${stats.stats.kills}/${stats.stats.deaths}/${stats.stats.assists}`,
                    hs: m.derived.hs_percent,
                    agent: m.derived.agent_name,
                    mmrChange: r.mmr_change
                }
            });
            const exMatch = document.getElementById('example-match');
            if (exMatch) exMatch.textContent = result.text;
        } catch (e) {
            console.error('Preview Error (Match):', e);
        }
    }
}

function showLoading(lang) {
    setUIState('LOADING');
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<img src="./imgs/buscando_jugador.svg" class="btn-loader">';
    }

    const errorSmall = document.getElementById('error-msg');
    if (errorSmall) errorSmall.classList.add('hidden');

    document.querySelectorAll('#player-name, #rank-text, #elo, #mmr-change, #match-map, #match-result, #match-kda, #match-hs').forEach(el => {
        el.classList.add('skeleton', 'skeleton-text');
    });
}

function hideLoading(lang) {
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = translations[lang].search;
    }

    document.querySelectorAll('.skeleton').forEach(el => {
        el.classList.remove('skeleton', 'skeleton-text');
    });
}

function showResults() {
    setUIState('RESULTS');
}

function showError(error, lang) {
    setUIState('ERROR');

    const t = translations[lang];
    let msg = t.error;

    if (error.error) {
        if (error.error === 'USER_NOT_FOUND') msg = t.errorUserNotFound;
        else if (error.error === 'RATE_LIMIT') msg = t.errorRateLimit;
        else if (error.error === 'SERVER_ERROR') msg = t.errorServer;
        else if (error.error === 'UNAUTHORIZED') msg = t.errorUnauthorized;
    }

    safeSetText('error-msg-main', msg);
    safeSetText('error-msg', msg);
    const errorSmall = document.getElementById('error-msg');
    if (errorSmall) errorSmall.classList.remove('hidden');
}

function toggleConfigMode(mode) {
    const btnRank = document.getElementById('btn-config-rank');
    if (btnRank) btnRank.classList.toggle('active', mode === 'rank');

    const btnMatch = document.getElementById('btn-config-match');
    if (btnMatch) btnMatch.classList.toggle('active', mode === 'match');

    const rankGroup = document.getElementById('group-rank-format');
    const matchGroup = document.getElementById('group-match-format');

    if (rankGroup && matchGroup) {
        if (mode === 'rank') {
            rankGroup.classList.remove('hidden');
            matchGroup.classList.add('hidden');
        } else {
            rankGroup.classList.add('hidden');
            matchGroup.classList.remove('hidden');
        }
    }
}

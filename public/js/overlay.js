document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const region = params.get("region");
    const name = params.get("name");
    const tag = params.get("tag");
    const lang = params.get("lang") || "en";
    const colorParam = params.get("color");
    const bgParam = params.get("bg");
    const textParam = params.get("text");
    const twitchParam = params.get("twitch");
    const alignParam = params.get("align") || "center";
    const scaleParam = params.get("scale");
    const hideRrParam = params.get("hide_rr");
    const hideMmrParam = params.get("hide_mmr");
    const layoutParam = params.get("layout");
    const progressParam = params.get("progress");
    const autohideParam = params.get("autohide");
    const kdaParam = params.get("kda");
    const previewParam = params.get("preview");

    const RANK_COLORS = {
        'Iron': [81, 81, 81],
        'Bronze': [141, 92, 63],
        'Silver': [209, 209, 209],
        'Gold': [227, 176, 54],
        'Platinum': [44, 201, 193],
        'Diamond': [176, 138, 221],
        'Ascendant': [36, 181, 104],
        'Immortal': [161, 43, 75],
        'Radiant': [255, 241, 160]
    };
    const RANK_ORDER = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ascendant', 'Immortal', 'Radiant'];

    const RANK_TRANSLATIONS = new Map([
        ['Iron',      { es: 'Hierro',     pt: 'Ferro'      }],
        ['Bronze',    { es: 'Bronce',     pt: 'Bronze'     }],
        ['Silver',    { es: 'Plata',      pt: 'Prata'      }],
        ['Gold',      { es: 'Oro',        pt: 'Ouro'       }],
        ['Platinum',  { es: 'Platino',    pt: 'Platina'    }],
        ['Diamond',   { es: 'Diamante',   pt: 'Diamante'   }],
        ['Ascendant', { es: 'Ascendente', pt: 'Ascendente' }],
        ['Immortal',  { es: 'Inmortal',   pt: 'Imortal'    }],
        ['Radiant',   { es: 'Radiante',   pt: 'Radiante'   }]
    ]);

    function translateRank(rankStr) {
        if ((lang !== 'es' && lang !== 'pt') || !rankStr) return rankStr;
        for (const [eng, t] of RANK_TRANSLATIONS) {
            if (rankStr.includes(eng)) {
                const word = t[lang];
                return word ? rankStr.replace(eng, word) : rankStr;
            }
        }
        return rankStr;
    }

    function getRankColors(rankStr, rr) {
        const parts = rankStr.split(' ');
        const tier = parts[0];
        const div = parts.length > 1 ? parseInt(parts[1]) : 1;
        const tierIdx = RANK_ORDER.indexOf(tier);
        if (tierIdx === -1) return null;

        const c1 = RANK_COLORS[tier];
        const c2 = RANK_COLORS[RANK_ORDER[Math.min(tierIdx + 1, RANK_ORDER.length - 1)]];

        const progress = ((div - 1) * 100 + rr) / 300;
        const lerp = (a, b) => Math.round(a + (b - a) * progress);
        const r = lerp(c1[0], c2[0]);
        const g = lerp(c1[1], c2[1]);
        const b = lerp(c1[2], c2[2]);

        return {
            color: `rgb(${r}, ${g}, ${b})`,
            alpha: `rgba(${r}, ${g}, ${b}, 0.5)`,
            bright: `rgb(${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)})`
        };
    }

    if (previewParam === "true" || previewParam === "1") document.body.classList.add("preview-mode");
    if (layoutParam === "compact") document.body.classList.add("layout-compact");

    if (alignParam === "center") document.body.style.justifyContent = "center";
    else if (alignParam === "right") document.body.style.justifyContent = "flex-end";
    else if (alignParam === "left") document.body.style.justifyContent = "flex-start";

    if (scaleParam) {
        const scaleVal = parseFloat(scaleParam);
        if (!isNaN(scaleVal) && scaleVal > 0) {
            const wrapper = document.querySelector('.overlay-wrapper');
            if (wrapper) {
                wrapper.style.transform = `scale(${scaleVal})`;
                wrapper.style.transformOrigin = alignParam === 'right' ? 'right center'
                    : alignParam === 'center' ? 'center center'
                        : 'left center';
            }
        }
    }

    if (colorParam && /^[0-9A-F]{6}$/i.test(colorParam)) {
        const hex = `#${colorParam}`;
        const r = parseInt(colorParam.slice(0, 2), 16);
        const g = parseInt(colorParam.slice(2, 4), 16);
        const b = parseInt(colorParam.slice(4, 6), 16);
        document.documentElement.style.setProperty('--val-red', hex);
        document.documentElement.style.setProperty('--val-red-glow', `rgba(${r}, ${g}, ${b}, 0.5)`);
        document.documentElement.style.setProperty('--loss-red', hex);
    }

    if (bgParam && /^[0-9A-F]{6}$/i.test(bgParam)) {
        const r = parseInt(bgParam.slice(0, 2), 16);
        const g = parseInt(bgParam.slice(2, 4), 16);
        const b = parseInt(bgParam.slice(4, 6), 16);
        document.documentElement.style.setProperty('--bg-main', `rgba(${r}, ${g}, ${b}, 0.75)`);
        document.documentElement.style.setProperty('--bg-darker', `rgba(${r}, ${g}, ${b}, 0.85)`);
    }

    if (textParam && /^[0-9A-F]{6}$/i.test(textParam)) {
        document.documentElement.style.setProperty('--text-main', `#${textParam}`);
    }

    const container = document.getElementById("overlay-container");
    const statusMsg = document.getElementById("status-message");
    const twitchChannel = document.getElementById("twitch-channel");
    const twitchName = document.getElementById("twitch-name");
    const rankIcon = document.getElementById("rank-icon");
    const playerName = document.getElementById("player-name");
    const playerTag = document.getElementById("player-tag");
    const rankName = document.getElementById("rank-name");
    const rrText = document.getElementById("rr-text");
    const mmrChange = document.getElementById("mmr-change");
    const progressBar = document.getElementById("rr-progress-bar");
    const progressContainer = document.getElementById("progress-container");
    const glowContainer = document.getElementById("glow-container");
    const kdaText = document.getElementById("kda-text");
    const statsDiv = document.querySelector('.stats');
    const mmrSection = document.querySelector('.mmr-section');

    if (hideRrParam === "true" || hideRrParam === "1") {
        const divider = statsDiv ? statsDiv.querySelector('.divider') : null;
        if (divider) divider.style.display = 'none';
        if (rrText) rrText.style.display = 'none';
    }
    if (hideMmrParam === "true" || hideMmrParam === "1") {
        if (mmrSection) mmrSection.style.display = 'none';
    }

    if (twitchParam) {
        twitchName.innerText = twitchParam;
        twitchChannel.classList.remove("hidden");
    }

    if (progressParam !== "true" && progressParam !== "1") {
        progressContainer.style.display = "none";
    }

    if (!region || !name || !tag) {
        statusMsg.innerText = "Error: Missing URL parameters. Use ?region=..&name=..&tag=..";
        return;
    }

    function renderData(r) {
        rankIcon.src = r.rank_image;
        playerName.innerText = r.name;
        playerTag.innerText = `#${r.tag}`;
        rankName.innerText = translateRank(r.rank);
        rrText.innerText = `${r.ranking_in_tier} RR`;

        const change = r.mmr_change;

        if (change > 20) {
            glowContainer.classList.add("on-fire");
            const dynColors = getRankColors(r.rank, r.ranking_in_tier);
            if (dynColors) {
                glowContainer.style.setProperty('--glow-color', dynColors.color);
                glowContainer.style.setProperty('--glow-alpha', dynColors.alpha);
                glowContainer.style.setProperty('--glow-color-bright', dynColors.bright);
            }
        } else {
            glowContainer.classList.remove("on-fire");
            glowContainer.style.removeProperty('--glow-color');
            glowContainer.style.removeProperty('--glow-alpha');
            glowContainer.style.removeProperty('--glow-color-bright');
        }

        if (change > 0) { mmrChange.innerText = `+${change}`; mmrChange.className = "mmr-change up"; }
        else if (change < 0) { mmrChange.innerText = `${change}`; mmrChange.className = "mmr-change down"; }
        else { mmrChange.innerText = `0`; mmrChange.className = "mmr-change even"; }

        if (progressParam === "true" || progressParam === "1") {
            progressContainer.style.display = "block";
            requestAnimationFrame(() => {
                progressBar.style.width = `${r.ranking_in_tier}%`;
            });
        }

        statusMsg.classList.add("hidden");
        container.classList.remove("hidden", "autohide-out");

        if (autohideParam === "true" || autohideParam === "1") {
            setTimeout(() => container.classList.add("autohide-out"), 10000);
        }
    }

    function renderKda(matchData) {
        if (!kdaParam || (kdaParam !== "true" && kdaParam !== "1")) return;

        const kda = matchData?.derived?.kda;
        if (kda) {
            kdaText.innerText = kda;
            kdaText.classList.remove("hidden");
            mmrChange.classList.add("with-kda");
            return;
        }

        const puuid = matchData?._puuid;
        if (!puuid || !matchData?.players?.all_players) return;
        const stats = matchData.players.all_players.find(p => p.puuid === puuid);
        if (stats) {
            kdaText.innerText = `${stats.stats.kills}/${stats.stats.deaths}/${stats.stats.assists}`;
            kdaText.classList.remove("hidden");
            mmrChange.classList.add("with-kda");
        }
    }

    const CACHE_KEY = `val_overlay_v3_${region}_${name}_${tag}`;
    const CACHE_MS = 300_000;

    const fetchStats = async () => {
        try {
            const cachedRank = sessionStorage.getItem(CACHE_KEY);
            const cachedMatch = sessionStorage.getItem(`${CACHE_KEY}_match`);
            const cacheTime = sessionStorage.getItem(`${CACHE_KEY}_time`);
            const wantsKda = kdaParam === "true" || kdaParam === "1";

            const isFresh = cachedRank && cacheTime && (Date.now() - parseInt(cacheTime) < CACHE_MS);

            if (isFresh && (!wantsKda || cachedMatch)) {
                renderData(JSON.parse(cachedRank));
                if (cachedMatch) renderKda(JSON.parse(cachedMatch));
                return;
            }

            const endpoint = wantsKda
                ? `/api/valorant/summary/${region}/${name}/${tag}`
                : `/api/valorant/rank/${region}/${name}/${tag}`;

            const response = await fetch(endpoint);
            const data = await response.json();

            if (data.status === 200) {
                const isSummary = Object.prototype.hasOwnProperty.call(data.data, 'account');
                const rankData = isSummary ? data.data.rank : data.data;

                if (!rankData) {
                    statusMsg.innerText = "Error: Unranked or no MMR data available.";
                    statusMsg.classList.remove("hidden");
                    container.classList.add("hidden");
                    return;
                }

                sessionStorage.setItem(CACHE_KEY, JSON.stringify(rankData));
                sessionStorage.setItem(`${CACHE_KEY}_time`, Date.now().toString());

                let matchForRender = null;
                if (data.data.match) {
                    sessionStorage.setItem(`${CACHE_KEY}_match`, JSON.stringify(data.data.match));
                    matchForRender = data.data.match;
                }

                renderData(rankData);
                if (matchForRender) renderKda(matchForRender);
            } else {
                statusMsg.innerText = `Error: ${data.message || 'Unknown error'}`;
                statusMsg.classList.remove("hidden");
                container.classList.add("hidden");
            }
        } catch (error) {
            console.error("Failed to fetch overlay stats:", error);
            statusMsg.innerText = "Error: Could not connect to API";
            statusMsg.classList.remove("hidden");
            container.classList.add("hidden");
        }
    };

    let intervalId = null;

    function startPolling() {
        if (intervalId) return;
        intervalId = setInterval(fetchStats, CACHE_MS);
    }

    function stopPolling() {
        if (intervalId) { clearInterval(intervalId); intervalId = null; }
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopPolling();
        } else {
            fetchStats();
            startPolling();
        }
    });
    fetchStats();
    startPolling();
});

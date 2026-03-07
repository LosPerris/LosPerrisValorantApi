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

    if (layoutParam === "compact") {
        document.body.classList.add("layout-compact");
    }

    if (alignParam === "center") document.body.style.justifyContent = "center";
    else if (alignParam === "right") document.body.style.justifyContent = "flex-end";
    else if (alignParam === "left") document.body.style.justifyContent = "flex-start";

    if (scaleParam) {
        const scaleVal = parseFloat(scaleParam);
        if (!isNaN(scaleVal) && scaleVal > 0) {
            const wrapper = document.querySelector('.overlay-wrapper');
            if (wrapper) {
                wrapper.style.transform = `scale(${scaleVal})`;
                wrapper.style.transformOrigin = alignParam === 'right' ? 'right center' : alignParam === 'center' ? 'center center' : 'left center';
            }
        }
    }

    if (colorParam) {
        const isValidHex = /^[0-9A-F]{6}$/i.test(colorParam);
        if (isValidHex) {
            const hex = `#${colorParam}`;
            const r = parseInt(colorParam.slice(0, 2), 16);
            const g = parseInt(colorParam.slice(2, 4), 16);
            const b = parseInt(colorParam.slice(4, 6), 16);

            document.documentElement.style.setProperty('--val-red', hex);
            document.documentElement.style.setProperty('--val-red-glow', `rgba(${r}, ${g}, ${b}, 0.5)`);
            document.documentElement.style.setProperty('--loss-red', hex);
        }
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

    const rankTranslationsMap = {
        'Iron': 'Hierro',
        'Bronze': 'Bronce',
        'Silver': 'Plata',
        'Gold': 'Oro',
        'Platinum': 'Platino',
        'Diamond': 'Diamante',
        'Ascendant': 'Ascendente',
        'Immortal': 'Inmortal',
        'Radiant': 'Radiante'
    };

    function translateRank(rankStr) {
        if (lang !== 'es' || !rankStr) return rankStr;
        for (const [eng, esp] of Object.entries(rankTranslationsMap)) {
            if (rankStr.includes(eng)) {
                return rankStr.replace(eng, esp);
            }
        }
        return rankStr;
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

        // On Fire Logic (>20 points or winning streak)
        if (change > 20) {
            glowContainer.classList.add("on-fire");
        } else {
            glowContainer.classList.remove("on-fire");
        }

        if (change > 0) {
            mmrChange.innerText = `+${change}`;
            mmrChange.className = "mmr-change up";
        } else if (change < 0) {
            mmrChange.innerText = `${change}`;
            mmrChange.className = "mmr-change down";
        } else {
            mmrChange.innerText = `0`;
            mmrChange.className = "mmr-change even";
        }

        // RR Progress Bar Logica
        if (progressParam === "true" || progressParam === "1") {
            progressContainer.style.display = "block";
            setTimeout(() => {
                progressBar.style.width = `${r.ranking_in_tier}%`;
            }, 300);
        } else {
            progressContainer.style.display = "none";
        }

        if (twitchParam) {
            twitchName.innerText = twitchParam;
            twitchChannel.classList.remove("hidden");
        }

        if (hideRrParam === "true" || hideRrParam === "1") {
            const statsDiv = document.querySelector('.stats');
            if (statsDiv) {
                const divider = statsDiv.querySelector('.divider');
                if (divider) divider.style.display = 'none';
                rrText.style.display = 'none';
            }
        }

        if (hideMmrParam === "true" || hideMmrParam === "1") {
            const mmrSection = document.querySelector('.mmr-section');
            if (mmrSection) mmrSection.style.display = 'none';
        }

        // KDA Logic: overlay currently fetches /rank which lacks KDA, 
        // We will fetch KDA in fetchStats if needed and call renderKda
        // We ensure mmrChange has 'with-kda' class if KDA is displayed

        statusMsg.classList.add("hidden");
        container.classList.remove("hidden");
        container.classList.remove("autohide-out");

        if (autohideParam === "true" || autohideParam === "1") {
            setTimeout(() => {
                container.classList.add("autohide-out");
            }, 10000); // Esconde después de 10 segundos
        }
    }

    function renderKda(matchData, puuid) {
        if (!matchData || !kdaParam || kdaParam !== "true") return;
        const stats = matchData.players.all_players.find(p => p.puuid === puuid);
        if (stats) {
            kdaText.innerText = `${stats.stats.kills}/${stats.stats.deaths}/${stats.stats.assists}`;
            kdaText.classList.remove("hidden");
            mmrChange.classList.add("with-kda");
        }
    }

    const fetchStats = async () => {
        try {
            const cacheKey = `val_rank_v2_${region}_${name}_${tag}`;
            const cachedData = sessionStorage.getItem(cacheKey);
            const cachedMatch = sessionStorage.getItem(`${cacheKey}_match`);
            const cacheTime = sessionStorage.getItem(`${cacheKey}_time`);

            if (cachedData && cacheTime && (Date.now() - parseInt(cacheTime) < 300000)) {
                const wantsKda = kdaParam === "true" || kdaParam === "1";
                if (wantsKda && !cachedMatch) {
                } else {
                    renderData(JSON.parse(cachedData));
                    if (cachedMatch) renderKda(JSON.parse(cachedMatch), JSON.parse(cachedData).puuid);
                    return;
                }
            }

            let endpoint = `/api/valorant/rank/${region}/${name}/${tag}`;
            if (kdaParam === "true" || kdaParam === "1") {
                endpoint = `/api/valorant/summary/${region}/${name}/${tag}`;
            }

            const response = await fetch(endpoint);
            const data = await response.json();

            if (data.status === 200) {
                const isSummary = data.data.hasOwnProperty('account');
                const rankData = isSummary ? data.data.rank : data.data;

                if (!rankData) {
                    statusMsg.innerText = "Error: Unranked or no MMR data available.";
                    statusMsg.classList.remove("hidden");
                    container.classList.add("hidden");
                    return;
                }

                sessionStorage.setItem(cacheKey, JSON.stringify(rankData));

                if (data.data.match) {
                    sessionStorage.setItem(`${cacheKey}_match`, JSON.stringify(data.data.match));
                }

                sessionStorage.setItem(`${cacheKey}_time`, Date.now().toString());

                renderData(rankData);
                if (data.data.match) {
                    renderKda(data.data.match, rankData.puuid);
                }
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

    fetchStats();

    setInterval(fetchStats, 300000);
});

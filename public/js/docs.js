const updateUrls = () => {
    const rankUrl = document.getElementById('url-rank');
    const matchUrl = document.getElementById('url-match');
    const statusUrl = document.getElementById('url-status');

    if (rankUrl) rankUrl.textContent = `${CONFIG.siteUrl}/api/valorant/rank/:region/:name/:tag`;
    if (matchUrl) matchUrl.textContent = `${CONFIG.siteUrl}/api/valorant/match/last/:region/:name/:tag`;
    if (statusUrl) statusUrl.textContent = `${CONFIG.siteUrl}/api/valorant/status`;

    const historyUrl = document.getElementById('url-history');
    const summaryUrl = document.getElementById('url-summary');
    if (historyUrl) historyUrl.textContent = `${CONFIG.siteUrl}/api/valorant/history/:region/:name/:tag`;
    if (summaryUrl) summaryUrl.textContent = `${CONFIG.siteUrl}/api/valorant/summary/:region/:name/:tag`;

    const codeBlocks = document.querySelectorAll('.pre-code');
    codeBlocks.forEach(block => {
        let content = block.innerHTML;
        content = content.replace(/https:\/\/losperris\.site/g, CONFIG.siteUrl);
        block.innerHTML = content;
    });
}
updateUrls();

function switchTab(endpoint, lang) {
    const tabs = document.querySelectorAll(`.code-tab[onclick*="'${endpoint}'"]`);
    const contents = document.querySelectorAll(`[id^="${endpoint}-"]`);
    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));
    const clickedTab = event.currentTarget || document.querySelector(`.code-tab[onclick*="'${endpoint}', '${lang}'"]`);
    if (clickedTab) clickedTab.classList.add('active');
    const content = document.getElementById(`${endpoint}-${lang}`);
    if (content) content.classList.add('active');
}

function selectTab(endpoint, type) {
    switchTab(endpoint, type);
    const responseEndpoint = endpoint + '-res';
    if (type === 'bots') {
        switchTab(responseEndpoint, 'text');
    } else {
        switchTab(responseEndpoint, 'json');
    }
}

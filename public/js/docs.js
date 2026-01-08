const updateUrls = () => {
    const rankUrl = document.getElementById('url-rank');
    const matchUrl = document.getElementById('url-match');
    if (rankUrl) rankUrl.textContent = `${CONFIG.siteUrl}/api/valorant/rank/:region/:name/:tag`;
    if (matchUrl) matchUrl.textContent = `${CONFIG.siteUrl}/api/valorant/match/last/:region/:name/:tag`;

    const summaryUrl = document.getElementById('url-summary');
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

document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.doc-section');

    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(item => item.classList.remove('active'));
                const activeItem = document.querySelector(`.nav-item[href="#${id}"]`);
                if (activeItem) activeItem.classList.add('active');
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const navLinks = document.querySelectorAll('.nav-item');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 900) {
                if (sidebar) sidebar.classList.remove('open');
                if (menuToggle) {
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-xmark');
                    }
                }
            }
        });
    });
});

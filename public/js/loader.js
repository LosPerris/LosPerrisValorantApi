/**
 * loader.js — Carga e inyecta componentes HTML de forma lazy (CSR estático)
 * Cada componente se carga en paralelo y se inyecta en su slot correspondiente.
 * Al terminar, dispara el evento 'componentsLoaded' para inicializar la lógica JS.
 */
(function () {
    const BASE = (typeof CONFIG !== 'undefined' ? CONFIG.apiBaseUrl : '') + '/components/';

    const slots = [
        { id: 'lang-slot', file: 'lang-selector.html' },
        { id: 'header-slot', file: 'header.html' },
        { id: 'search-slot', file: 'search-section.html' },
        { id: 'bot-slot', file: 'bot-config.html' },
        { id: 'overlay-slot', file: 'overlay-config.html' },
        { id: 'footer-slot', file: 'footer.html' },
    ];

    const fetches = slots.map(({ id, file }) =>
        fetch(BASE + file)
            .then(r => r.ok ? r.text() : Promise.reject(`Failed to load ${file}: ${r.status}`))
            .then(html => {
                const el = document.getElementById(id);
                if (el) el.innerHTML = html;
            })
            .catch(err => console.warn('[loader]', err))
    );

    Promise.all(fetches).then(() => {
        document.dispatchEvent(new Event('componentsLoaded'));
    });
})();

/**
 * loader.js — Carga componentes HTML de forma diferida (lazy)
 * - Eager: componentes siempre visibles → se cargan al inicio
 * - Deferred: bot-config y overlay-config → solo cuando hay resultados
 */
(function () {
    const BASE = (typeof CONFIG !== 'undefined' ? CONFIG.apiBaseUrl : '') + '/components/';

    function loadSlots(slots) {
        return Promise.all(
            slots.map(({ id, file }) =>
                fetch(BASE + file)
                    .then(r => r.ok ? r.text() : Promise.reject(`Failed: ${file} (${r.status})`))
                    .then(html => {
                        const el = document.getElementById(id);
                        if (el) el.innerHTML = html;
                    })
                    .catch(err => console.warn('[loader]', err))
            )
        );
    }

    // Componentes que siempre se necesitan al entrar a la página
    const eagerSlots = [
        { id: 'lang-slot', file: 'lang-selector.html' },
        { id: 'header-slot', file: 'header.html' },
        { id: 'search-slot', file: 'search-section.html' },
        { id: 'footer-slot', file: 'footer.html' },
    ];

    // Componentes que solo se necesitan cuando hay resultados
    const deferredSlots = [
        { id: 'bot-slot', file: 'bot-config.html' },
        { id: 'overlay-slot', file: 'overlay-config.html' },
    ];

    let deferredLoaded = false;

    // Carga pública diferida — llamar desde main.js al obtener resultados
    window.loadResultComponents = function () {
        if (deferredLoaded) return Promise.resolve();
        deferredLoaded = true;
        return loadSlots(deferredSlots);
    };

    // Iniciar carga eager y disparar el evento para inicializar el JS
    loadSlots(eagerSlots).then(() => {
        document.dispatchEvent(new Event('componentsLoaded'));
    });
})();

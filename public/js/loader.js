
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

    const eagerSlots = [
        { id: 'lang-slot', file: 'lang-selector.html' },
        { id: 'header-slot', file: 'header.html' },
        { id: 'search-slot', file: 'search-section.html' },
        { id: 'footer-slot', file: 'footer.html' },
    ];

    const deferredSlots = [
        { id: 'bot-slot', file: 'bot-config.html' },
        { id: 'overlay-slot', file: 'overlay-config.html' },
    ];

    let deferredLoaded = false;

    window.loadResultComponents = function () {
        if (deferredLoaded) return Promise.resolve(false);
        deferredLoaded = true;
        return loadSlots(deferredSlots).then(() => true);
    };

    loadSlots(eagerSlots).then(() => {
        document.dispatchEvent(new Event('componentsLoaded'));
    });
})();

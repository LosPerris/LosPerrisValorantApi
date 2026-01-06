const CONFIG = {
    domain: window.location.host,
    siteUrl: window.location.origin,

    get apiBaseUrl() {
        const path = window.location.pathname;
        if (path.startsWith('/api/valorant')) {
            return '/api/valorant';
        }
        return '';
    },

    contactEmail: 'contacto@losperris.site',
    authorUrl: 'https://www.instagram.com/ponss_jean/'
};

Object.freeze(CONFIG);

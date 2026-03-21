const CONFIG = {
    domain: window.location.host,
    siteUrl: window.location.origin,

    get apiBaseUrl() {
        return '/api/valorant';
    },

    contactEmail: 'contacto@losperris.dev',
    authorUrl: 'https://www.instagram.com/ponss_jean/'
};

Object.freeze(CONFIG);

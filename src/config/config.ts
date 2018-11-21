/**
 * Archivo de configuración.
 * @var Config
 * @type {any}
 */

const Config = {
    
    /**
     * Título.
     * @var TITLE
     * @type {string}
     */
    TITLE: 'Bike-App',
    /**
     * Url del web-service.
     * @var SERVICE_BASE
     * @type {string}
     */
    SERVICE_BASE: 'https://vast-escarpment-94757.herokuapp.com',
    /**
     * Url de servicios disponibles.
     * @var SERVICE_URL
     * @type {any}
     */
    SERVICE_URL: {
        BASE: '/',
        ADDBIKE: '/bike/add',
        FINDALLBIKES: '/bike/all',
        DELETEBIKES: '/bike/delete',
        UPDATEBIKE: '/bike/update'
    }

};

export {Config};
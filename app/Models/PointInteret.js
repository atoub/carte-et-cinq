import Marqueur from './Marqueur';
import {getProjFromLonLat} from './Util';

/**
 * Classe d'un point d'intérêt sur la carte.
 * Fait le: 2018/02/07
 * @author Jérémie Fortin
 */
class PointInteret {
    /**
     * Constructeur d'un point d'intérêt.
     * @param {number} p_longitude longitude de la position du point d'intérêt.
     * @param {number} p_latitude latitude de la position du point d'intérêt.
     * @constructor
     */
    constructor(p_longitude, p_latitude) {
        this.longitude = parseFloat(p_longitude);
        this.latitude = parseFloat(p_latitude);
    }

    /**
     * Calcule et retourne la position du point d'intérêt en projection Openlayers.
     * @returns {ol.proj} Projection de la position du point d'intérêt.
     */
    getCoordonnees() {
        return getProjFromLonLat(this.longitude, this.latitude);
    }

    /**
     * Retourne la longitude de la position du point d'intérêt.
     * @returns {number} longitude de la position du point d'intérêt.
     */
    getLon() {
        return this.longitude;
    }

    /**
     * Retourne la latitude de la position du point d'intérêt.
     * @returns {number} latitude de la position du point d'intérêt.
     */
    getLat() {
        return this.latitude;
    }

    /**
     * Créée et retourne un marqueur pour le point d'intérêt.
     * @returns {Marqueur} Marqueur pour le point d'intérêt.
     */
    getMarqueur() {
        return new Marqueur(this.getCoordonnees());
    }
}

export default PointInteret;

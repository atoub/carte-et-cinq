import PointInteret from './PointInteret';
import MarqueurAppel from './MarqueurAppel';

/**
 * Classe d'un appel d'urgence.
 * Fait le: 2018/02/06
 * @author Jérémie Fortin
 */
class Appel extends PointInteret {
    /**
     * Constructreur de la classe Appel.
     * @param {number} p_longitude longitude de la position de l'appel.
     * @param {number} p_latitude latitude de la position de l'appel.
     * @param {number} p_no numéro de l'appel.
     * @param {string} p_temps heure de l'appel.
     * @param {string} p_nature nature de l'appel.
     * @param {Camion[]} p_camions Liste des véhicules en route vers l'appel.
     * @constructor
     */
    constructor(p_longitude, p_latitude, p_no, p_temps, p_nature, p_camions) {
        super(p_longitude, p_latitude);
        this.no = p_no;
        this.temps = p_temps;
        this.camions = p_camions;
    }

    /**
     * Créée et retourne un marqueur spécifique pour un appel.
     * @returns {MarqueurAppel} Marqueur pour l'appel.
     */
    getMarqueur() {
        return new MarqueurAppel(this.getCoordonnees(), this.no);
    }
}

export default Appel;

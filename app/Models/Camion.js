import PointInteret from './PointInteret';
import MarqueurCamion from './../Models/MarqueurCamion';

/**
 * Classe d'un camion d'intervention.
 */
class Camion extends PointInteret {
    /**
     * Constructeur de la classe Camion.
     * @param {number} p_longitude longitude de la position du camion.
     * @param {number} p_latitude latitude de la position du camion.
     * @param {number} p_no numéro du camion.
     * @param {string} p_temps temps dans le camion.
     * @param {string} p_statut statut du camion.
     * @constructor
     */
    constructor(p_longitude, p_latitude, p_no, p_temps, p_statut) {
        super(p_longitude, p_latitude);
        this.no = p_no;
        this.temps = p_temps;
        this.statut = p_statut;

        this.marqueur = new MarqueurCamion(this.getCoordonnees(), this.no, this.statut);
    }

    /**
     * Retourne le marqueur spécifique pour le camion.
     * @returns {MarqueurCamion} Marqueur pour le camion.
     */
    getMarqueur() {
        return this.marqueur;
    }

    /**
    * Permet d'obtenir le numéro du camion.
    * @returns {number} Le numéro du camion.
    */
    getNumero() {
        return this.no;
    }

    /**
    * Permet d'obtenir le statut du camion.
    * @returns {string} Le statut du camion.
    */
    getStatut() {
        return this.statut;
    }

    /**
     * Update le camion avec les informations d'un autre camion.
     * @param {Camion} p_camion le camions avec les bonnes valeurs
     * @returns {void}
     */
    updateInformations(p_camion) {
        this.longitude = p_camion.longitude;
        this.latitude = p_camion.latitude;
        this.temps = p_camion.temps;
        this.statut = p_camion.statut;
    }
}

export default Camion;

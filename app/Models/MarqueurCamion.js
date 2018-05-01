import * as ol from 'openlayers';
import Marqueur from './Marqueur';
import {
    COULEUR_CONTOUR_CAMION_CASERNE, COULEUR_FOND_CAMION_CASERNE
    , COULEUR_CONTOUR_CAMION_EN_DIRECTION, COULEUR_CONTOUR_CAMION_SUR_LIEUX,
    COULEUR_FOND_CAMION_EN_DIRECTION, COULEUR_FOND_CAMION_SUR_LIEUX,
    GROSSEUR_AUTRE_CAMION,
} from './Const';

/**
 * Classe d'un marqueur de véhicule, identifiable par un style préférablement unique.
 * Fait le: 2018/02/07
 * @author Florent Delahaye
 * Ajout de l'image du marqueur.
 * Fait le: 2018/02/08
 * @author Jérémie Fortin
 * Ajout du changement des couleurs
 * Fait le: 14/03/2018
 * @author Thibaud Gueniffey
 */
class MarqueurCamion extends Marqueur {
    /**
     * Constructeur d'un marqueur d'appel.
     * @param {ol.proj} p_position projection Openlayers de la posiiton du marqueur.
     * @param {number} p_no numéro du camion auquel ce marqueur est lié.
     * @param {string} p_statut statut du camion
     */
    constructor(p_position, p_no, p_statut) {
        super(p_position, p_statut);
        this.no = p_no;
    }

    /**
     * Override de la fonction init() du parent pour redéfinir le style de ce type de marqueur.
     * @param {string} p_statut d
     * @returns {void}
     */
    init(p_statut) {
        let couleurFond;
        let couleurContour;

        if (p_statut == 'CASE') {
            couleurFond = COULEUR_FOND_CAMION_CASERNE;
            couleurContour = COULEUR_CONTOUR_CAMION_CASERNE;
        } else if (p_statut == 'ENDIR') {
            couleurFond = COULEUR_FOND_CAMION_EN_DIRECTION;
            couleurContour = COULEUR_CONTOUR_CAMION_EN_DIRECTION;
        } else {
            couleurFond = COULEUR_FOND_CAMION_SUR_LIEUX;
            couleurContour = COULEUR_CONTOUR_CAMION_SUR_LIEUX;
        }

        this.setStyle(new ol.style.Style({
            image: new ol
                .style
                .Circle({
                    stroke: new ol.style.Stroke({ color: couleurContour, width: 3 }),
                    radius: GROSSEUR_AUTRE_CAMION,
                    fill: new ol.style.Fill({ color: couleurFond }),
                }),
        }));
    }
}

export default MarqueurCamion;

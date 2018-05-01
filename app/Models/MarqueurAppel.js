import * as ol from 'openlayers';
import Marqueur from './Marqueur';
import { COULEUR_FOND_APPEL, COULEUR_CONTOUR_APPEL } from './Const';
/**
 * Classe d'un marqueur d'appel, identifiable par un style préférablement unique.
 * Fait le: 2018/02/06
 * @author Jérémie Fortin
 */
class MarqueurAppel extends Marqueur {
    /**
     * Constructeur d'un marqueur d'appel.
     * @param {ol.proj} p_position projection Openlayers de la posiiton du marqueur.
     * @param {number} p_no numéro de l'appel auquel ce marqueur est lié.
     * @constructor
     */
    constructor(p_position, p_no) {
        super(p_position);
        this.no = p_no;
    }

    /**
     * Override de la fonction init() du parent pour redéfinir le style de ce type de marqueur.
     * @returns {void}
     */
    init() {
        this.setStyle(new ol.style.Style({
            image: new ol.style.Circle({
                radius: 9,
                fill: new ol.style.Fill({
                    color: COULEUR_FOND_APPEL,
                }),
                stroke: new ol.style.Stroke({
                    color: COULEUR_CONTOUR_APPEL,
                    width: 3,
                }),
            }),
        }));
    }
}

export default MarqueurAppel;

import * as ol from 'openlayers';
import Marqueur from './Marqueur';
import imageStart from './../assets/images/depart.svg'; // Image du marqueur.
import imageRight from './../assets/images/droite.svg'; // Image du marqueur.
import imageEnd from './../assets/images/arrivee.svg'; // Image du marqueur.
import imageLeft from './../assets/images/gauche.svg'; // Image du marqueur.

/**
 * Classe d'un marqueur de Chemin, identifiable par un style préférablement unique en fonction du type (gauche / droite / debut / ...).
 * Fait le: 2018/02/06
 * @author Martin Drouet
 */
class MarqueurChemin extends Marqueur {
    /**
     * Constructeur d'un marqueur d'appel.
     * @param {ol.proj} p_position Projection Openlayers de la posiiton du marqueur.
     * @param {string} p_typeMarqueur Type du marqueur (right, left, lright, lleft, forward, back, u, end, start, roundabout)
     * @constructor
     */
    constructor(p_position, p_typeMarqueur) {
        super(p_position);
        this.type = p_typeMarqueur;

        // Creation d'image
        const baliseImage = new Image();

        // Le src suivant le type
        switch (this.type) {
        case 'start' :
            baliseImage.src = imageStart;
            break;
        case 'left' :
            baliseImage.src = imageLeft;
            break;
        case 'right' :
            baliseImage.src = imageRight;
            break;
        case 'end' :
            baliseImage.src = imageEnd;
            break;
        default :
            baliseImage.src = imageStart;
            break;
        }

        // On met le style à jour
        this.setStyle(new ol.style.Style({
            image: new ol.style.Icon({
                imgSize: [750, 750],
                scale: 0.075,
                img: baliseImage,
            }),
        }));
    }
}

export default MarqueurChemin;

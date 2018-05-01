import * as ol from 'openlayers';
import { COULEUR_FOND_NOEUD_ROUTE, COULEUR_CONTOUR_NOEUD_ROUTE } from './Const';
/**
 * Classe d'un marqueur. Sert surtout à simplifier l'écriture sous cette forme,
 * mais d'autres classes en dériveront.
 * Fait le: 2018/02/06
 * @author Jérémie Fortin
 */
class Marqueur extends ol.Feature {
    /**
     * Constructeur d'un marqueur.
     * @param {ol.proj} p_position position du marqueur en position projetée Openlayers.
     * @param {string} p_statut Statut du camion
     * @constructor
     */
    constructor(p_position, p_statut) {
        super({ geometry: new ol.geom.Point(p_position) });
        this.init(p_statut);
    }

    /**
     * Initialisation des paramètres et options de base du marqueur,
     * ainsi que la définition du style du marqueur.
     * @returns {void}
     */
    init() {
        this.setStyle(new ol.style.Style({
            image: new ol.style.Circle({
                radius: 6,
                fill: new ol.style.Fill({
                    color: COULEUR_FOND_NOEUD_ROUTE,
                }),
                stroke: new ol.style.Stroke({
                    color: COULEUR_CONTOUR_NOEUD_ROUTE,
                    width: 3,
                }),
            }),
        }));
    }

    /**
     * Retourne la longitude de la position du marqueur.
     * @returns {number} longitude de la position du marqueur.
     */
    getLon() {
        return ol.proj.transform(this.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326')[0];
    }

    /**
     * Retourne la latitude de la position du marqueur.
     * @returns {number} latitude de la position du marqueur.
     */
    getLat() {
        return ol.proj.transform(this.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326')[1];
    }

    /**
     * Vérifie l'égalité entre un autre marqueur.
     * @param {Marqueur} p_marqueur Marqueur qui sera comparé.
     * @returns {boolean} Égalité est vrai ou non.
     */
    equals(p_marqueur) {
        let equal = true;
        equal = equal && this.getId() == p_marqueur.getId();
        equal = equal && this.getGeometry().toString() == p_marqueur.getGeometry().toString();
        equal = equal && this.getGeometryName() == p_marqueur.getGeometryName();
        equal = equal && this.getKeys().toString() == p_marqueur.getKeys().toString();
        equal = equal && this.getStyle().toString() == p_marqueur.getStyle().toString();
        equal = equal && this.getLat() == p_marqueur.getLat();
        equal = equal && this.getLon() == p_marqueur.getLon();
        return equal = equal && this.getProperties().toString() == p_marqueur.getProperties().toString();
    }
}

export default Marqueur;

import * as ol from 'openlayers';
import Carte from './Carte';
import { getProjFromLonLat, setLabelMsg, afficherZoom } from './Util';
import Route from './Route';

let _instance = null;

/**
 * Contient les fonctionnalités attribué à la carte.
 * @author Étienne G-Clermont
 * Modifications aux fonctions de zoom et centrage.
 * Fait le: 2018-02-04
 * @author Jérémie Fortin
 */
class MapAnim {
    /**
    * @desc Constructeur de MapAnim.
    * @constructor
    */
    constructor() {
        if (!_instance) {
            _instance = this;
        } else {
            return _instance;
        }

        return _instance;
    }

    /**
     * Fonction qui centre la carte vers une position avec un zoom précis.
     * @author Louis Lesage, Philippe Ross
     * @param {ol.proj} p_position Position du point.
     * @param {double} p_zoom Zoom.
     * @returns {void}
     */
    centrer(p_position, p_zoom) {
        Carte.changerEtatInteractions(false);
        Carte.getView().animate({
            center: p_position,
            duration: 500,
            zoom: p_zoom,
        }, function () {
            if (!Carte.getTurnByTurn()) {
                Carte.changerEtatInteractions(true);
            }
        });
    }

    /**
    * Permet de zoomer (avec animation) sur un lieu.
    * Modification paramètre: 2018-02-14
    * @author Étienne G-Clermont
    * @returns {void}
    */
    zoomer() {
        const zoom = Carte.getView().getZoom();
        const forceZoom = 2; // Force du zoom.
        const vitesseZoom = 300; // Vitesse de l'animation du zoom.

        // S'assure qu'on ne zoom pas lorsque le zoom est trop grand
        if (zoom >= 20) {
            return;
        }

        Carte.getView().animate({
            duration: 500,
        });

        Carte.getView().animate({
            zoom: zoom + forceZoom,
            duration: vitesseZoom,
        });
    }

    /**
     * Permet zoomer en mode tour-par-tour
     * @author Steve Morin
     * @returns {void}
     */
    zoomInTBT() {
        let zoom = Carte.getZoomTBT();

        if (zoom < 18) {
            Carte.setZoomTbT(++zoom);
        }

        afficherZoom(Carte.getZoomTBT());
    }

    /**
     * Permet de dézoomer en mode tour-par-tour
     * @author Steve Morin
     * @returns {void}
     */
    zoomOutTBT() {
        let zoom = Carte.getZoomTBT();

        if (zoom > 15) {
            Carte.setZoomTbT(--zoom);
        }

        afficherZoom(Carte.getZoomTBT());
    }

    /**
    * Permet de zoomer (avec animation) sur un lieu.
    * Modification paramètre: 2018-02-14
    * @author Étienne G-Clermont
    * @returns {void}
    */
    dezoomer() {
        const zoom = Carte.getView().getZoom();
        const forceZoom = 2; // Force du zoom.
        const vitesseZoom = 300; // Vitesse de l'animation du zoom.

        // S'assure qu'on ne dézoom pas lorsque le zoom est trop petit
        if (zoom <= 2) {
            return;
        }

        Carte.getView().animate({
            duration: 500,
        });

        Carte.getView().animate({
            zoom: zoom - forceZoom,
            duration: vitesseZoom,
        });
    }

    /**
     * Fonction qui zoom pour voir l'ensemble des camions et appels en parametre.
     * @author Louis Lesage, Philippe Ross
     * @param {Camion[]} p_camions Liste de camions.
     * @param {Appel[]} p_appels Liste d'appels.
     * @returns {void}
     */
    zoomGlobal() {
        const camions = Carte.getCamions();
        const appels = Carte.getAppels();
        let minLat = 90;
        let maxLat = -90;
        let minLon = 180;
        let maxLon = -180;

        for (const camion in camions) {
            if (camions[camion]) {
                const lat = camions[camion].getLat();
                const lon = camions[camion].getLon();

                if (minLat > lat) {
                    minLat = lat;
                }

                if (maxLat < lat) {
                    maxLat = lat;
                }

                if (minLon > lon) {
                    minLon = lon;
                }
                if (maxLon < lon) {
                    maxLon = lon;
                }
            }
        }

        for (const appel in appels) {
            if (appels[appel]) {
                const lat = appels[appel].getLat();
                const lon = appels[appel].getLon();

                if (minLat > lat) {
                    minLat = lat;
                }

                if (maxLat < lat) {
                    maxLat = lat;
                }

                if (minLon > lon) {
                    minLon = lon;
                }

                if (maxLon < lon) {
                    maxLon = lon;
                }
            }
        }

        const destLoc = getProjFromLonLat(maxLon, maxLat);
        const currentLoc = getProjFromLonLat(minLon, minLat);
        const ext = ol.extent.boundingExtent([destLoc, currentLoc]);

        setLabelMsg('Affichage de tous les points d\'intérêt.');
        Carte.getView().fit(ext, { duration: 500 });
    }

    /**
     * Fonction qui cadre sur la route.
     * @author Steve Morin
     * @returns {void}
     */
    cadrerLaRoute() {
        const ulLon = Carte.getMonCamion().getLon();
        const ulLat = Carte.getMonCamion().getLat();
        const lrLon = Route.boundingBox.lr.lng;
        const lrLat = Route.boundingBox.lr.lat;
        const limiteSuperieure = getProjFromLonLat(ulLon, ulLat);
        const limiteInferieure = getProjFromLonLat(lrLon, lrLat);
        const ext = ol.extent.boundingExtent([limiteSuperieure, limiteInferieure]);

        setLabelMsg('Cadrage sur la route.');
        Carte.getView().fit(ext, { duration: 500 });
    }

    /**
     * Fonction qui centre la carte sur la position de notre camion.
     * @param {number} p_zoom La force du zoom par défaut 17 si non spécifié.
     * @returns {void}
     */
    centrerSurMonCamion() {
        if (Carte.getMonCamion() != null) {
            Carte.changerEtatInteractions(false);
            Carte.getView().animate({
                center: Carte.getMonCamion().getCoordonnees(),
                duration: 500,
                zoom: Carte.getZoomTBT(),
            }, function () {
                if (!Carte.getTurnByTurn()) {
                    Carte.changerEtatInteractions(true);
                }
            });
        }
    }

    /**
     * Fonction qui rotate la carte vers l'angle passé en paramètre.
     * @param {number} p_angle L'angle vers lequel tourné.
     * @returns {void}
     */
    setAngleRotation(p_angle) {
        Carte.getView().animate({ rotation: p_angle });
    }
}

export default new MapAnim;


import * as ol from 'openlayers';
import Route from './../Models/Route';
import MapAnim from './MapAnim';
import {
    getCookie, getCoordDeLonLat, angleEntrePoints,
    setLabelCamion, setLabelCoord, setLabelMsg, afficherPopup,
    getProjFromLonLat,
} from './Util';
import {
    COULEUR_CONTOUR_MON_CAMION, COULEUR_CONTOUR_CAMION_CASERNE,
    COULEUR_FOND_MON_CAMION, COULEUR_CONTOUR_CAMION_EN_DIRECTION_FEU,
    COULEUR_FOND_CAMION_EN_DIRECTION_APPEL, GROSSEUR_MARQUEUR_MON_CAMION,
    GROSSEUR_AUTRE_CAMION, GROSSEUR_CAMION_VERS_APPEL, ZOOM_MAX_CARTE,
    COULEUR_FOND_CAMION_CASERNE, ZOOM_MIN_CARTE,
} from './Const';
import MarqueurCamion from '../Models/MarqueurCamion';
import MarqueurChemin from '../Models/MarqueurChemin';
import MarqueurAppel from '../Models/MarqueurAppel';
import $ from 'jquery';

let _instance = null; // Instance de Carte

/**
 * Contient les fonctionnalités attribué à la carte.
 */
class Carte {
    /**
    * @desc Constructeur de Carte.
    * @constructor
    */
    constructor() {
        if (!_instance) {
            _instance = this;
        } else {
            return _instance;
        }

        this.niveauZoom = 17;
        this.monMarqueur = null;
        this.positionActuelle = [];
        this.positionPrecedente = [];
        this.appels = [];
        this.zoomTrackingDepart = true;
        this.camions = [];
        this.turnByTurn = false;
        this.cible = null;
        this.marqueursFocus = [];

        /** @var numeroCamion Numéro de mon camion */
        this.numeroCamion = parseInt(getCookie('numeroCamion'));

        /** @var carte L'objet CarteOL */
        this.carte = new ol.Map({
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM(),
                }),
            ],
            controls: ol.control.defaults({
                attribution: false,
                zoom: false,
                rotate: false,
            }),
            view: new ol.View({
                center: getCoordDeLonLat(-72.227234, 47.038393),
                zoom: 8,
                minZoom: ZOOM_MIN_CARTE,
                maxZoom: ZOOM_MAX_CARTE,
            }),
            preload: Infinity,
            loadTilesWhileInteracting: true,
            loadTilesWhileAnimating: true,
        });

        return _instance;
    }

    /**
    * Permet de changer l'état des interactions (true ou false).
    * @param {boolean} p_etatInteractions L'état des interactions.
    * @returns {void}
    */
    changerEtatInteractions(p_etatInteractions) {
        this.carte.getInteractions().getArray().forEach(function (interaction) {
            interaction.setActive(p_etatInteractions);
        });

        this.interactionsActif = p_etatInteractions;
    }

    /**
    * Getter du numéro de camion.
    * @returns {number} Le numéro de camion.
    */
    getNoCamion() {
        return this.numeroCamion;
    }

    /**
    * Getter la view de la carte.
    * @returns {ol.View} La view.
    */
    getView() {
        return this.carte.getView();
    }

    /**
    * Getter de la carte.
    * @returns {ol.Map} La carte.
    */
    getCarte() {
        return this.carte;
    }

    /**
    * Getter de la position actuelle.
    * @returns {Array<number,number>} La position actuelle.
    */
    getPositionActuelle() {
        return this.positionActuelle;
    }

    /**
    * Setter de camions.
    * @param {Camion[]} p_camions Camions que l'ont souhaite ajouter.
    * @returns {void}
    */
    setCamions(p_camions) {
        this.camions = p_camions;

        if (this.getMonCamion()) {
            const positionCamion = [this.getMonCamion().getLon(), this.getMonCamion().getLat()];
            const dernierePosition = this.positionActuelle;
            this.positionActuelle = positionCamion;
            this.positionPrecedente = dernierePosition;

            // dans le cas où la position actuelle n'a jamais été initialisée
            if (this.positionPrecedente.length == 0) {
                this.positionPrecedente = positionCamion;
            }

            Route.miseAJourIndicesEtCoordonnees(this.positionActuelle, this.positionPrecedente);

            if (this.turnByTurn) {
                MapAnim.centrerSurMonCamion();
                MapAnim.setAngleRotation(angleEntrePoints(this.positionPrecedente, this.positionActuelle));
            }
        }
    }

    /**
    * Getter de la liste des camions.
    * @returns {Camion[]} La liste des camions.
    */
    getCamions() {
        return this.camions;
    }

    /**
    * Getter de notre camion.
    * @returns {number} Le numéro du camion.
    */
    getMonCamion() {
        const self = this;
        return this.camions.find(function (camion) {
            return camion.getNumero() == self.numeroCamion;
        });
    }

    /**
    * Setter de notre marqueur.
    * @param {Marqueur} p_marqueur Le marqueur.
    * @returns {void}
    */
    setMarqueur(p_marqueur) {
        this.monMarqueur = p_marqueur;
    }

    /**
    * Getter de notre marqueur.
    * @returns {Marqueur} Notre marqueur.
    */
    getMonMarqueur() {
        return this.monMarqueur;
    }

    /**
    * Setter de la liste des appels.
    * @param {Appel[]} p_appels Liste des appels.
    * @returns {void}
    */
    setAppels(p_appels) {
        this.appels = p_appels;
    }

    /**
    * Getter des appels.
    * @returns {Appel[]} Liste des appels.
    */
    getAppels() {
        return this.appels;
    }

    /**
     * @desc Met à jour le zoom du turn by turn.
     * @param {number} p_niveauZoom Niveau du zoom.
     * @return {void}
     */
    setZoomTbT(p_niveauZoom) {
        this.niveauZoom = p_niveauZoom;
    }

    /**
     * Permet de changer l'état de la connexion.
     * @param {string} p_etat L'état de la connexion.
     * @returns {void}
     */
    setConnexion(p_etat) {
        if (p_etat == 'On') {
            return true;
        }

        return false;
    }

    /**
     * Donne les valeurs de centre et rotation.
     * @param {Camion} p_camion Le camion à modifier dans la carte.
     * @param {Number} p_positionActuelle L'indice de la position actuelle.
     * @return {*} Donnée centre et rotation.
     */
    miseAJourDonneVueCarte(p_camion, p_positionActuelle) {
        // On recentre la carte.
        const centreVue = ol.proj.transform([p_camion.getLon(), p_camion.getLat()], 'EPSG:4326', 'EPSG:3857');

        let rotationVue = 0;
        const pointSuivant = p_positionActuelle + 1;

        if (pointSuivant < Route.forme.length && pointSuivant >= 0 && !isNaN(pointSuivant)) {
            rotationVue = angleEntrePoints([p_camion.getLon(), p_camion.getLat()], Route.forme[Route.indexRendu]);
        }

        return { centre: centreVue, rotation: rotationVue };
    }

    /**
    * @desc Met à jour le turn by turn.
    * @param {Boolean} p_actif True/false si le mode turn by turn est activé.
    * @return {void}
    */
    setTurnByTurn(p_actif) {
        this.turnByTurn = p_actif;
    }

    /**
    * Getter du boolean si le mode est activé.
    * @returns {Boolean} True/false si le mode turn by turn est activé.
    */
    getTurnByTurn() {
        return this.turnByTurn;
    }

    /**
    * Getter du niveau du zoom.
    * @returns {number} Le niveau du zoom.
    */
    getZoomTBT() {
        return this.niveauZoom;
    }

    /**
   * Fonction qui définit plusieurs listener sur des events par rapport au suivi.
   * @returns {void}
   */
    initialiserEcouteEvenement() {
        const self = this;

        const retirerClassSuivi = function () {
            self.desactiverSuivi();
            $('#btnCentrer').removeClass('btnTrackingActif btnTrackingAutre');
        };
        // Désactive le Suivi lorsqu'on drag la map.
        this.carte.on('pointerdrag', retirerClassSuivi);
        // Réactive le bouton centrage lorsqu'on scroll avec la souris
        this.carte.on('wheel', retirerClassSuivi);
        // Réactive le bouton centrage lorsqu'on double clique
        this.carte.on('dblclick', retirerClassSuivi);

        // Permet de cliquer sur un marqueur, centrant sur le marqueur et activant le suivi.
        this.carte.on('singleclick', function (evt) {
            const featureMarqueur = self.carte.forEachFeatureAtPixel(evt.pixel, function (feature) {
                return feature;
            });

            self.gererClicFeature(featureMarqueur);
        });
    }

    /**
     * Fonction qui gère les click sur les feature.
     * Soit il clic sur la route et ça zoom sur l'entièreté de la route
     * Soit il clic sur un marqueur et ça track le marqueur.
     * @param {ol.feature} p_featureMarqueur le marqueur cliqué.
     * @returns {void}
     */
    gererClicFeature(p_featureMarqueur) {
        if (p_featureMarqueur != null) {
            if (p_featureMarqueur instanceof MarqueurChemin || p_featureMarqueur.getProperties().name == 'Route') {
                this.desactiverSuivi();
                const lr = getProjFromLonLat(Route.boundingBox.lr.lng, Route.boundingBox.lr.lat);
                const ul = getProjFromLonLat(Route.boundingBox.ul.lng, Route.boundingBox.ul.lat);
                const ext = ol.extent.boundingExtent([lr, ul]);
                const texte = 'Affichage de la route';
                this.getView().fit(ext, { duration: 1000 });
                setLabelMsg(texte);
                afficherPopup(texte, 1000);
            } else if (p_featureMarqueur instanceof MarqueurCamion) {
                $('#btnCentrer').removeClass('btnTrackingActif btnTrackingAutre');

                if (p_featureMarqueur != this.getMonMarqueur()) {
                    $('#btnCentrer').addClass('btnTrackingAutre');
                } else {
                    $('#btnCentrer').addClass('btnTrackingActif');
                }

                this.setSuivi(p_featureMarqueur);
            } else if (p_featureMarqueur instanceof MarqueurAppel) {
                this.defocusCamionDirectionAppel();

                if (p_featureMarqueur != this.marqueurAppelFocus) {
                    const numerosCamionsAppel = this.appels.find(appel => appel.no == p_featureMarqueur.no).camions;
                    this.marqueurAppelFocus = p_featureMarqueur;
                    this.focusCamionDirectionAppel(numerosCamionsAppel, p_featureMarqueur.no);
                } else {
                    this.marqueurAppelFocus = null;
                }
            }
        }
    }

    /**
     * Fonction qui focus sur les camions en direction d'un appel
     * @returns {void}
     */
    defocusCamionDirectionAppel() {
        for (const i in this.marqueursFocus) {
            if (this.marqueursFocus[i]) {
                if (this.marqueursFocus[i].no == this.getNoCamion()) {
                    this.marqueursFocus[i].setStyle(new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: GROSSEUR_MARQUEUR_MON_CAMION,
                            fill: new ol.style.Fill({
                                color: COULEUR_FOND_MON_CAMION,
                            }),
                            stroke: new ol.style.Stroke({
                                color: COULEUR_CONTOUR_MON_CAMION,
                                width: 3,
                            }),
                        }),
                    }));
                } else {
                    this.marqueursFocus[i].setStyle(new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: GROSSEUR_AUTRE_CAMION,
                            fill: new ol.style.Fill({
                                color: COULEUR_FOND_CAMION_CASERNE,
                            }),
                            stroke: new ol.style.Stroke({
                                color: COULEUR_CONTOUR_CAMION_CASERNE,
                                width: 3,
                            }),
                        }),
                    }));
                }
            }
        }
    }

    /**
     * Fonction qui focus sur les camions en direction d'un appel
     * @param {number[]} p_numeros array du numéro des camions en direction de cet appel
     * @param {number} p_numeroAppel le numero de l'appel pour le message
     * @returns {void}
     */
    focusCamionDirectionAppel(p_numeros, p_numeroAppel) {
        this.marqueursFocus = [];
        let compteurCamion = 0;

        for (const i in p_numeros) {
            if (p_numeros[i]) {
                const camion = this.camions.find(c => c.getNumero() == p_numeros[i]);

                if (camion) {
                    compteurCamion++;
                    camion.getMarqueur().setStyle(new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: GROSSEUR_CAMION_VERS_APPEL,
                            fill: new ol.style.Fill({
                                color: COULEUR_FOND_CAMION_EN_DIRECTION_APPEL,
                            }),
                            stroke: new ol.style.Stroke({
                                color: COULEUR_CONTOUR_CAMION_EN_DIRECTION_FEU,
                                width: 3,
                            }),
                        }),
                    }));

                    this.marqueursFocus.push(camion.getMarqueur());
                }
            }
        }

        afficherPopup(compteurCamion + ' camions en direction de l\'appel ' + p_numeroAppel, 1000);
    }


    /**
     * Fonction permettant d'activer / désactiver le Suivi
     * Ajout du suivi du marqueur par la carte.
     * @param {ol.feature} p_cible Cible à suivre.
     * @returns {void}
     */
    setSuivi(p_cible) {
        this.desactiverSuivi();
        this.cible = p_cible;
        if (this.cible != null) {
            setLabelMsg('Début du suivi ' + (this.cible instanceof MarqueurCamion ? 'du camion ' : 'de l\'appel ') + '#' + this.cible.no);
            setLabelCamion(this.cible.no);
            setLabelCoord(this.cible.getLon(), this.cible.getLat());

            this.suivreMarqueur();
            this.cible.on('change:geometry', this.suivreMarqueur.bind(this));
            this.zoomTrackingDepart = true;
        }
    }

    /**
     * Fonction qui désabonne et désactive le suivi de la cible.
     * @param {ol.feature} p_cible La cible à désabonner à l'évenement
     * @returns {void}
     */
    desactiverSuivi() {
        if (this.cible) {
            this.cible.un('change:geometry');
            setLabelCamion();
            setLabelCoord();
            setLabelMsg('Fin du suivi');
            this.cible = null;
            this.zoomTrackingDepart = false;
        }
    }

    /**
     * Fonction qui centre la carte vers le marqueur et qui update l'affichage
     * Elle est appelé à chaque fois que le marqueur est updaté
     * @returns {void}
     */
    suivreMarqueur() {
        if (this.cible) {
            const pos = this.cible.getGeometry().getCoordinates();

            setLabelCoord(this.cible.getLon(), this.cible.getLat());

            if (!this.getView().getAnimating()) {
                MapAnim.centrer(pos, this.zoomTrackingDepart ? 16 : this.getView().getZoom()); // Pas nécessairement notre camion.
                this.zoomTrackingDepart = false;
            }
        }
    }
}

export default new Carte;

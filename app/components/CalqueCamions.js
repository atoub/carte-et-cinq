import React from 'react';
import ParserXML from '../Models/ParserXML';
import Carte from './../Models/Carte';
import Route from '../Models/Route';
import * as ol from 'openlayers';
import Camion from './../Models/Camion';
import {
    COULEUR_CONTOUR_MON_CAMION,
    COULEUR_FOND_MON_CAMION,
    GROSSEUR_MARQUEUR_MON_CAMION,
    TEMPS_INTERVAL_CAMIONS,
} from '../Models/Const';
import { getCookie, setCookie, setLabelMsg, pointVersLosange, afficherPopup, calculDistanceCoordonnees, parseQuery } from '../Models/Util';
import lineIntersect from '@turf/line-intersect';
import lineString from 'turf-linestring';


/**
* Calque qui gère les camions
* @author Louis Lesage
*/
class CalqueCamions extends React.Component {
    /**
    * @desc Constructeur de CalqueCamions.
    * @constructor
    * @param {*} props Attributs html.
    */
    constructor(props) {
        super(props);

        this.state = {
            camions: [], // Liste des camions
            visible: true, // Si les camions sont visibles
            narratifActuel: 'Aucun appel en cours',
            narratifsSuivants: [],
            narratifComplet: [],
        };

        this.layerCamions = new ol.layer.Vector({ // Le layer de open layer des camions
            map: null,
            source: null,
            updateWhileInteracting: true,
            updateWhileAnimating: true,
        });

        this.sourceCamion = new ol.source.Vector({ // Le vecteur de source des feature ou 'marqueurs'
            features: null,
        });

        this.camionRoute = null;

        this.idInterval = null;
    }

    /**
     * Fonction qui change le state visible du calque.
     * @returns {void}
     */
    toggleVisible() {
        const texte = (this.state.visible ? 'Désactivation' : 'Activation') + ' de la couche : camions';
        setLabelMsg(texte);
        afficherPopup(texte, 1000);
        setCookie('Camions', !this.state.visible);
        this.setState({ visible: !this.state.visible });
    }

    /**
     * Fonction qui update les marqueurs de camions
     * en prenant en compte si il faut les cacher ou les afficher.
     * @returns {void}
     */
    updateCamionMarqueur() {
        this.layerCamions.setVisible(this.state.visible);
        const self = this;
        for (const camion in Carte.camions) {
            if (Carte.camions[camion] instanceof Camion && Carte.camions[camion].getStatut() != 'IND') {
                const marqueur = self.sourceCamion.getFeatures().find(function (poi) {
                    return Carte.camions[camion].no === poi.no;
                });

                if (marqueur) {
                    marqueur.setGeometry(new ol.geom.Point(Carte.camions[camion].getCoordonnees()));
                } else {
                    const marqueurCourant = Carte.camions[camion].getMarqueur();

                    if (marqueurCourant.no == Carte.numeroCamion) {
                        marqueurCourant.setStyle(new ol.style.Style({
                            image: new ol.style.Circle({
                                stroke: new ol.style.Stroke({
                                    color: COULEUR_CONTOUR_MON_CAMION,
                                    width: 3,
                                }),
                                radius: GROSSEUR_MARQUEUR_MON_CAMION,
                                fill: new ol.style.Fill({
                                    color: COULEUR_FOND_MON_CAMION,
                                }),
                            }),
                        }));
                    }

                    self.sourceCamion.addFeature(marqueurCourant);
                }
            }
        }

        self.sourceCamion.getFeatures().forEach(function (poi) {
            if (poi instanceof ol.Feature) {
                const existe = Carte.camions.find(function (e) {
                    if (e.getStatut() == 'IND') {
                        return false;
                    } else {
                        return poi.no === e.no;
                    }
                });

                if (!existe) {
                    self.sourceCamion.removeFeature(poi);
                }
            }
        });
    }

    /**
     * Permet d'obtenir le camion courant ou actuel
     * @returns {Camion} Le camion courant.
     */
    obtenirCamionCourant() {
        for (const camion in this.state.camions) {
            if (this.state.camions[camion].getNumero() == Carte.getNoCamion() && this.state.camions[camion].getStatut() != 'IND') {
                return this.state.camions[camion];
            }
        }
    }

    /**
     * Fonction permettant de récupérer le marqueur du camion de l'utilisateur.
     * Fait le: 2018/02/15
     * @returns {ol.feature} Marqueur du camion de l'utilisateur.
     */
    obtenirMarqueurCourant() {
        let marqueur;
        this.sourceCamion.forEachFeature(function (m) {
            if (m.no == Carte.getNoCamion()) {
                marqueur = m;
                return;
            }
        });
        return marqueur;
    }

    /**
     * Fonction React qui est appelé après le mounting du component.
     * Démarre les appels au serveurs xml pour les camions.
     * @returns {void}
     */
    componentDidMount() {
        const context = this;

        context.appelXML(true);

        this.idInterval = window.setInterval(function () {
            context.appelXML(false);
        }, TEMPS_INTERVAL_CAMIONS);

        context.layerCamions.setMap(Carte.carte);
        context.layerCamions.setSource(context.sourceCamion);

        // Vérifie dans les cookies si le calques 'Camions' existe et s'il est activé ou non (true ou false).
        if (getCookie('Camions') !== '') {
            this.setState({ visible: getCookie('Camions') });
        }
    }

    /**
    * Fonction qui appels le XML.
    * @param {boolean} p_notifierCalque True/false si calque est notifié.
    * @returns {void}
    */
    appelXML(p_notifierCalque) {
        const self = this;
        ParserXML.getCamions().then(function (p_listeCamions) {
            if (p_listeCamions != undefined) {
                //Les numéros de véhicules déjà existants
                const numeroCamionsExistant = [];

                for (const i in Carte.camions) {
                    if (Carte.camions[i] instanceof Camion) {
                        numeroCamionsExistant.push(Carte.camions[i].getNumero());
                    }
                }

                //supprime les vieux camions qui ne sont plus dans le xml
                const listeCamion = [];

                for (const index in p_listeCamions) {
                    //Si le camion existe on update ses informations
                    if (numeroCamionsExistant.includes(p_listeCamions[index].getNumero())) {
                        const camion = Carte.camions.find(n => n.getNumero() == p_listeCamions[index].getNumero());
                        camion.updateInformations(p_listeCamions[index]);
                        listeCamion.push(camion);

                        const params = parseQuery(window.location.search);

                        if (camion.getNumero() == params.camionID) {
                            self.camionRoute = camion;
                        }
                        //Si il n'existe pas, on l'ajoute
                    } else {
                        listeCamion.push(p_listeCamions[index]);
                    }
                }

                Carte.setCamions(listeCamion);
                Carte.setMarqueur(self.obtenirMarqueurCourant());
                self.forceUpdate();

                if (p_notifierCalque) {
                    self.props.camionsPrets();
                }

                let estNouvelleRoute = false;

                // Calcule si le camion est encore sur la route
                // Si le camion n'est plus sur la route avec
                if (Route.forme.length != 0) {
                    const line1 = lineString(Route.forme);
                    const line2 = pointVersLosange([parseFloat(self.camionRoute.getLon()), parseFloat(self.camionRoute.getLat())], 0.0003);
                    const intersects = lineIntersect(line1, line2);

                    if (intersects.features.length == 0 && !self.props.estTrajetFini) {
                        self.props.updateRoute();
                        estNouvelleRoute = true;
                    }
                }

                if (!self.props.estTrajetFini) {
                    const param = {
                        distanceTotaleMapQuest: Route.distanceTotale,
                        distanceTotale: Route.calculerDistanceTotale(Route.forme, false),
                        proportionDistances: Route.distanceTotale / Route.calculerDistanceTotale(Route.forme, false),
                        distanceParcourue: calculDistanceCoordonnees(Route.positionActuelle, Route.positionPrecedente),
                        distanceNarration: Route.calculerDistanceTotale(Route.forme, true),
                        distanceParPoint: Route.getDistanceParPoint(),
                        estNouvelleRoute: estNouvelleRoute,
                    };
                    // Réglage de la directive actuelle
                    if (self.camionRoute && Route.forme.length != 0) {
                        self.props.obtenirMiseAJourInfobarre(Route.afficherEtapesSuivantes(
                            [self.camionRoute.getLon(), self.camionRoute.getLat()],
                            Route.forme, Route.directives, Route.narration), param);
                    }
                }
            }
        });
    }

    componentWillUnmount() {
        window.clearInterval(this.idInterval);
    }

    /**
     * Fonction de rendu.
     * @returns {string} Le html généré.
     */
    render() {
        this.updateCamionMarqueur();
        return (
            <div>
                {/* Couches camions */}
                <button className={this.state.visible ? 'active but but-CoucheCamions' : 'but but-CoucheCamions'} onClick={this.toggleVisible.bind(this)} />
            </div>
        );
    }
}

export default CalqueCamions;


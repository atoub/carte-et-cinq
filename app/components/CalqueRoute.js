import React from 'react';
import Route from '../Models/Route';
import $ from 'jquery';
import Carte from '../Models/Carte';
import * as ol from 'openlayers';
import Marqueur from '../Models/Marqueur';
import MarqueurChemin from '../Models/MarqueurChemin';
import { getCoordDeLonLat, parseQuery } from '../Models/Util';
import { COULEUR_ROUTE } from '../Models/Const';

/**
 * Couche comprenant les appels
 * @author Louis Lesage et Philippe Ross
 */
class CalqueRoute extends React.Component {
    /**
    * @desc Constructeur de CalqueRoute.
    * @constructor
    * @param {*} props Attributs html.
    */
    constructor(props) {
        super(props);

        this.state = {
            indicesDirectives: [],
            forme: [],
        };

        const fill1 = new ol.style.Fill({
            color: 'rgba(255,255,255,0.4)',
        });
        const stroke1 = new ol.style.Stroke({
            color: COULEUR_ROUTE,
            width: 7.5,
        });

        this.layerRoute = new ol.layer.Vector({
            map: null,
            source: null,
            style: [new ol.style.Style({
                stroke: stroke1,
                image: new ol.style.Circle({
                    fill: fill1,
                    stroke: stroke1,
                    radius: 5,
                }),
                fill: fill1,
            })],
            updateWhileInteracting: true,
            updateWhileAnimating: true,
        });

        this.sourceRoute = new ol.source.Vector({ // Le vecteur de source des feature ou 'marqueurs'
            features: null,
        });
    }

    updateRoute() {
        if (this.state.forme.length != 0) {
            this.redessinerRoute(this.state.forme, this.state.indicesDirectives);
        } else {
            this.getQueryRoute();
        }
    }

    /**
     * @desc Dessine l'itinéraire et met à jour les calques.
     * @param {Array.<number, number>} p_itineraire Array de coordonnées de l'itinéraire.
     * @param {number[]} p_pointsDirective Array de points de directive.
    * @return {void}
    */
    redessinerRoute(p_itineraire, p_pointsDirective) {
        this.sourceRoute.clear();
        this.layerRoute.getSource().clear();
        const latlngs = [];

        // Transforme les coordonnées pour la projection EPSG:3857
        for (let i = 0; i < p_itineraire.length; i += 1) {
            latlngs.push(ol.proj.transform([p_itineraire[i][0], p_itineraire[i][1]], 'EPSG:4326', 'EPSG:3857'));
        }

        const geo = new ol.geom.MultiLineString([latlngs]);
        const routeFeature = new ol.Feature({
            name: 'Route',
            geometry: geo,
            type: 'route',
        });

        this.sourceRoute.addFeature(routeFeature);
        const nbManeuvres = p_itineraire.length;

        // Boucle qui permet de dessiner les marqueurs sur la map à chaque changement de direction
        for (let i = 1; i < nbManeuvres - 1; i++) {
            if (p_pointsDirective !== undefined && p_pointsDirective.indexOf(i) > -1) {
                this.sourceRoute.addFeature(new Marqueur(getCoordDeLonLat(p_itineraire[i][0], p_itineraire[i][1])));
            }
        }

        this.sourceRoute.addFeature(new MarqueurChemin(getCoordDeLonLat(p_itineraire[0][0], p_itineraire[0][1]), 'start'));
        this.sourceRoute.addFeature(new MarqueurChemin(getCoordDeLonLat(p_itineraire[nbManeuvres - 1][0], p_itineraire[nbManeuvres - 1][1]), 'end'));
    }

    /**
     * Fonction qui démarre les appels au serveur XML.
     * @returns {void}
     */
    componentDidMount() {
        this.layerRoute.setMap(Carte.carte);
        this.layerRoute.setSource(this.sourceRoute);
    }

    /**
    * Fonction qui va chercher le query de notre route.
    * @returns {string} Le query de notre route.
    */
    getQueryRoute() {
        const self = this;

        const params = parseQuery(window.location.search);

        if (params.camionID && params.appelID) {
            // Active la route entre params.camionID et params.appelID
            const camion = Carte.getCamions().find(function (element) {
                return element.no == params.camionID;
            });
            const appel = Carte.getAppels().find(function (element) {
                return element.no == params.appelID;
            });

            if (camion && appel) {
                if (params.f == 'Route') {
                    Route.demanderNouveauTrajet(camion.getLat() + ', ' + camion.getLon(), appel.getLat() + ', ' + appel.getLon()).then(function (p_reponse) {
                        Route.obtenirFormeTrajet(p_reponse).then(function (p_data) {
                            self.setState(p_data);
                            // Si le trajet part de notre camion afficher le bouton TBT
                            if (Carte.getNoCamion() == camion.no) {
                                $('#divBtnTBT').removeClass('d-none');
                            }
                        });
                    });
                }
            }
        }
    }

    /**
     * Retourne le html du bouton pour afficher les appels ou les cacher et update l'affichage des appels.
     * @returns {void}
     */
    render() {
        this.updateRoute();

        return null;
    }
}

export default CalqueRoute;


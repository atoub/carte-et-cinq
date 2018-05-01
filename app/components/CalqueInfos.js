import React from 'react';
import * as ol from 'openlayers';
import Carte from '../Models/Carte';
import { getCookie, setCookie, setLabelMsg, computeQuadKey, afficherPopup } from './../Models/Util';
import { BING_KEY, BORNE_URL, BORNE_NAME } from '../Models/Env.js';

/**
* Classe qui gère les calques d'informations utile pour la map.
* @author Louis Lesage et Philippe Ross
*/
class CalqueInfos extends React.Component {
    /**
    * @desc Constructeur de CalqueInfos.
    * @constructor
    * @param {*} props Attributs html.
    */
    constructor(props) {
        super(props);

        // Les couches d'informations supplémentaires. Elles sont gérées sous forme d'array littéraire
        // pour permettre de l'extensions sans créer de nouvelles classes à chaque couches.
        this.state = {
            couches: [
                {
                    id: 'satellite',
                    tuile: new ol.layer.Tile({
                        preload: Infinity,
                        source: new ol.source.BingMaps({
                            maxZoom: 19,
                            key: BING_KEY,
                            imagerySet: 'AerialWithLabels',
                        }),
                    }),
                    visible: true,
                    bouton: <button onClick={() => setCookie('satellite', !this.state.couches[0].visible) & this.toggleVisible('satellite')}
                        className='but but-CoucheSatellite' />,
                },
                {
                    id: 'traffic',
                    tuile: new ol.layer.Tile({
                        source: new ol.source.XYZ({
                            maxZoom: 19,
                            tileUrlFunction(tileCoord) {
                                const z = tileCoord[0];
                                const x = tileCoord[1];
                                const y = -tileCoord[2] - 1;
                                return 'http://t0.tiles.virtualearth.net/tiles/t' + computeQuadKey(x, y, z) + '.png';
                            },
                        }),
                    }),
                    visible: true,
                    bouton: <button onClick={() => setCookie('traffic', !this.state.couches[1].visible) & this.toggleVisible('traffic')}
                        className='but but-CoucheInfosTraffic' />,
                },
                {
                    id: 'borne',
                    tuile: new ol.layer.Tile({
                        source: new ol.source.TileWMS({
                            url: BORNE_URL,
                            params: {'LAYERS': BORNE_NAME, 'TILED': true},
                            serverType: 'geoserver',
                            projection: 'EPSG:3857',
                        }),
                    }),
                    visible: false,
                    bouton: <button onClick={() => setCookie('borne', !this.state.couches[2].visible) & this.toggleVisible('borne')}
                        className='but but-CoucheInfosBorne' />,
                },
            ],
        };
    }

    /**
     * Fonction qui active ou désactive la visibilité d'une couche.
     * @param {string} p_id ID de la couche.
     * @returns {void}
     */
    toggleVisible(p_id) {
        const grille = this.state.couches.filter(couche => couche.id == p_id);
        grille[0].visible = !grille[0].visible;
        this.setState(this.state.couches);

        const texte = (grille[0].visible ? 'Activation' : 'Désactivation') + ' de la couche : ' + grille[0].id;
        setLabelMsg(texte);
        afficherPopup(texte, 1000);
    }

    /**
     * Fonction qui rafraîchit l'affichage de toutes les couches.
     * @return {void}
     */
    updateCouches() {
        for (const index in this.state.couches) {
            if (this.state.couches[index].visible) {
                Carte.carte.getLayers().remove(this.state.couches[index].tuile); // Retirer le layer pour pas en empiller plusieurs (erreur lancé par OpenLayers)
                Carte.carte.addLayer(this.state.couches[index].tuile);
            } else {
                Carte.carte.removeLayer(this.state.couches[index].tuile);
            }
        }
    }

    componentDidMount() {
        const self = this;

        // Vérifie dans les cookies si les calques d'infos existe et s'ils sont activés ou non (true ou false)
        for (const index in self.state.couches) {
            if (getCookie(self.state.couches[index].id) !== '') {
                self.state.couches[index].visible = getCookie(self.state.couches[index].id);
            }
        }

        self.setState(self.state.couches);
    }

    /**
     * Méthode qui rend les boutons de toutes les couches.
     * @returns {jsx[]} array d'elements JSX
     */
    renderBoutons() {
        const lesBoutons = [];

        for (const index in this.state.couches) {
            if (this.state.couches[index]) {
                let btn = this.state.couches[index].bouton;
                if (this.state.couches[index].visible) {
                    btn = React.cloneElement(btn, { className: btn.props.className + ' active' });
                }

                lesBoutons.push(React.cloneElement(<div key={index}></div>, null, btn));
            }
        }

        return lesBoutons;
    }

    /**
     * Méthode de render du component CalqueInfo
     * @returns {JSX} le html du component
     */
    render() {
        this.updateCouches();
        return this.renderBoutons();
    }
}

export default CalqueInfos;

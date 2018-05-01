import React from 'react';
import ParserXML from '../Models/ParserXML';
import Carte from './../Models/Carte';
import * as ol from 'openlayers';
import Appel from './../Models/Appel';
import { TEMPS_INTERVAL_APPELS } from '../Models/Const';
import { getCookie, setCookie, setLabelMsg, afficherPopup } from '../Models/Util';

/**
 * Couche comprenant les appels.
 * @author Louis Lesage et Philippe Ross
 */
class CalqueAppels extends React.Component {
    /**
    * @desc Constructeur de CalqueAppels.
    * @constructor
    * @param {*} props Attributs html.
    */
    constructor(props) {
        super(props);

        this.state = {
            appels: [],
            visible: true,
        };

        this.layerAppels = new ol.layer.Vector({
            map: null,
            source: null,
            updateWhileInteracting: true,
            updateWhileAnimating: true,
        });

        this.sourceAppel = new ol.source.Vector({
            features: null,
        });

        this.idInterval = null;
    }

    /**
     * Fonction qui change le state visible du calque.
     * @returns {void}
     */
    toggleVisible() {
        const texte = (!this.state.visible ? 'Activation' : 'Désactivation') + ' de la couche : appels';
        setLabelMsg(texte);
        afficherPopup(texte, 1000);
        setCookie('Appels', !this.state.visible);
        this.setState({ visible: !this.state.visible });
    }

    /**
     * Fonction qui rafraîchit les marqueurs d'appels
     * en prenant en compte si il faut les cacher ou les afficher.
     * @returns {void}
     */
    updateAppelMarqueur() {
        this.layerAppels.setVisible(this.state.visible);
        const self = this;
        for (const appel in self.state.appels) {
            if (self.state.appels[appel] instanceof Appel) {
                const marqueur = self.sourceAppel.getFeatures().find(function (poi) {
                    return self.state.appels[appel].no === poi.no;
                });

                if (marqueur) {
                    marqueur.setGeometry(new ol.geom.Point(self.state.appels[appel].getCoordonnees()));
                } else {
                    self.sourceAppel.addFeature(self.state.appels[appel].getMarqueur());
                }
            }
        }

        self.sourceAppel.getFeatures().forEach(function (poi) {
            if (poi instanceof ol.Feature) {
                const existe = self.state.appels.find(function (e) {
                    return poi.no === e.no;
                });

                if (!existe) {
                    self.sourceAppel.removeFeature(poi);
                }
            }
        });
    }

    /**
     * Fonction qui démarre les appels au serveur XML.
     * @returns {void}
     */
    componentDidMount() {
        const self = this;

        self.appelXML(true);

        this.idInterval = window.setInterval(function () {
            self.appelXML(false);
        }, TEMPS_INTERVAL_APPELS);

        this.layerAppels.setMap(Carte.carte);
        this.layerAppels.setSource(this.sourceAppel);

        // Vérifie dans les cookies si le calque 'Appels' existe et s'il est activé ou non (true ou false).
        if (getCookie('Appels') !== '') {
            this.setState({ visible: getCookie('Appels') });
        }
    }

    /**
    * Fonction qui appels le XML.
    * @param {boolean} p_notifierCalque True/false si calque est notifié.
    * @returns {void}
    */
    appelXML(p_notifierCalque) {
        const self = this;
        ParserXML.getAppels().then(function (p_listeAppels) {
            if (p_listeAppels != undefined) {
                Carte.setAppels(p_listeAppels);
                self.setState({ appels: p_listeAppels });
                if (p_notifierCalque) {
                    self.props.appelsPrets();
                }
            }
        });
    }

    componentWillUnmount() {
        window.clearInterval(this.idInterval);
    }

    /**
     * Retourne le html du bouton pour afficher les appels ou les cacher et update l'affichage des appels.
     * @returns {string} Le html généré.
     */
    render() {
        this.updateAppelMarqueur();
        return (
            <div>
                <button onClick={this.toggleVisible.bind(this)} className={this.state.visible ? 'active but but-CoucheAppels' : 'but but-CoucheAppels'} />
            </div>
        );
    }
}

export default CalqueAppels;


import React from 'react';
import CalqueAppels from './CalqueAppels';
import CalqueCamions from './CalqueCamions';
import CalqueInfos from './CalqueInfos';
import { parseQuery } from '../Models/Util';
import Carte from '../Models/Carte';
import MapAnim from './../Models/MapAnim';
import CalqueRoute from './CalqueRoute';
import Route from '../Models/Route';
import $ from 'jquery';

/**
 * Calque qui gère l'ensemble des calques.
 * @author Philippe Ross et Louis Lesage
 */
class Calques extends React.Component {
    /**
    * @desc Constructeur de Calques.
    * @constructor
    * @param {*} props Attributs html.
    */
    constructor(props) {
        super(props);
        this.camionsPrets = false;
        this.appelsPrets = false;
    }

    /**
     * Ouvre et ferme le menu des couches affichées.
     * @returns {void}
     */
    handleClick() {
        document.getElementById('collapseLayers').classList.toggle('hidden');

        if (!$('#collapseLayers').hasClass('hidden')) {
            const hide = function () {
                document.getElementById('collapseLayers').classList.add('hidden');
                Carte.getCarte().un('click');
            };

            Carte.getCarte().on('click', hide);
            Carte.getCarte().on('pointerdrag', hide);
        }
    }

    /**
     * Définie les camions.
     * @param {Camion[]} p_liste Liste des camions.
     * @returns {void}
     */
    setCamionsPret() {
        this.camionsPrets = true;

        if (this.appelsPrets) {
            this.executeQuery();
        }
    }

    /**
     * Définie les appels.
     * @param {Appel[]} p_liste Liste d'appels.
     * @returns {void}
     */
    setAppelsPret() {
        this.appelsPrets = true;

        if (this.camionsPrets) {
            this.executeQuery();
        }
    }

    /**
     * Execute l'action mentionné dans la query string.
     * @returns {void}
     */
    executeQuery() {
        const params = parseQuery(window.location.search);

        if (params.f == 'Zoom') {
            // Zoom sur un appel ou un camion
            let position;

            if (params.camionID) {
                position = Carte.getCamions().find(function (element) {
                    return element.no == params.camionID;
                });
            } else if (params.appelID) {
                position = Carte.getAppels().find(function (element) {
                    return element.no == params.appelID;
                });
            }
            if (position) {
                MapAnim.centrer(position.getCoordonnees(), 20);
            }
        } else {
            // Zoom de manière a voir tous les appels et camions
            MapAnim.zoomGlobal();
        }

        this.forceUpdate();
    }

    /**
     * Fonction passé au components CalqueCamions pour appelé
     * la fonction dans CalqueRoute lorsque les véhicules se font actualiser.
     * @returns {void}
     */
    updateRoute() {
        this.refs.calqueRoute.getQueryRoute();
    }

    /**
     * Fonction de rendu.
     * @returns {string} Le html généré.
     */
    render() {
        return (
            <div className="menuLayer">
                <button className="but but-spec but-Couche butMenu cacherCoter" onClick={this.handleClick} />
                <div className="hidden" id="collapseLayers">
                    <div>
                        <button id="boutonZoomGlobal" key="zoomGlobal"
                            onClick={() => MapAnim.zoomGlobal() & $('.btnTrackingAutre').click() & $('.btnTrackingActif').click()}
                            className='active but but-spec but-ZoomGlobal' />
                    </div>

                    {Route.forme.length != 0 && <div><button id="boutonCadrerRoute" key="cadrerRoute"
                        onClick={() => MapAnim.cadrerLaRoute() & $('.btnTrackingAutre').click() & $('.btnTrackingActif').click()}
                        className='active but but-spec but-CadrerRoute' /></div>}
                    <CalqueInfos />
                    <CalqueAppels appelsPrets={this.setAppelsPret.bind(this)} />
                    <CalqueRoute ref="calqueRoute" />
                    <CalqueCamions 
                        updateRoute={this.updateRoute.bind(this)} 
                        camionsPrets={this.setCamionsPret.bind(this)} 
                        obtenirMiseAJourInfobarre={this.props.obtenirMiseAJourInfobarre}
                        estTrajetFini={this.props.estTrajetFini} 
                    />
                </div>
            </div>
        );
    }
}

export default Calques;


import React from 'react';
import * as ol from 'openlayers';
import BarInfo from './BarInfo';
import Carte from './../Models/Carte';
import Calques from './Calques';
import MapAnim from './../Models/MapAnim';
import Route from '../Models/Route';
import BoutonCentrage from './BoutonCentrage';
import { setLabelMsg, setLabelCamion, afficherPopup, angleEntrePoints, parseQuery } from '../Models/Util';
import $ from 'jquery';


/**
 * Classe de Map de OpenLayers.
 * @author Louis Lesage
 */
class CarteOL extends React.Component {
    /**
    * @desc Constructeur de CarteOL.
    * @constructor
    */
    constructor() {
        super();
        this.parametres = {};
        this.state = {
            estTBT: false,
            directiveActuelle: 'Chargement',
            narratifActuel: 'Chargement',
            narratifsSuivants: [],
            narratifComplet: [],
            icon: -1,
            distanceTotale: 0,
            distanceRestante: 0,
            distanceParcourue: 0,
            distanceParcourueTotale: 0,
            distanceParcourueNarration: 0,
            proportionDistances: 0,
            distanceNarration: 0,
            distanceParPoint: [],
            estTrajetFini: false,
        };
        this.divTBTVisible = false;
    }

    /**
     * Fonction de ReactJS appelée après que le component ai été monté.
     * @returns {void}
     */
    componentDidMount() {
        // Définit le target de la map au div avec l'id 'map'
        Carte.carte.setTarget('map');
        // Messages de bienvenue
        const texteBienvenue = 'Bienvenue dans l\'application GPS des Services des Incendies!';
        setLabelMsg(texteBienvenue);
        afficherPopup(texteBienvenue, 1000);
        setLabelCamion();
        Carte.initialiserEcouteEvenement();

        this.afficherBarreInfo();

        //Permet de régler le problème où la map est pas assez haute
        Carte.carte.updateSize();

        // Quitte le mode TBT lors d'une perte de connexion
        const self = this;

        // Gère la perte de réseau
        window.addEventListener('offline', function () {
            self.divTBTVisible = !$('#divBtnTBT').hasClass('d-none');
            const msg = 'Perte de la connexion';
            setLabelMsg(msg);
            afficherPopup(msg, 1000);
            $('#divBtnTBT').addClass('d-none');
            if (self.state.estTBT) {
                self.changerMode();
            }
        });

        // Gère la reprise de réseau
        window.addEventListener('online', function () {
            const msg = 'Reprise de la connexion';
            setLabelMsg(msg);
            afficherPopup(msg, 1000);
            if (self.divTBTVisible) {
                $('#divBtnTBT').removeClass('d-none');
            }
        });
    }

    /**
    * @desc Fonction pour basculer du mode turn by turn au mode normal
    * @returns {void}
    */
    changerMode() {
        const self = this;
        // Toggle du css
        document.getElementById('map').classList.toggle('map-tilt');

        // Sauvegarde l'état actuel
        self.parametres = {
            zoomLevel: Carte.getCarte().getView().getZoom(),
            rotation: Carte.getCarte().getView().getRotation(),
            center: Carte.getCarte().getView().getCenter(),
        };

        self.setState({ estTBT: !self.state.estTBT }, function () {
            Carte.changerEtatInteractions(!self.state.estTBT);

            $('.butMenu').removeClass('cacherCoter');

            if (self.state.estTBT) {
                Carte.desactiverSuivi();
            } else {
                $('#btnCentrer').click();
            }

            $('#boutonZoomGlobal').toggleClass('d-none'); //Cache les boutons qu'on utilise pas en tbt
            $('#boutonCadrerRoute').toggleClass('d-none'); //Cache les boutons qu'on utilise pas en tbt

            Carte.setTurnByTurn(self.state.estTBT);

            if (Route.forme.length > 1 && Carte.getTurnByTurn()) {
                self.parametres.rotation = angleEntrePoints(Route.forme[Route.indexRendu], Route.forme[Route.indexRendu + 1]);
            }

            Carte.getView().animate({
                zoom: self.parametres.zoomLevel,
                center: self.parametres.center,
                rotation: self.state.estTBT ? self.parametres.rotation : 0,
                easing: ol.easing.easeIn,
                duration: 1000,
            });

            MapAnim.centrerSurMonCamion();
        });
    }

    /**
     * Permet d'obtenir les informations de narrations de CalqueCamions.
     * @param {Object} p_narratifs Un objet avec toutes les informations de narrations.
     * @param {Object} p_distances Un objet avec toutes les informations des distances.
     * @returns {void}
     */
    obtenirMiseAJourInfobarre(p_narratifs, p_distances) {
        this.setState(p_narratifs);

        if (p_distances.distanceTotale != this.state.distanceTotale) {
            this.setState({ distanceParcourueTotale: 0,
                distanceRestante: p_distances.distanceTotale,
            });
        }

        if (this.state.distanceParcourueTotale == 0) {
            this.state.distanceRestante = p_distances.distanceTotale * p_distances.proportionDistances;
        }

        if (p_distances.estNouvelleRoute) {
            this.setState({ distanceParcourueTotale: 0 });
        }

        this.setState(p_distances);

        this.setState({
            distanceParcourueTotale: this.state.distanceParcourueTotale + this.state.distanceParcourue * this.state.proportionDistances,
            distanceRestante: this.state.distanceRestante - p_distances.distanceParcourue * this.state.proportionDistances > 0 ? 
                this.state.distanceRestante - p_distances.distanceParcourue * this.state.proportionDistances : 0,
            distanceNarration: this.state.distanceNarration - this.state.distanceParcourue * this.state.proportionDistances,
            progression: this.state.distanceParcourueTotale * 100 / (this.state.distanceTotale * this.state.proportionDistances),
        });

        if (Route.indexRendu == Route.forme.length - 1) {
            this.setState({ estTrajetFini: true,
                narratifActuel: '',
                narratifsSuivants: '',
                distanceParPoint: '',
                distanceRestante: '', 
            });

            Route.narration = [];
            Route.forme = [];
            if (this.state.estTBT) {
                this.changerMode();
            }
        }
    }

    /**
     * Vérifie si le lien possède comme valeur Route au paramètre f.
     * Si il ne le possède pas nous cachons la barre en haut sauf le hamburger.
     * @returns {void} void
    */
    afficherBarreInfo() {
        const params = parseQuery(window.location.search);

        if (params.f != 'Route') {
            $('.infoBar-icon-container').css('display', 'none');
            $('.infoBar-direction-center').css('display', 'none');
            $('.infoBar-dest-center').css('display', 'none');
            $('.progress').css('display', 'none');
            $('#map').css('height', '100%');
            $('.infoBar-menu-hamburger').css('margin-left', '90%');
            $('#sidebar').css('top', '9em');
        }
    }

    /**
     * Fonction de rendu.
     * @returns {string} Le html généré.
     */
    render() {
        return (
            <div>
                <div id="map" />
                <BarInfo
                    texte={this.state.narratifActuel}
                    km={Route.distancesNarration[Route.indiceNarratifActuel - 1]}
                    icon={this.state.icon}
                    iconSuivants={this.state.listeProchainsIcons}
                    progression={this.state.progression}
                    dest={this.state.distanceRestante}
                    distanceParPoint={this.state.distanceParPoint}
                    distanceTotale={this.state.distanceTotaleMapQuest}
                    narratifsSuivants={this.state.narratifComplet}
                />

                {/* Popup de message(s)*/}
                <div id='messageNotification' className='popup'>
                    <div className='popup_inner'>
                        <p className='textPopup'>popup</p>
                    </div>
                </div>

                <div id="sidebar" className="butMenu cacherCoter">
                    {!this.state.estTBT &&
                        <div className="flexed">
                            <button id="zoomPlus" onClick={
                                () => MapAnim.zoomer()
                            } className='but but-spec but-ZoomPlus butMenu cacherCoter' />
                        </div>
                    }
                    {!this.state.estTBT &&
                        <div className="flexed">
                            <button id="zoomMoins" onClick={
                                () => MapAnim.dezoomer()
                            } className='but but-spec but-ZoomMoins butMenu cacherCoter' />
                        </div>
                    }
                    {this.state.estTBT &&
                        <div className="flexed">
                            <button id="zoomPlus" onClick={ MapAnim.zoomInTBT }
                                className='but but-spec but-ZoomPlus butMenu cacherCoter' />
                        </div>
                    }
                    {this.state.estTBT &&
                        <div className="flexed">
                            <button id="zoomMoins" onClick={ MapAnim.zoomOutTBT }
                                className='but but-spec but-ZoomMoins butMenu cacherCoter' />
                        </div>
                    }
                    {!this.state.estTBT &&
                        <div className="flexed">
                            <BoutonCentrage />
                        </div>
                    }
                    <div id='divBtnTBT' className="flexed d-none">
                        <button id="tbyt" onClick={this.changerMode.bind(this)} className='but but-spec but-TurnByTurn butMenu cacherCoter' />
                    </div>

                    <div className="flexed">
                        <Calques 
                            obtenirMiseAJourInfobarre={this.obtenirMiseAJourInfobarre.bind(this)}
                            estTrajetFini={this.state.estTrajetFini} 
                        />
                    </div>
                    {/* On veux toujours */}
                </div>
            </div >
        );
    }
}

export default CarteOL;

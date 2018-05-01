import React, { Component } from 'react';
import { texteDistance } from '../Models/Util';
import $ from 'jquery';
import { isUndefined } from 'util';

/**
 * @desc Classe de la bar d'information pour la navigation.
 * @author Martin Drouet
 * @author Florent Delahaye
 */
class BarInfo extends Component {
    /**
     * @desc Permet le fonctionnement du bouton de menu d'affichage et cache les autres boutons.
     * @author Florent Delahaye
     * @return {void}
     */
    menuHamburger() {
        // Change l'état du bouton menu 'Trigger' en 'Croix'
        $('.hamburger').toggleClass('is-active');
        // Affiche/cache les éléments en enlevant/mettant la classe 'cacherCoter'
        $('.butMenu').toggleClass('cacherCoter');
        // Cache à chaque clique le sous menu des couches
        $('#collapseLayers').addClass('hidden');
    }

    /**
     * Ajoute un listener au bouton permettant d'ouvrir et fermer le menu des prochaines indications.
     * Ajuste la position du bouton selon le menu.
     * @returns {void}
     */
    componentDidMount() {
        const $prochainesDirectives = $('.autres-directives');
        const $btnProchain = $('#btnProchainesDirectives');

        $btnProchain.click(function () {
            $prochainesDirectives.animate({ left: parseInt($prochainesDirectives.css('left'), 10) == 0 ? -$prochainesDirectives.outerWidth() : 0 });
            $btnProchain.animate({ left: parseInt($prochainesDirectives.css('left'), 10) == 0 ? 0 : $prochainesDirectives.outerWidth() }, function () {
                $btnProchain.toggleClass('ouvert');
            });
        });
        $btnProchain.addClass('hidden');
    }

    /**
     * Lors de l'update du compoenent, on recalcule et ajoute les marqueurs de distance du trajet 
     * dans la barre de progrès.
     * @returns {void}
     */
    componentDidUpdate() {
        let totalOffset = 0;
        let rightOffset;
        $('.progress-divider').html('');
        for (let i = 0, len = this.props.distanceParPoint.length; i < len; i++) {
            rightOffset = Math.round(this.props.distanceParPoint[i] / this.props.distanceTotale * 100);
            totalOffset += rightOffset;
            $('.progress-divider').append('<div class="divider" style="left:' + totalOffset + '%"></div>');
        }
    }

    /**
     * Ferme la sidebar contenant les prochaines indications.
     * @returns {void}
     */
    fermerProchainesDirectives() {
        const $prochainesDirectives = $('.autres-directives');
        const $btnProchain = $('#btnProchainesDirectives');
        $prochainesDirectives.animate({ left: -$prochainesDirectives.outerWidth() });
        $btnProchain.animate({ left: 0 });
    }

    /**
     * Permet d'afficher toutes les prochaines directives dans une barre sur le côté
     * @param {Object} self l'instance de la classe
     * @returns {array} Un tableau d'html des autres directives
     */
    afficherProchainesDirectives(self) {
        const $btnToggle = $('#btnProchainesDirectives');
        if (!isUndefined(self.props.narratifsSuivants) && self.props.narratifsSuivants.length) {
            const lesProchainesDirectives = [];
            const taille = self.props.narratifsSuivants.length;

            for (let i = 0; i < taille; i++) {
                lesProchainesDirectives.push(
                    <div className="pos-r infoBar infobar-prochaine" key={i}>
                        <div className="row">
                            <div className={'infoBar-bg infoBar-icon-container infoBar-icon-' + self.props.iconSuivants[i]}>
                            </div>
                            <div className="infoBar-bg infoBar-direction-center p-3 prochaines-directives">
                                <div className="infoBar-direction direction-prochaine">
                                    {self.props.narratifsSuivants[i]}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            $btnToggle.fadeIn();

            return lesProchainesDirectives;
        } else {
            this.fermerProchainesDirectives();
            $btnToggle.fadeOut();
        }
    }

    /**
     * Fonction de rendu.
     * @returns {string} Le html généré.
     */
    render() {
        // La propriété 'affichage' doit être definie, il s'agit de la fonction de rendue pour ce qui est à l'interieur
        // Le style de la bar se definie en css avec la classe 'infoBar'

        const progression = {
            width: this.props.progression + '%',
        };

        return (
            <div>
                <div className="pos-r infoBar">
                    <div className="progress">
                        <div className="progress-divider" />
                        <div className="progress-bar" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={progression} >
                            <span className="sr-only">70% Complete</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className={'infoBar-bg infoBar-icon-container infoBar-icon-' + this.props.icon}>
                            <div className="infoBar-icon-km">
                                {texteDistance(this.props.km)}
                            </div>
                        </div>
                        <div className="infoBar-bg infoBar-direction-center p-3">
                            <div className="infoBar-direction">
                                {this.props.texte}
                            </div>
                        </div>
                        <div className="infoBar-bg infoBar-dest-center">
                            <div className="infoBar-dest">
                                <span>Destination</span><br />
                                {texteDistance(this.props.dest)}
                            </div>
                        </div>

                        <div onClick={this.menuHamburger} className="infoBar-bg infoBar-menu-hamburger">
                            <button id="but-hamburger">
                                <div className="hamburger" id="hamburger-9">
                                    <span className="line"></span>
                                    <span className="line"></span>
                                    <span className="line"></span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                <div id="btnProchainesDirectives" />
                <div className="autres-directives">
                    {this.afficherProchainesDirectives(this)}
                </div>
            </div>
        );
    }
}

export default BarInfo;

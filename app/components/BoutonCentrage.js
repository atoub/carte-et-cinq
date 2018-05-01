import React from 'react';
import Carte from './../Models/Carte';
import { afficherPopup } from '../Models/Util';
import $ from 'jquery';

/**
 * Classe de bouton qui gère le centrage de la carte vers une position.
 * @author Louis Lesage et Philippe Ross
 * Modifications pour le suivi des points.
 * @author Étienne Gauvin-Clermont
 */
class BoutonCentrage extends React.Component {
    /**
     * Fonction qui gère le clic sur le bouton centrage
     * @returns {void}
     */
    clickCentrage() {
        if ($('#btnCentrer').hasClass('btnTrackingActif') || $('#btnCentrer').hasClass('btnTrackingAutre')) {
            Carte.desactiverSuivi();
            $('#btnCentrer').removeClass('btnTrackingActif btnTrackingAutre');
        } else {
            $('#btnCentrer').removeClass('btnTrackingAutre');
            if (Carte.getMonMarqueur()) {
                Carte.setSuivi(Carte.getMonMarqueur());
                $('#btnCentrer').addClass('btnTrackingActif');
            } else {
                afficherPopup('Vous n\'avez pas de camion', 1000);
            }
        }
    }

    /**
     * Fonction de rendu.
     * @returns {string} Le html généré.
     */
    render() {
        return (
            <button id="btnCentrer" onClick={this.clickCentrage.bind(this)} className='active but but-spec butMenu but-Cible cacherCoter' />
        );
    }
}

export default BoutonCentrage;

import React from 'react';
import Carte from '../Models/Carte';
import ZoomComponent from './ZoomComponent';
import $ from 'jquery';

/**
 * Calque qui gère l'ensemble des zooms.
 * @author Gilles Quintin
 */
class Zoom extends React.Component {
    /**
    * @desc Constructeur de Zoom.
    * @constructor
    * @param {*} props Attributs html.
    */
    constructor(props) {
        super(props);
    }

    /**
     * Ouvre et ferme le menu des zooms affichés.
     * @returns {void}
     */
    handleClick() {
        document.getElementById('collapseLayersZoom').classList.toggle('hidden');

        if(!$('#collapseLayers').hasClass('hidden')) {
            document.getElementById('collapseLayers').classList.toggle('hidden');
        }

        if (!$('#collapseLayersZoom').hasClass('hidden')) {
            const hide = function () {
                document.getElementById('collapseLayersZoom').classList.add('hidden');
                Carte.getCarte().un('click');
            };

            Carte.getCarte().on('click', hide);
            Carte.getCarte().on('pointerdrag', hide);
        }
    }

    /**
     * Fonction de rendu.
     * @returns {string} Le html généré.
     */
    render() {
        return (
            <div className="menuLayer">
                <div className="hidden" id="collapseLayersZoom">
                    <ZoomComponent zoomName='100' zoomMapValue='17' />
                    <ZoomComponent zoomName='75' zoomMapValue='16' />
                    <ZoomComponent zoomName='50' zoomMapValue='15' />
                    <ZoomComponent zoomName='25' zoomMapValue='14' />
                </div>
                <button className="but but-spec but-Zoom butMenu cacherCoter" onClick={this.handleClick} />
            </div>
        );
    }
}

export default Zoom;


import React from 'react';
import { setCookie, getCookie, parseQuery } from './../Models/Util';
import $ from 'jquery';

/**
 * Classe pour les ptions de configuration
 * @author Philippe Ross
 */
class Options extends React.Component {

    enregistrer() {
        setCookie('numeroCamion', $('#numeroCamion').val());
        location.search = '';
    }
    /**
     * Execute l'action mentionné dans la query string.
     * @returns {void}
     */
    componentDidMount() {
        const params = parseQuery(window.location.search);
        if (params.f == 'Options') {
            $('#numeroCamion').val(getCookie('numeroCamion'));
            $('#options').removeClass('d-none');
            $('#carteComplete').addClass('d-none');
        }
    }

    /**
     * Fonction de rendu.
     * @returns {string} Le html généré.
     */
    render() {
        return (
            <form id="options" className="d-none p-5">
                <h2>Options</h2>
                <div className="form-group">
                    <label>Numéro camion : </label>
                    <input type="number" className="form-control" id="numeroCamion" />
                </div>
                <button type="submit" className="btn btn-primary" onClick={this.enregistrer} data-dismiss="modal">Enregistrer</button>
            </form>
        );
    }
}

export default Options;

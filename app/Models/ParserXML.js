import axios from 'axios';
import Camion from './../Models/Camion';
import Appel from './../Models/Appel';
import { XML_APPEL_URL, XML_CAMION_URL } from '../Models/Env.js';

let indexRoutePHP = 0;

/**
 * Classe d'abstraction des données XML pour l'application.
 * @author Louis Lesage
 * @see Appel
 * @see Camions
 */
class ParserXML {
    /**
     * Fonction qui fait une requête http vers le serveur de camions.
     * @returns {Promise} la promesse de l'affectation du state.
     */
    static getCamions() {
        let adresse = XML_CAMION_URL;// L'adresse appelée pour les camions

        // Modification temporaire pour l'etape
        adresse = adresse + '?index=' + indexRoutePHP;
        indexRoutePHP += 4;

        const cancelCamionsToken = axios.CancelToken;
        const sourceCamions = cancelCamionsToken.source();

        const timeoutCamionsID = setTimeout(function () {
            sourceCamions.cancel('La requête du fichier de camion a écouché.');
        }, 2000);

        return axios.get(adresse, { cancelToken: sourceCamions.token }).then(function (responce) {
            clearTimeout(timeoutCamionsID);
            return ParserXML.extraireCamions(responce.data);
        }).then(function (camions) {
            return camions;
        }).catch(function (text) {
            console.error(text.message);
        });
    }

    /**
     * Fonction qui fait une requête http vers le serveur d'appels.
     * @returns {Promise} La promesse de l'affectation du state.
     */
    static getAppels() {
        const cancelAppelsToken = axios.CancelToken;
        const sourceAppels = cancelAppelsToken.source();

        const timeoutAppelsID = setTimeout(function () {
            sourceAppels.cancel('La requête du fichier d\'appels a écouché.');
        }, 2000);

        return axios.get(XML_APPEL_URL, { cancelToken: sourceAppels.token }).then(function (responce) {
            clearTimeout(timeoutAppelsID);
            return ParserXML.extraireAppels(responce.data);
        }).then(function (appels) {
            return appels;
        }).catch(function (text) {
            console.error(text.message);
        });
    }

    /**
     * Fonction qui crée des objets Camion à partir d'une string XML de camions
     * et qui l'enregistre dans le state de la CarteOL.
     * @param {string} p_camionsXML La string du XML des camions.
     * @returns {Camion[]} Liste de camion.
     */
    static extraireCamions(p_camionsXML) {
        const parser = new DOMParser();
        const text = parser.parseFromString(p_camionsXML, 'text/xml');
        const camions = text.getElementsByTagName('Camion');
        const arrayCamions = [];

        for (let i = 0; i < camions.length; i++) {
            const numero = camions[i].childNodes[0].innerHTML;
            const time = camions[i].childNodes[1].innerHTML;
            const statut = camions[i].childNodes[2].innerHTML;
            const latitude = camions[i].childNodes[3].innerHTML;
            const longitude = camions[i].childNodes[4].innerHTML;

            if (statut != 'IND') {
                arrayCamions.push(new Camion(parseFloat(longitude), parseFloat(latitude), numero, time, statut));
            }
        }

        return arrayCamions;
    }

    /**
     * Fonction qui crée des objets d'appels à partir d'une string XML d'appels
     * et qui l'enregistre dans le state de la CarteOL.
     * @param {string} p_appelsXML La string du XML des appels.
     * @returns {Appel[]} Liste d'appel.
     */
    static extraireAppels(p_appelsXML) {
        const parser = new DOMParser();
        const text = parser.parseFromString(p_appelsXML, 'text/xml');
        const appels = text.getElementsByTagName('Appel');
        const arrayAppels = [];

        for (let i = 0; i < appels.length; i++) {
            const numero = appels[i].childNodes[0].innerHTML;
            const time = appels[i].childNodes[1].innerHTML;
            const nature = appels[i].childNodes[2].innerHTML;
            const latitude = appels[i].childNodes[3].innerHTML;
            const longitude = appels[i].childNodes[4].innerHTML;
            const camions = [];

            for (let j = 0; j < appels[i].childNodes[5].childElementCount; j++) {
                camions.push(parseInt(appels[i].childNodes[5].childNodes[j].innerHTML));
            }

            arrayAppels.push(new Appel(parseFloat(longitude), parseFloat(latitude), numero, time, nature, camions));
        }

        return arrayAppels;
    }
}

export default ParserXML;

import React from 'react';
import { shallow, configure, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { texteDistance, parseQuery, getCookie, getProjFromLonLat, retirerCookie, setCookie, trouverProchainPoint, pointVersLosange } from '../../app/Models/Util';
import * as ol from 'openlayers';

configure({ adapter: new Adapter() });

/**
 * Classe de test du modèle Util
 * Fait le: 2018/02/20
 * @author Étienne G-Clermont
 */
describe('Cookie ', () => {
    /**
     * Test de la fonction parseQuery.
     */
    test('test de la fonction parseQuery', () => {
        let queryString = '?f=Zoom&camionID=120';
        let result = parseQuery(queryString);
        expect(result).toEqual({ 'f': 'Zoom', 'camionID': '120' });

        queryString = '';
        result = parseQuery(queryString);
        expect(result).toEqual({ '': '' });
    });

    /**
     * Test de la fonction getProjFromLonLat.
     */
    test('test de la fonction getProjFromLonLat', () => {
        const proj = getProjFromLonLat(45, 73);
        expect(proj).toEqual([5009377.085697311, 12123477.916891709]);
    });

    /**
     * Vérifie la valeur d'un cookie avec le get.
     */
    it('test pour obtenir la valeur d\'un cookie', () => {
        const nomCookie = 'cookie';
        const nomDeuxiemeCookie = 'deuxiemeCookie';
        const valeurCookie = 'allo';
        const valeurDeuxiemeCookie = true;
        document.cookie = nomCookie + '=' + valeurCookie + ';path=/';
        document.cookie = nomDeuxiemeCookie + '=' + valeurDeuxiemeCookie + ';path=/';
        const valeurCookieTrouver = getCookie(nomCookie);
        const valeurDeuxiemeCookieTrouver = getCookie(nomDeuxiemeCookie);

        expect(valeurCookieTrouver).toEqual(valeurCookie);
        expect(valeurDeuxiemeCookieTrouver).toEqual(valeurDeuxiemeCookie);
    });

    /**
     * Test l'ajout de cookies avec set.
     */
    it('test d\'ajout de cookie', () => {
        setCookie('cookie', 'abc');
        setCookie('deuxiemeCookie', '123');
        const cookie = getCookie('cookie');
        const deuxiemeCookie = getCookie('deuxiemeCookie');

        expect(cookie).toEqual('abc');
        expect(deuxiemeCookie).toEqual('123');
    });

    /**
     * Vérifie que l'on obtient une vrai valeur boolean si c'est le cas.
     */
    it('test d\'ajout de cookie boolean', () => {
        setCookie('cookie', true);
        setCookie('deuxiemeCookie', false);
        const cookie = getCookie('cookie');
        const deuxiemeCookie = getCookie('deuxiemeCookie');

        expect(cookie).toEqual(true);
        expect(deuxiemeCookie).toEqual(false);
    });

    /**
     * Vérifie que l'on obtient une vrai valeur boolean non textuel.
     */
    it('test d\'inégalité de cookie boolean', () => {
        setCookie('cookie', true);
        setCookie('deuxiemeCookie', false);
        const cookie = getCookie('cookie');
        const deuxiemeCookie = getCookie('deuxiemeCookie');

        expect(cookie === 'true').toBe(false);
        expect(deuxiemeCookie === 'false').toBe(false);
    });

    /**
     * Vérifie que le cookies est vide lorsqu'on le retire.
     */
    it('test lorsqu\'on retire des cookies ', () => {
        retirerCookie('cookie');
        retirerCookie('deuxiemeCookie');
        const cookie = getCookie('cookie');
        const deuxiemeCookie = getCookie('deuxiemeCookie');

        expect(cookie).toBe('');
        expect(deuxiemeCookie).toBe('');
    });
});

describe('Test afficher message pertinent', () => {
    // Forme de route pour test
    const forme = [
        [-73.269172, 45.294208],
        [-73.268165, 45.294208],
        [-73.268165, 45.294208],
        [-73.268127, 45.294528],
        [-73.268142, 45.294868],
        [-73.268127, 45.295669],
        [-73.268127, 45.295669],
        [-73.266685, 45.295654],
        [-73.266456, 45.295692],
        [-73.266456, 45.295692],
        [-73.266464, 45.296173],
        [-73.266487, 45.297023],
        [-73.266487, 45.297126],
        [-73.26651, 45.298019],
        [-73.266532, 45.298908],
        [-73.266563, 45.299816],
        [-73.266571, 45.300651],
    ];

    // Indices de directives pour test
    const directives = [2, 3, 5, 8, 9, 10];

    it('devrait retourner l\'indice du prochain point du chemin le plus proche de la position actuelle', () => {
        const positionActuelle = forme[0];
        expect(trouverProchainPoint(positionActuelle, forme)).toEqual(0);
    });

    test('test de la fonction texteDistance', () => {
        expect(texteDistance('1.1')).toEqual('1.10 km');
        expect(texteDistance('0.101')).toEqual('101 m');
        expect(texteDistance(1.1)).toEqual('1.10 km');
        expect(texteDistance(0.11)).toEqual('110 m');
        expect(texteDistance(4.1222)).toEqual('4.12 km');
        expect(texteDistance('4.1222')).toEqual('4.12 km');
    });

    test('test de la fonction qui transfore un point en lineString de losange', () => {
        expect(pointVersLosange([0, 7], 0.3)).toEqual({ 'geometry': { 'coordinates': [[0.3, 7], [0, 7.3], [-0.3, 7], [0, 6.7], [0.3, 7]], 'type': 'LineString' }, 'properties': {}, 'type': 'Feature' });
    });
});

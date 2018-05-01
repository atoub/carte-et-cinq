import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import PointInteret from '../../app/Models/PointInteret';
import CarteOL from '../../app/components/CarteOL';

configure({ adapter: new Adapter() });

/**
 * Classe de test du modèle de point d'intérêt.
 * Fait le: 2018/02/08
 * @author Jérémie Fortin
 */
describe('Modèle de Point d\'Intérêt', () => {
    /** @var {PointInteret} pointInteret Objet de la classe PointInteret. */
    let pointInteret;
    /** @var {number} longitude Longitude de la position de l'appel. */
    let longitude;
    /** @var {number} latitude Latitude d ela position de l'appel. */
    let latitude;

    /**
     * Instanciation d'un objet de type PointInteret avant chaque test.
     */
    beforeEach(() => {
        longitude = -73.269168;
        latitude = 45.296479;
        pointInteret = new PointInteret(longitude, latitude);
    });

    /**
     * Teste la création d'un objet PointInteret.
     */
    it('devrait exister', () => {
        expect(pointInteret).toBeTruthy();
    });

    /**
     * Teste le getter de la longitude.
     */
    it('devrait avoir la bonne longitude', () => {
        expect(pointInteret.getLon()).toEqual(longitude);
    });

    /**
     * Teste de la latitude.
     */
    it('devrait avoir la bonne latitude', () => {
        expect(pointInteret.getLat()).toEqual(latitude);
    });

    /**
     * Teste le getter des coordonées Openlayers.
     */
    it('devrait générer des coordonées Openlayers', () => {
        expect(pointInteret.getCoordonnees()).toBeTruthy();
    });

    /**
     * Teste la création d'un marqueur à la position du point d'intérêt.
     */
    it('devrait créer un marqueur à sa position', () => {
        const marqueur = pointInteret.getMarqueur();
        expect(marqueur).toBeTruthy();
        expect(marqueur.getLon()).toBeCloseTo(marqueur.getLon(), 7);
        expect(marqueur.getLat()).toBeCloseTo(marqueur.getLat(), 7);
    });
});

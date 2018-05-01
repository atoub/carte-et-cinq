import React from 'react';
import { shallow, configure, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Camion from '../../app/Models/Camion';

configure({ adapter: new Adapter() });

/**
 * Classe de test du modèle Camion.
 * Fait le: 2018/02/08
 * @author Jérémie Fortin
 */
describe('Modèle de camion', () => {
    /** @var {Camion} camion Objet de type Camion. */
    let camion;
    /** @var {number} longitude Longitude de la postiion du camion. */
    let longitude;
    /** @var {number} latitude Latitude de la position du camion. */
    let latitude;
    /** @var {string} temps Temps du camion. */
    let temps;
    /** @var {string} statut Statut du camion. */
    let statut;

    /**
     * Instanciation d'un objet Camion avant chaque test.
     */
    beforeEach(() => {
        longitude = -73.269168;
        latitude = 45.296479;
        temps = '2017-02-01 13:09:00';
        statut = 'IND';
        camion = new Camion(longitude, latitude, 1, temps, statut);
    });

    /**
     * Teste la création d'un camion.
     */
    it('devrait exister', () => {
        expect(camion).toBeTruthy();
    });

    /**
     * Teste la création d'un marqueur de camion à la position du camion.
     */
    it('devrait créer un marqueur de camion à sa position', () => {
        const marqueur = camion.getMarqueur();
        expect(marqueur).toBeTruthy();
        expect(marqueur.getLon()).toBeCloseTo(camion.getLon(), 7);
        expect(marqueur.getLat()).toBeCloseTo(camion.getLat(), 7);
    });

    /**
     * Test sur les getter du camion.
     */
    test('test getter', () => {
        expect(camion.getNumero()).toEqual(1);
        expect(camion.getStatut()).toEqual('IND');
    });
});

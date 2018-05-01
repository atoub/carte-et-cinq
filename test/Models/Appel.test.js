import React from 'react';
import { shallow, configure, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Appel from '../../app/Models/Appel';
import Camion from '../../app/Models/Camion';

configure({ adapter: new Adapter() });

/**
 * Bloc de test du modèle Appel.
 * Fait le: 2018/02/08
 * @author Jérémie Fortin
 */
describe('Modèle d\'appel', () => {
    /** @var {Appel} appel Objet de la classe Appel. */
    let appel;
    /** @var {number} longitude Longitude de la position de l'appel. */
    let longitude;
    /** @var {number} latitude Latitude d ela position de l'appel. */
    let latitude;
    /** @var {string} temps Temps au moment de l'appel. */
    let temps;
    /** @var {string} nature Nature de l'appel. */
    let nature;
    /** @var {?Camion[]} camions Array des camions sur le cas de cet appel. */
    let camions;

    /**
     * Affecte une instance d'Appelavant chaque test.
     */
    beforeEach(() => {
        longitude = -73.269168;
        latitude = 45.296479;
        temps = '2017-02-01 13:09:00';
        nature = 'Accident de voiture';
        camions = [
            new Camion(longitude, latitude, 4, temps, 'En route'),
            new Camion(longitude, latitude, 5, temps, 'Sur les lieux'),
        ];
        appel = new Appel(longitude, latitude, 1, temps, nature, camions);
    });

    /**
     * Teste la création de l'instance de la classe.
     */
    it('devrait exister', () => {
        expect(appel).toBeTruthy();
    });

    /**
     * Teste la création d'un marqueur d'appel à la position de l'appel.
     */
    it('devrait créer un marqueur d\'appel à sa position', () => {
        const marqueur = appel.getMarqueur();
        expect(marqueur).toBeTruthy();
        expect(marqueur.getLon()).toBeCloseTo(appel.getLon(), 7);
        expect(marqueur.getLat()).toBeCloseTo(appel.getLat(), 7);
    });
});

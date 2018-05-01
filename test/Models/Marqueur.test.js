import React from 'react';
import { shallow, configure, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Marqueur from '../../app/Models/Marqueur';
import * as ol from 'openlayers';

configure({ adapter: new Adapter() });

/**
 * Classe de test du modèle de marqueur.
 * Fait le: 2018/02/08
 * @author Jérémie Fortin
 */
describe('Modèle de marqueur', () => {
    /** @var {Marqueur} marqueur Objet de classe Marqueur. */
    let marqueur;
    /** @var {number} longitude Longitude de la position du marqueur. */
    let longitude;
    /** @var {number} latitude latitude de la position du marqueur. */
    let latitude;
    /** @var {ol.proj} position Position en projection Openlayers du marqueur. */
    let position;

    /**
     * Affectation d'un nouvel objet Marqueur avant chaque test.
     */
    beforeEach(() => {
        longitude = -73.269168;
        latitude = 45.296479;
        position = ol.proj.fromLonLat([longitude, latitude]);
        marqueur = new Marqueur(position);
    });

    /**
     * Teste la création de l'objet.
     */
    it('devrait exister', () => {
        expect(marqueur).toBeTruthy();
    });

    /**
     * Teste l'existence du style du marqueur.
     */
    it('devrait avoir un style définit', () => {
        expect(marqueur.getStyle()).toBeTruthy();
    });

    /**
     * Teste le getter de la longitude.
     */
    it('devrait avoir la bonne longitude', () => {
        expect(marqueur.getLon()).toBeCloseTo(longitude, 7);
    });

    /**
     * Teste le getter de la latitude.
     */
    it('devrait avoir la bonne latitude', () => {
        expect(marqueur.getLat()).toBeCloseTo(latitude, 7);
    });

    /**
    * Vérifie égalité d'un marqueur.
    */
    it('test d\'égalité entre les marqueurs', () => {
        const deuxiemeMarqueur = new Marqueur(ol.proj.fromLonLat([-73.269168, 45.296479]));
        const troisiemeMarqueur = new Marqueur(ol.proj.fromLonLat([-73.266828, 45.299901]));

        // Test égalité
        expect(marqueur.equals(new Marqueur(ol.proj.fromLonLat([-73.269168, 45.296479])))).toBe(true);
        expect(marqueur.equals(deuxiemeMarqueur)).toBe(true);

        // Test inégalité
        expect(deuxiemeMarqueur.equals(troisiemeMarqueur)).toBe(false);
    });
});

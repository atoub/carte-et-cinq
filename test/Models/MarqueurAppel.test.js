import React from 'react';
import { shallow, configure, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import MarqueurAppel from '../../app/Models/MarqueurAppel';
import Marqueur from '../../app/Models/Marqueur';
import * as ol from 'openlayers';

configure({ adapter: new Adapter() });

/**
 * Classe de test du modèle de marqueur d'appel.
 * Fait le: 2018/02/08
 * @author Jérémie Fortin
 */
describe('Modèle de marqueur d\'appel', () => {
    /** @var {MarqueurAppel} marqueur  Objet de type MarqueurAppel. */
    let marqueur;
    /** @var {number} longitude Longitude de la position du marqueur. */
    let longitude;
    /** @var {number} latitude latitude de la position du marqueur. */
    let latitude;
    /** @var {number} no Numéro de l'appel lié au marqueur. */
    let no;
    /** @var {ol.proj} position Position en projection Openlayers du marqueur. */
    let position;

    /**
     * Instanciation d'un objet MarqueurAppel avant chaque test.
     */
    beforeEach(() => {
        longitude = -73.269168;
        latitude = 45.296479;
        no = 5;
        position = ol.proj.fromLonLat([longitude, latitude]);
        marqueur = new MarqueurAppel(position, no);
    });

    /**
     * Teste la création d'un marqueur d'appel.
     */
    it('devrait exister', () => {
        expect(marqueur).toBeTruthy();
    });

    /**
     * Vérifie que le style du marqueur est bien différent de celui de son parent.
     */
    it('devrait avoir un style différent de celui d\'un marqueur normal', () => {
        expect(marqueur.getStyle()).not.toMatchObject(new Marqueur(position).getStyle());
    });

    /**
    * Vérifie égalité d'un marqueur d'appel.
    */
    it('test d\'égalité entre les marqueurs d\'appels ', () => {
        const marqueurDeuxiemeAppel = new MarqueurAppel(ol.proj.fromLonLat([-73.269168, 45.296479]), 2);
        const marqueurTroisiemeAppel = new MarqueurAppel(ol.proj.fromLonLat([-73.266828, 45.299901]), 3);

        // Test égalité
        expect(marqueur.equals(marqueurDeuxiemeAppel)).toBe(true);
        expect(marqueurDeuxiemeAppel.equals(marqueur)).toBe(true);

        // Test inégalité
        expect(marqueur.equals(marqueurTroisiemeAppel)).toBe(false);
        expect(marqueurDeuxiemeAppel.equals(marqueurTroisiemeAppel)).toBe(false);
    });
});

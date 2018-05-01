import React from 'react';
import { shallow, configure, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import MarqueurCamion from '../../app/Models/MarqueurCamion';
import Marqueur from '../../app/Models/Marqueur';
import * as ol from 'openlayers';

configure({ adapter: new Adapter() });

/**
 * Classe de test du modèle de marqueur de camion.
 * Fait le: 2018/02/08
 * @author Jérémie Fortin
 */
describe('Modèle de marqueur de camion', () => {
    /** @var {MarqueurAppel} marqueur  Objet de type MarqueurCamion. */
    let marqueur;
    /** @var {number} longitude Longitude de la position du marqueur. */
    let longitude;
    /** @var {number} latitude Latitude de la position du marqueur. */
    let latitude;
    /** @var {number} no Numéro de l'appel lié au marqueur. */
    let no;
    /** @var {ol.proj} position Position en projection Openlayers du marqueur. */
    let position;

    /**
     * Instanciation d'un objet MarqueurCamion avant chaque test.
     */
    beforeEach(() => {
        longitude = -73.269168;
        latitude = 45.296479;
        no = 5;
        position = ol.proj.fromLonLat([longitude, latitude]);
        marqueur = new MarqueurCamion(position, no);
    });

    /**
     * Teste la création d'un marqueur de camion.
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
    * Vérifie égalité d'un marqueur camion.
    */
    it('test d\'égalité entre les marqueurs de camions ', () => {
        const marqueurDeuxiemeCamion = new MarqueurCamion(ol.proj.fromLonLat([-73.269168, 45.296479]), 2);
        const marqueurTroisiemeCamion = new MarqueurCamion(ol.proj.fromLonLat([-73.266828, 45.299901]), 3);

        // Test égalité
        expect(marqueur.equals(marqueurDeuxiemeCamion)).toBe(true);
        expect(marqueurDeuxiemeCamion.equals(marqueur)).toBe(true);

        // Test inégalité
        expect(marqueur.equals(marqueurTroisiemeCamion)).toBe(false);
        expect(marqueurDeuxiemeCamion.equals(marqueurTroisiemeCamion)).toBe(false);
    });
});

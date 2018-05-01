import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import BoutonCentrage from '../../app/components/BoutonCentrage';
import Camion from '../../app/Models/Camion';
import Carte from '../../app/Models/Carte';

configure({ adapter: new Adapter() });

let camion;
let cible;
/**
 * Test sur le bouton de centrage.
 */
describe('BoutonCentrage component', () => {
    let wrapper;

    beforeAll(() => {
        wrapper = shallow(<BoutonCentrage />);
        Carte.numeroCamion = 120;
        camion = new Camion(45, -73, 120, '123123', 'CASE');
        Carte.setCamions([camion]);
        cible = camion.getMarqueur();
        Carte.setMarqueur(cible);
    });

    /**
     * Test d'existance.
     */
    it('should exist', () => {
        expect(wrapper).toBeTruthy();
    });

    /**
     * Test des classes du bouton.
     */
    test('test de la structure du bouton', () => {
        expect(wrapper.hasClass('active')).toBe(true);
        expect(wrapper.hasClass('but')).toBe(true);
        expect(wrapper.hasClass('but-Cible')).toBe(true);
        expect(wrapper.hasClass('cacherCoter')).toBe(true);
        expect(wrapper.hasClass('butMenu')).toBe(true);
    });

    /**
     * Test de la fonction clickCentrage
     */
    test('test de la fonction clickCentrage', () => {
        expect(Carte.cible).toBe(null);
        wrapper.instance().clickCentrage();
        expect(Carte.cible).toBe(cible);
    });
});

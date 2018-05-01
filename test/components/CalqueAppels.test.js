import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import CalqueAppels from '../../app/components/CalqueAppels';
import ParserXML from '../../app/Models/ParserXML';
import Util from '../../app/Models/Util';

configure({ adapter: new Adapter() });

/**
 * Test sur le CalqueAppels.
 * @author Philippe Ross
 */
describe('BoutonZoom component', () => {
    let wrapper = shallow(<CalqueAppels appelsPrets={function () { }} />);

    beforeAll(done => {
        ParserXML.getAppels().then(function (listeAppels) {
            wrapper.instance().setState({ appels: listeAppels });
            done();
        });
    });

    it('should exist', () => {
        expect(wrapper).toBeTruthy();
    });

    test('test du toggle visible', () => {
        expect(wrapper.instance().state.visible).toBe(true);
        // Le layerCamion devrait être visible.
        expect(wrapper.instance().layerAppels.getVisible()).toBe(true);

        wrapper.instance().toggleVisible();

        expect(wrapper.instance().state.visible).toBe(false);
        // Le layerCamion devrait être non visible.
        expect(wrapper.instance().layerAppels.getVisible()).toBe(false);
    });

    test('test de la fonction updateAppelMarqueur', () => {
        wrapper.instance().updateAppelMarqueur();
        expect(wrapper.instance().state.appels.length).toBe(2);
    });

    test('click button', () => {
        wrapper.instance().setState({ visible: true }); // Set initial pour avoir une abstraction des autre test
        expect(wrapper.instance().state.visible).toBe(true);

        wrapper.find('button').simulate('click'); // Clique sur le bouton devrait changer le state visible
        expect(wrapper.instance().state.visible).toBe(false);

        wrapper.find('button').simulate('click');
        expect(wrapper.instance().state.visible).toBe(true);
    });
});

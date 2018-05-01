import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import CalqueCamions from '../../app/components/CalqueCamions';
import ParserXML from '../../app/Models/ParserXML';
import Util from '../../app/Models/Util';

configure({ adapter: new Adapter() });

/**
 * Test sur le CalqueCamions.
 * @author Louis Lesage
 */
describe('BoutonZoom component', () => {
    const wrapper = shallow(<CalqueCamions camionsPrets={function () { }} />);

    beforeAll(done => {
        ParserXML.getCamions().then(function (listeCamions) {
            wrapper.instance().setState({ camions: listeCamions });
            done();
        });
    });

    it('should exist', () => {
        expect(wrapper).toBeTruthy();
    });

    test('test du toggle visible', () => {
        expect(wrapper.instance().state.visible).toBe(true);
        // Le layerCamion devrait être visible.
        expect(wrapper.instance().layerCamions.getVisible()).toBe(true);

        wrapper.instance().toggleVisible();

        expect(wrapper.instance().state.visible).toBe(false);
        // Le layerCamion devrait être non visible.
        expect(wrapper.instance().layerCamions.getVisible()).toBe(false);
    });

    test('test de la fonction updateCamionMarqueur', () => {
        wrapper.instance().updateCamionMarqueur();
        expect(wrapper.instance().state.camions.length).toBe(118);
    });

    test('click button', () => {
        wrapper.instance().setState({ visible: true }); // Set initial pour avoir une abstraction des autre test
        expect(wrapper.instance().state.visible).toBe(true);

        wrapper.find('button').simulate('click'); // Clique sur le bouton devrait changer le state visible
        expect(wrapper.instance().state.visible).toBe(false);

        wrapper.find('button').simulate('click'); // Clique sur le bouton devrait changer le state visible
        expect(wrapper.instance().state.visible).toBe(true);
    });
});

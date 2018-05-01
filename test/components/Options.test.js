import React from 'react';
import { shallow, configure } from 'enzyme';
import Options from '../../app/components/Options';
import Adapter from 'enzyme-adapter-react-16';
import { wrap } from 'module';

configure({ adapter: new Adapter() });

/**
 * Test sur le bouton de centrage.
 */
describe('BoutonCentrage Options', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<Options />);
    });

    it('should exist', () => {
        expect(wrapper).toBeTruthy();
    });
});

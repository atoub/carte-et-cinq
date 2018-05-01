import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Calques from '../../app/components/Calques';
import ParserXML from '../../app/Models/ParserXML';
import Camion from '../../app/Models/Camion';
import Appel from '../../app/Models/Appel';
import Util from '../../app/Models/Util';
import CalqueAppels from '../../app/components/CalqueAppels';

configure({ adapter: new Adapter() });

/**
 * Test sur le Calques.
 * @author Louis Lesage
 */
describe('Calque component', () => {
    const wrapper = shallow(<Calques />);

    test('test sur setCamions', () => {
        wrapper.instance().setCamionsPret();
    });

    test('test sur setAppels', () => {
        const camion1 = new Camion(45, -73, 120, '2017-02-01 13:09:00', 'IND');
        wrapper.instance().setAppelsPret();
    });
});

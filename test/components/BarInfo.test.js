import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import BarInfo from '../../app/components/BarInfo';
import CarteOL from '../../app/components/CarteOL';

configure({ adapter: new Adapter() });

/**
 * Test sur le CalqueCamions.
 * @author Florent Delahaye
 */
describe('BarInfo component', () => {
    let wrapper1, wrapper2;

    beforeEach(() => {
        wrapper1 = shallow(<CarteOL />);
        wrapper2 = shallow(<BarInfo texte='Tourner à droite' km='12.1' icon='gauche' progression='10' dest='45' />);
    });

    it('should exist', () => {
        expect(wrapper2).toBeTruthy();
    });

    test('Récupération des données correctes de <BarInfo/>', () => {
        // Récupération :
        // String direction
        expect(wrapper2.instance().props.texte).toBe('Tourner à droite');
        // Kilomètre jusqu'à la prochaine direction
        expect(wrapper2.instance().props.km).toBe('12.1');
        // Icon de direction correspondant
        expect(wrapper2.instance().props.icon).toBe('gauche');
        // Valeur progression sur l'itinéraire
        expect(wrapper2.instance().props.progression).toBe('10');
        // Nombre de kilomètre restant pour finir l'itinéraire
        expect(wrapper2.instance().props.dest).toBe('45');


    });

    test('test de la fonction menuHamburger()', () => {
        // On vérifie que les boutons sont bien caché en vérifiant la présence de la classe 'cacherCoter'
        expect(wrapper1.find('#zoomPlus').hasClass('cacherCoter')).toEqual(true);
        expect(wrapper1.find('#zoomMoins').hasClass('cacherCoter')).toEqual(true);
        expect(wrapper1.find('#tbyt').hasClass('cacherCoter')).toEqual(true);
    });
});

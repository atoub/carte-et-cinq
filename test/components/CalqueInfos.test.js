import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import CalqueInfos from '../../app/components/CalqueInfos';
import * as ol from 'openlayers';

configure({ adapter: new Adapter() });

/**
* Test sur le CalqueInfos
*/
describe('Calque Info component', () => {
    const wrapper = shallow(<CalqueInfos />);

    it('should exist', () => {
        expect(wrapper).toBeTruthy();
    });

    test('test du toggle visible', () => {
        const id = wrapper.instance().state.couches[0].id;
        const valeurDebut = wrapper.instance().state.couches[0].visible;
        wrapper.instance().toggleVisible(id); // Changement de visibilité
        // Le layerCamion devrait être visible.
        expect(wrapper.instance().state.couches[0].visible).not.toEqual(valeurDebut);
    });

    test('test du render des boutons', () => {
        wrapper.instance().setState({
            couches: [{
                id: 'satellite',
                bouton: <button key="satellite" className="btn btn-default upfront"><i className="fas fa-th"></i></button>,
            }],
        });

        const result = wrapper.instance().renderBoutons();
        expect(result[0].props.children.key).toEqual('satellite');
    });

    test('click button', () => {
        wrapper.instance().setState({
            couches: [{
                id: 'satellite',
                tuile: new ol.layer.Tile({
                    source: new ol.source.TileDebug({
                        projection: 'EPSG:3857',
                        tileGrid: new ol.source.OSM().getTileGrid(),
                    }),
                }),
                bouton: <button key="satellite" onClick={() => this.toggleVisible('satellite')} className='but but-CoucheSatellite' />,
                visible: false,
            }],
        });
        expect(wrapper.instance().state.couches[0].visible).toBe(false);
        wrapper.instance().toggleVisible('satellite'); // Fonction appelée par le OnClick du boutton.
        // wrapper.at(0).find('.but-CoucheSatellite').simulate('click'); //Click sur le bouton devrait changer le state visible
        expect(wrapper.instance().state.couches[0].visible).toBe(true);
    });
});


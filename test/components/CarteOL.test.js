import React from 'react';
import CarteOL from '../../app/components/CarteOL';
/**
 * Test par rapport à CarteOL.
 */
test('Id du div de CarteOL est map', () => {
    const component = new CarteOL();
    const render = component.render();
    expect(render.props.children[0].props.id).toEqual('map');
});

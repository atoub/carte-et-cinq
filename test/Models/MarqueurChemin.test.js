import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MarqueurChemin from '../../app/Models/MarqueurChemin';
import imageLeft from './../assets/images/icones/marker_left.svg'; // Image du marqueur.
import imageStart from './../assets/images/icones/marker_start.svg'; // Image du marqueur.
import imageRight from './../assets/images/icones/marker_right.svg'; // Image du marqueur.
import imageEnd from './../assets/images/icones/marker_end.svg'; // Image du marqueur.

configure({ adapter: new Adapter() });

describe('test correspondance type / path de l\'image', () => {

    it('devrait retourner une image representant la direction', () => {
        const type = 'left';
        const m = new MarqueurChemin([0, 0], type);
        const img = new Image();
        img.src = imageLeft;
        expect(m.getStyle().getImage().getImage().src).toBe(img.src);
    });

    it('devrait retourner une image representant la direction', () => {
        const type = 'right';
        const m = new MarqueurChemin([0, 0], type);
        const img = new Image();
        img.src = imageRight;
        expect(m.getStyle().getImage().getImage().src).toBe(img.src);
    });

    it('devrait retourner une image representant la direction', () => {
        const type = 'end';
        const m = new MarqueurChemin([0, 0], type);
        const img = new Image();
        img.src = imageEnd;
        expect(m.getStyle().getImage().getImage().src).toBe(img.src);
    });
 
    it('devrait retourner une image representant la direction', () => {
        const type = 'start';
        const m = new MarqueurChemin([0, 0], type);
        const img = new Image();
        img.src = imageStart;
        expect(m.getStyle().getImage().getImage().src).toBe(img.src);
    }); 
});
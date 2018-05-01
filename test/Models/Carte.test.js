import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Carte from '../../app/Models/Carte';
import Camion from '../../app/Models/Camion';

configure({ adapter: new Adapter() });

describe('Tests unitaires pour carte js', () => {
    it('Le status de la connexion devrait etre false lorsqu\'on perd la connexion à l\'internet', () => {
        expect(Carte.setConnexion('Off')).toEqual(false);
    });

    it('Le status de la connexion devrait etre true lorsqu\'on est connecté à l\'internet', () => {
        expect(Carte.setConnexion('On')).toEqual(true);
    });
});

describe('Test pour le zoom turnByTurn', () => {
    it('la carte en CarteOL doit avoir son zoom modifer pour valoir 15 pour le niveau 0', () => {
        Carte.setZoomTbT(0, new Camion(0, 0, 0, 0, ''), 0);
        setTimeout(
            function () {
                expect(Carte.carte.getView().getZoom()).toEqual(15);
            },
            200
        );
    });

    it('la carte en CarteOL doit avoir son zoom modifer pour valoir 17 pour le niveau 2', () => {
        Carte.setZoomTbT(2, new Camion(0, 0, 0, 0, ''), 0);
        setTimeout(
            function () {
                expect(Carte.carte.getView().getZoom()).toEqual(17);
            },
            200
        );
    });
});

test('test du set et de la désactivation du suivi', () => {
    const camion = new Camion(45, -73, 120, '123123', 'CASE');
    const cible = camion.getMarqueur();
    expect(Carte.cible).toBe(null);
    Carte.setSuivi(cible);
    expect(Carte.cible).toBe(cible);
    Carte.desactiverSuivi();
    expect(Carte.cible).toBe(null);
});

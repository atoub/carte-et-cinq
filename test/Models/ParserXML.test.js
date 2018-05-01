import React from 'react';
import ReactDOM from 'react-dom';
import ParserXML from '../../app/Models/ParserXML';
import Carte from '../../app/Models/Carte';
import Enzyme, { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

/**
 * Affectation des camions dans le state de l'objet CarteOL.
 */
let lesCamion;
let lesAppels;
beforeAll(done => {
    ParserXML.getCamions().then(function (p_camions) {
        lesCamion = p_camions;
        done();
    }).catch(function () {
        done();
    });
});

/**
 * Affectation des appels dans le state de l'objet CarteOL.
 */
beforeAll(done => {
    ParserXML.getAppels().then(function (p_appels) {
        lesAppels = p_appels;
        done();
    }).catch(function () {
        done();
    });
});

/**
 * Test pour savoir si les appels sont biens recus.
 */
test('test set des appels', () => {
    const expected = [{ 'camions': [320, 420, 666, 450], 'latitude': 45.296127, 'longitude': -73.269187, 'no': '1202', 'temps': '2018-04-13 13:13:13' }, { 'camions': [210, 438, 9026, 127], 'latitude': 45.326877, 'longitude': -73.275892, 'no': '1203', 'temps': '2018-04-13 13:13:14' }];
    expect(lesAppels).toEqual(expected);
});

/**
 * Test pour savoir si les camions sont biens recus.
 */
test('test set des camions', () => {
    const expected = { 'latitude': 45.2281681, 'longitude': -73.7791488, 'no': '239', 'statut': 'CASE', 'temps': '2017-02-01 13:09:00' };
    expect(lesCamion[100].no).toEqual(expected.no);
    expect(lesCamion[100].latitude).toEqual(expected.latitude);
    expect(lesCamion[100].longitude).toEqual(expected.longitude);
    expect(lesCamion[100].statut).toEqual(expected.statut);
    expect(lesCamion[100].temps).toEqual(expected.temps);

    expect(lesCamion.length).toEqual(118);
});


/**
 * Test pour vérifier si la fonction pour extraire les camions fonctionne.
 */
test('parserXML camions', () => {
    const camions = ParserXML.extraireCamions('<Camions>' +
        '<Camion>' +
        '<NoVehicule>120</NoVehicule>' +
        '<Time>2017-02-01 13:09:00</Time>' +
        '<Statut>CASE</Statut>' +
        '<Latitude>45.3613749000</Latitude>' +
        '<Longitude>-73.7421416000</Longitude>' +
        '</Camion>' +
        '<Camion>' +
        '<NoVehicule>220</NoVehicule>' +
        '<Time>2017-02-01 13:09:00</Time>' +
        '<Statut>IND</Statut>' +
        '<Latitude>45.3796941000</Latitude>' +
        '<Longitude>-73.5632882000</Longitude>' +
        '</Camion>' +
        '<Camion>' +
        '<NoVehicule>738</NoVehicule>' +
        '<Time>2017-02-01 13:09:00</Time>' +
        '<Statut>CASE</Statut>' +
        '<Latitude>45.0829958000</Latitude>' +
        '<Longitude>-73.3713498000</Longitude>' +
        '</Camion>' +
        '</Camions>');
    const expectedCamions = [{ 'latitude': 45.3613749, 'longitude': -73.7421416, 'no': '120', 'statut': 'CASE', 'temps': '2017-02-01 13:09:00' }, { 'latitude': 45.0829958, 'longitude': -73.3713498, 'no': '738', 'statut': 'CASE', 'temps': '2017-02-01 13:09:00' }];
    expect(camions[0].latitude).toEqual(expectedCamions[0].latitude);
    expect(camions[0].longitude).toEqual(expectedCamions[0].longitude);
    expect(camions[0].no).toEqual(expectedCamions[0].no);
    expect(camions[0].statut).toEqual(expectedCamions[0].statut);
    expect(camions[0].temps).toEqual(expectedCamions[0].temps);

    expect(camions[1].latitude).toEqual(expectedCamions[1].latitude);
    expect(camions[1].longitude).toEqual(expectedCamions[1].longitude);
    expect(camions[1].no).toEqual(expectedCamions[1].no);
    expect(camions[1].statut).toEqual(expectedCamions[1].statut);
    expect(camions[1].temps).toEqual(expectedCamions[1].temps);

});

/**
 * Test pour vérifier si la fonction pour extraire les appels fonctionne.
 */
test('parserXML appels', () => {
    const appels = ParserXML.extraireAppels('<Appels>' +
        '<Appel>' +
        '<NoAppel>1202</NoAppel>' +
        '<Time>2018-04-13 13:13:13</Time>' +
        '<Nature>Voiture</Nature>' +
        '<Latitude>45.3613749000</Latitude>' +
        '<Longitude>-73.7421416000</Longitude>' +
        '<Vehicules>' +
        '<noVehicule>210</noVehicule>' +
        '<noVehicule>438</noVehicule>' +
        '<noVehicule>666</noVehicule>' +
        '<noVehicule>450</noVehicule>' +
        '</Vehicules>' +
        '</Appel>' +
        '<Appel>' +
        '<NoAppel>1203</NoAppel>' +
        '<Time>2018-04-13 13:13:14</Time>' +
        '<Nature>Voiture</Nature>' +
        '<Latitude>45.3613749000</Latitude>' +
        '<Longitude>-73.7421416000</Longitude>' +
        '<Vehicules>' +
        '<noVehicule>210</noVehicule>' +
        '<noVehicule>438</noVehicule>' +
        '<noVehicule>666</noVehicule>' +
        '<noVehicule>450</noVehicule>' +
        '</Vehicules>' +
        '</Appel>' +
        '</Appels>');

    const expectedAppels = [{ 'camions': [210, 438, 666, 450], 'latitude': 45.3613749, 'longitude': -73.7421416, 'no': '1202', 'temps': '2018-04-13 13:13:13' }, { 'camions': [210, 438, 666, 450], 'latitude': 45.3613749, 'longitude': -73.7421416, 'no': '1203', 'temps': '2018-04-13 13:13:14' }];
    expect(appels).toEqual(expectedAppels);
});

import React from 'react';
import { configure, shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TestRenderer from 'react-test-renderer';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import * as ol from 'openlayers';
import { degreeEnRadian, angleEntrePoints } from '../../app/Models/Util.js';
import Route from '../../app/Models/Route';

configure({ adapter: new Adapter() });

// Nom du domaine qui héberge le serveur de MapQuest.
const domain = 'http://www.mapquestapi.com/directions/v2/route?key=';

// Une clé est indispensable pour y accéder.
const clé = 'RvWqiJmyJLQhePCgUXA4AyB6k9Mo0gAD';

// Coordonnées GPS de départ(latitude, longitude).
const de = '45.294100,-73.269931';

// Coordonnées GPS d'arrivée(latitude, longitude).
const vers = '45.305908,-73.252145';

// Spécifie dans quelle langue le résultat doit être envoyé.
const locale = 'locale=fr_CA';

const shape = 'fullShape=true';

const generalize = 'generalize=0';

// Url de la requête pour la route.
const url = `${domain}${clé}&from=${de}&to=${vers}&${locale}&${shape}&${generalize}`;

// Échantillon d'un JSON obtenu à partir du service en ligne.
const jsonValide = { 'route': { 'hasTollRoad': false, 'hasBridge': false, 'boundingBox': { 'lr': { 'lng': -73.265068, 'lat': 45.296028 }, 'ul': { 'lng': -73.269187, 'lat': 45.31113 } }, 'distance': 1.204, 'hasTunnel': false, 'hasHighway': false, 'computedWaypoints': [], 'routeError': { 'errorCode': -400, 'message': '' }, 'formattedTime': '00:03:21', 'sessionId': '5a7262b0-032c-993a-02b4-1daf-0a4911f36f4a', 'realTime': 311, 'hasSeasonalClosure': false, 'hasCountryCross': false, 'fuelUsed': 0.09, 'legs': [{ 'hasTollRoad': false, 'hasBridge': false, 'destNarrative': '', 'distance': 1.204, 'hasTunnel': false, 'hasHighway': false, 'index': 0, 'formattedTime': '00:03:21', 'origIndex': 2, 'hasSeasonalClosure': false, 'hasCountryCross': false, 'roadGradeStrategy': [[]], 'destIndex': -1, 'time': 201, 'hasUnpaved': false, 'origNarrative': 'Allez vers le nord sur Boul du Séminaire N/QC-223.', 'maneuvers': [{ 'distance': 0, 'streets': ['Rue Beauséjour'], 'narrative': 'Pour commencer, dirigez-vous vers le nord sur Rue Beauséjour.', 'turnType': 2, 'startPoint': { 'lng': -73.269187, 'lat': 45.296127 }, 'index': 0, 'formattedTime': '00:00:00', 'directionName': 'North', 'maneuverNotes': [], 'linkIds': [], 'signs': [], 'mapUrl': 'http://www.mapquestapi.com/staticmap/v5/map?key=Mhp1C4clxqQoaAIEblCPdoNvNC2WAW7N&size=225,160&locations=45.296127,-73.269187|marker-1||45.296130999999995,-73.269187|marker-2||&center=45.29612899999999,-73.269187&defaultMarker=none&zoom=15&rand=534114904&session=5a7262b0-032c-993a-02b4-1daf-0a4911f36f4a', 'transportMode': 'AUTO', 'attributes': 0, 'time': 0, 'iconUrl': 'http://content.mapquest.com/mqsite/turnsigns/icon-dirs-start_sm.gif', 'direction': 1 }, { 'distance': 0.045, 'streets': [], 'narrative': 'Tournez à droite.', 'turnType': 2, 'startPoint': { 'lng': -73.269187, 'lat': 45.296131 }, 'index': 1, 'formattedTime': '00:00:12', 'directionName': 'East', 'maneuverNotes': [], 'linkIds': [], 'signs': [], 'mapUrl': 'http://www.mapquestapi.com/staticmap/v5/map?key=Mhp1C4clxqQoaAIEblCPdoNvNC2WAW7N&size=225,160&locations=45.296130999999995,-73.269187|marker-2||45.296028,-73.268348|marker-3||&center=45.2960795,-73.2687675&defaultMarker=none&zoom=15&rand=534114904&session=5a7262b0-032c-993a-02b4-1daf-0a4911f36f4a', 'transportMode': 'AUTO', 'attributes': 0, 'time': 12, 'iconUrl': 'http://content.mapquest.com/mqsite/turnsigns/rs_right_sm.gif', 'direction': 8 }, { 'distance': 1.12, 'streets': ['Boul du Séminaire N', 'QC-223'], 'narrative': 'Entrez dans le prochain carrefour giratoire et prenez la 1ère sortie vers Boul du Séminaire N/QC-223.', 'turnType': 1, 'startPoint': { 'lng': -73.268348, 'lat': 45.296028 }, 'index': 2, 'formattedTime': '00:03:03', 'directionName': 'North', 'maneuverNotes': [], 'linkIds': [], 'signs': [{ 'extraText': '', 'text': '223', 'type': 22, 'url': 'http://icons.mqcdn.com/icons/rs22.png?n=223', 'direction': 0 }], 'mapUrl': 'http://www.mapquestapi.com/staticmap/v5/map?key=Mhp1C4clxqQoaAIEblCPdoNvNC2WAW7N&size=225,160&locations=45.296028,-73.268348|marker-3||45.31113,-73.265068|marker-4||&center=45.303579,-73.266708&defaultMarker=none&zoom=9&rand=533730155&session=5a7262b0-032c-993a-02b4-1daf-0a4911f36f4a', 'transportMode': 'AUTO', 'attributes': 0, 'time': 183, 'iconUrl': 'http://content.mapquest.com/mqsite/turnsigns/rs_slight_right_sm.gif', 'direction': 1 }, { 'distance': 0.039, 'streets': ['Boul du Séminaire N', 'QC-223'], 'narrative': 'Faites demi-tour pour prendre Boul du Séminaire N/QC-223.', 'turnType': 9, 'startPoint': { 'lng': -73.265068, 'lat': 45.31113 }, 'index': 3, 'formattedTime': '00:00:06', 'directionName': 'South', 'maneuverNotes': [], 'linkIds': [], 'signs': [{ 'extraText': '', 'text': '223', 'type': 22, 'url': 'http://icons.mqcdn.com/icons/rs22.png?n=223', 'direction': 0 }], 'mapUrl': 'http://www.mapquestapi.com/staticmap/v5/map?key=Mhp1C4clxqQoaAIEblCPdoNvNC2WAW7N&size=225,160&locations=45.31113,-73.265068|marker-4||45.31071,-73.265197|marker-5||&center=45.310919999999996,-73.26513249999999&defaultMarker=none&zoom=15&rand=533730155&session=5a7262b0-032c-993a-02b4-1daf-0a4911f36f4a', 'transportMode': 'AUTO', 'attributes': 0, 'time': 6, 'iconUrl': 'http://content.mapquest.com/mqsite/turnsigns/rs_uturn_left_sm.gif', 'direction': 4 }, { 'distance': 0, 'streets': [], 'narrative': '372 BOUL DU SéMINAIRE N se trouve à gauche.', 'turnType': -1, 'startPoint': { 'lng': -73.265197, 'lat': 45.31071 }, 'index': 4, 'formattedTime': '00:00:00', 'directionName': '', 'maneuverNotes': [], 'linkIds': [], 'signs': [], 'transportMode': 'AUTO', 'attributes': 0, 'time': 0, 'iconUrl': 'http://content.mapquest.com/mqsite/turnsigns/icon-dirs-end_sm.gif', 'direction': 0 }], 'hasFerry': false }], 'options': { 'arteryWeights': [], 'cyclingRoadFactor': 1, 'timeType': 0, 'useTraffic': false, 'returnLinkDirections': false, 'countryBoundaryDisplay': true, 'enhancedNarrative': false, 'locale': 'fr_CA', 'tryAvoidLinkIds': [], 'drivingStyle': 2, 'doReverseGeocode': true, 'generalize': -1, 'mustAvoidLinkIds': [], 'sideOfStreetDisplay': true, 'routeType': 'FASTEST', 'avoidTimedConditions': false, 'routeNumber': 0, 'shapeFormat': 'raw', 'maxWalkingDistance': -1, 'destinationManeuverDisplay': true, 'transferPenalty': -1, 'narrativeType': 'text', 'walkingSpeed': -1, 'urbanAvoidFactor': -1, 'stateBoundaryDisplay': true, 'unit': 'M', 'highwayEfficiency': 22, 'maxLinkId': 0, 'maneuverPenalty': -1, 'avoidTripIds': [], 'filterZoneFactor': -1, 'manmaps': 'true' }, 'locations': [{ 'dragPoint': false, 'displayLatLng': { 'lng': -73.268737, 'lat': 45.297377 }, 'adminArea4': 'Le Haut-Richelieu', 'adminArea5': 'Saint-Jean-sur-Richelieu', 'postalCode': 'J3B', 'adminArea1': 'CA', 'adminArea3': 'QC', 'type': 's', 'sideOfStreet': 'R', 'geocodeQualityCode': 'L1AAA', 'adminArea4Type': 'County', 'linkId': 32156345, 'street': '99 Rue Beauséjour', 'adminArea5Type': 'City', 'geocodeQuality': 'ADDRESS', 'adminArea1Type': 'Country', 'adminArea3Type': 'State', 'latLng': { 'lng': -73.268737, 'lat': 45.297377 } }, { 'dragPoint': false, 'displayLatLng': { 'lng': -73.265641, 'lat': 45.310576 }, 'adminArea4': 'Le Haut-Richelieu', 'adminArea5': 'Saint-Jean-sur-Richelieu', 'postalCode': 'J3B', 'adminArea1': 'CA', 'adminArea3': 'QC', 'type': 's', 'sideOfStreet': 'L', 'geocodeQualityCode': 'L1AAA', 'adminArea4Type': 'County', 'linkId': 31991647, 'street': '372 Boul du Séminaire N', 'adminArea5Type': 'City', 'geocodeQuality': 'ADDRESS', 'adminArea1Type': 'Country', 'adminArea3Type': 'State', 'latLng': { 'lng': -73.265641, 'lat': 45.310576 } }], 'time': 201, 'hasUnpaved': false, 'locationSequence': [0, 1], 'hasFerry': false }, 'info': { 'statuscode': 0, 'copyright': { 'imageAltText': '© 2018 MapQuest, Inc.', 'imageUrl': 'http://api.mqcdn.com/res/mqlogo.gif', 'text': '© 2018 MapQuest, Inc.' }, 'messages': [] } };

// Échantillon du JSON décomposé pour n'avoir que les maneuvres.
const jsonManeuvre = [{ 'distance': 0, 'streets': ['Rue Beauséjour'], 'narrative': 'Pour commencer, dirigez-vous vers le nord sur Rue Beauséjour.', 'turnType': 2, 'startPoint': { 'lng': -73.269187, 'lat': 45.296127 }, 'index': 0, 'formattedTime': '00:00:00', 'directionName': 'North', 'maneuverNotes': [], 'linkIds': [], 'signs': [], 'mapUrl': 'http://www.mapquestapi.com/staticmap/v5/map?key=Mhp1C4clxqQoaAIEblCPdoNvNC2WAW7N&size=225,160&locations=45.296127,-73.269187|marker-1||45.296130999999995,-73.269187|marker-2||&center=45.29612899999999,-73.269187&defaultMarker=none&zoom=15&rand=534114904&session=5a7262b0-032c-993a-02b4-1daf-0a4911f36f4a', 'transportMode': 'AUTO', 'attributes': 0, 'time': 0, 'iconUrl': 'http://content.mapquest.com/mqsite/turnsigns/icon-dirs-start_sm.gif', 'direction': 1 }, { 'distance': 0.045, 'streets': [], 'narrative': 'Tournez à droite.', 'turnType': 2, 'startPoint': { 'lng': -73.269187, 'lat': 45.296131 }, 'index': 1, 'formattedTime': '00:00:12', 'directionName': 'East', 'maneuverNotes': [], 'linkIds': [], 'signs': [], 'mapUrl': 'http://www.mapquestapi.com/staticmap/v5/map?key=Mhp1C4clxqQoaAIEblCPdoNvNC2WAW7N&size=225,160&locations=45.296130999999995,-73.269187|marker-2||45.296028,-73.268348|marker-3||&center=45.2960795,-73.2687675&defaultMarker=none&zoom=15&rand=534114904&session=5a7262b0-032c-993a-02b4-1daf-0a4911f36f4a', 'transportMode': 'AUTO', 'attributes': 0, 'time': 12, 'iconUrl': 'http://content.mapquest.com/mqsite/turnsigns/rs_right_sm.gif', 'direction': 8 }, { 'distance': 1.12, 'streets': ['Boul du Séminaire N', 'QC-223'], 'narrative': 'Entrez dans le prochain carrefour giratoire et prenez la 1ère sortie vers Boul du Séminaire N/QC-223.', 'turnType': 1, 'startPoint': { 'lng': -73.268348, 'lat': 45.296028 }, 'index': 2, 'formattedTime': '00:03:03', 'directionName': 'North', 'maneuverNotes': [], 'linkIds': [], 'signs': [{ 'extraText': '', 'text': '223', 'type': 22, 'url': 'http://icons.mqcdn.com/icons/rs22.png?n=223', 'direction': 0 }], 'mapUrl': 'http://www.mapquestapi.com/staticmap/v5/map?key=Mhp1C4clxqQoaAIEblCPdoNvNC2WAW7N&size=225,160&locations=45.296028,-73.268348|marker-3||45.31113,-73.265068|marker-4||&center=45.303579,-73.266708&defaultMarker=none&zoom=9&rand=533730155&session=5a7262b0-032c-993a-02b4-1daf-0a4911f36f4a', 'transportMode': 'AUTO', 'attributes': 0, 'time': 183, 'iconUrl': 'http://content.mapquest.com/mqsite/turnsigns/rs_slight_right_sm.gif', 'direction': 1 }, { 'distance': 0.039, 'streets': ['Boul du Séminaire N', 'QC-223'], 'narrative': 'Faites demi-tour pour prendre Boul du Séminaire N/QC-223.', 'turnType': 9, 'startPoint': { 'lng': -73.265068, 'lat': 45.31113 }, 'index': 3, 'formattedTime': '00:00:06', 'directionName': 'South', 'maneuverNotes': [], 'linkIds': [], 'signs': [{ 'extraText': '', 'text': '223', 'type': 22, 'url': 'http://icons.mqcdn.com/icons/rs22.png?n=223', 'direction': 0 }], 'mapUrl': 'http://www.mapquestapi.com/staticmap/v5/map?key=Mhp1C4clxqQoaAIEblCPdoNvNC2WAW7N&size=225,160&locations=45.31113,-73.265068|marker-4||45.31071,-73.265197|marker-5||&center=45.310919999999996,-73.26513249999999&defaultMarker=none&zoom=15&rand=533730155&session=5a7262b0-032c-993a-02b4-1daf-0a4911f36f4a', 'transportMode': 'AUTO', 'attributes': 0, 'time': 6, 'iconUrl': 'http://content.mapquest.com/mqsite/turnsigns/rs_uturn_left_sm.gif', 'direction': 4 }, { 'distance': 0, 'streets': [], 'narrative': '372 BOUL DU SéMINAIRE N se trouve à gauche.', 'turnType': -1, 'startPoint': { 'lng': -73.265197, 'lat': 45.31071 }, 'index': 4, 'formattedTime': '00:00:00', 'directionName': '', 'maneuverNotes': [], 'linkIds': [], 'signs': [], 'transportMode': 'AUTO', 'attributes': 0, 'time': 0, 'iconUrl': 'http://content.mapquest.com/mqsite/turnsigns/icon-dirs-end_sm.gif', 'direction': 0 }];

// Ce que les textes seulement devraient être.
const arrayTexte = ['Pour commencer, dirigez-vous vers le nord sur Rue Beauséjour.', 'Tournez à droite.', 'Entrez dans le prochain carrefour giratoire et prenez la 1ère sortie vers Boul du Séminaire N/QC-223.', 'Faites demi-tour pour prendre Boul du Séminaire N/QC-223.', '372 BOUL DU SéMINAIRE N se trouve à gauche.'];

// Un JSON cassé.
const jsonInvalide = 'test1';

configure({ adapter: new Adapter() });

Route.demanderNouveauTrajet(de, vers);

describe('Fonctions pour parse le json', () => {
    it('Devrait ne pas avoir de coordonnées valides', () => {
        expect(Route.obtenirManeuvres(jsonInvalide)).toBe(null);
    });

    it('Devrait avoir des coordonnées valides', () => {
        // Le Json sera la partie 'maneuvers' de tous les legs du service en ligne
        expect(Route.obtenirManeuvres(jsonValide)).toEqual(jsonManeuvre);
    });
});

describe('Fonction pour obtenir les valeurs d\'un param dans maneuvers', () => {
    it('Devrait retourner null dans le cas d\'un JSON invalide', () => {
        expect(Route.obtenirInfoManeuvres(jsonInvalide, 'narrative')).toBe(null);
    });

    it('Devrait retourner null dans le cas d\'une clé inexistante', () => {
        expect(Route.obtenirInfoManeuvres(jsonManeuvre, 'clePasBonne')).toBe(null);
    });

    it('Devrait retourner un objet de textes (la route à suivre) avec la clé \'narrative', () => {
        expect(Route.obtenirInfoManeuvres(jsonManeuvre, 'narrative')).toEqual(arrayTexte);
    });
});

describe('Test pour l\'obtention de la route de chez MapQuest', () => {
    it('devrait retourner un appel de route valide', done => {
        const mock = new MockAdapter(axios);
        const donnees = { response: true };
        mock.onGet(url).reply(200, donnees);

        axios.get(url).then(function (response) {
            expect(response.data).toEqual(donnees);
            done();
        });
    });
});

describe('Test pour le calcul d\'angle a partir de 2 point', () => {
    it('devrait retourner un angle converti valide', () => {
        const valeurDeg = 90;
        const valeurRad = 1.5708;
        expect(degreeEnRadian(valeurDeg)).toBeCloseTo(valeurRad, 2);
    });
});

describe('Test pour le calcul d\'angle a partir de 2 point', () => {
    it('devrait retourner un angle entre 0 et 2 pi', () => {
        const points = [[45.3064, -73.2809], [45.3064, -73.2800]];
        expect(angleEntrePoints(points[0], points[1])).toBeCloseTo(Math.PI * 2, 2);
    });
});

describe('Fonctions pour récupérer la distance totale', () => {
    it('Devrait ne pas avoir de distance valide', () => {
        const distanceInvalide = 1.304;
        expect(Route.obtenirDistanceOuTempsTotal(jsonValide, 'distance')).not.toBe(distanceInvalide);
    });

    it('Devrait avoir une distance valide', () => {
        // Distance réelle de notre route
        const distanceValide = 1.204;
        expect(Route.obtenirDistanceOuTempsTotal(jsonValide, 'distance')).toBe(distanceValide);
    });
});

describe('Fonctions pour récupérer le temps total', () => {
    it('Devrait ne pas avoir de temps valide', () => {
        const tpsValide = 301;
        expect(Route.obtenirDistanceOuTempsTotal(jsonValide, 'time')).not.toBe(null);
    });

    it('Devrait avoir un temps valide', () => {
        // Temps réel de notre route
        const tpsValide = 201;
        expect(Route.obtenirDistanceOuTempsTotal(jsonValide, 'time')).toBe(tpsValide);
    });
});

describe('Test afficher message pertinent', () => {
    // Forme de route pour test
    const forme = [
        [-73.269172, 45.294208],
        [-73.268165, 45.294208],
        [-73.268165, 45.294208],
        [-73.268127, 45.294528],
        [-73.268142, 45.294868],
        [-73.268127, 45.295669],
        [-73.268127, 45.295669],
        [-73.266685, 45.295654],
        [-73.266456, 45.295692],
        [-73.266456, 45.295692],
        [-73.266464, 45.296173],
        [-73.266487, 45.297023],
        [-73.266487, 45.297126],
        [-73.26651, 45.298019],
        [-73.266532, 45.298908],
        [-73.266563, 45.299816],
        [-73.266571, 45.300651],
    ];

    // Indices de directives pour test
    const directives = [2, 3, 5, 8, 9, 10];

    const narration = ['narration 1', 'narration 2', 'narration 3', 'narration 4', 'narration 5'];

    it('devrait retourner l\'indice de la prochaine directive', () => {
        const positionActuelle = forme[0];
        expect(Route.obtenirDirectivePointSuivant(positionActuelle, directives, forme)).toEqual(0);
    });

    it('devrait retourner un objet possédant la prochaine directive, les trois suivante ainsi que toutes les autres', () => {
        expect(Route.afficherEtapesSuivantes(forme[0], forme, directives, narration).narratifActuel).toEqual('narration 1');
    });
});

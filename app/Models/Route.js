import axios from 'axios';
import Carte from '../Models/Carte';
import MapAnim from '../Models/MapAnim';
import { trouverProchainPoint, angleEntrePoints, calculDistanceCoordonnees } from '../Models/Util';
import { MAPQUEST_KEY, MAPQUEST_LANG } from '../Models/Env.js';

// Nom du domaine qui héberge le serveur de MapQuest
const domaine = 'http://www.mapquestapi.com/directions/v2/route?key=';
const domaineShape = 'http://www.mapquestapi.com/directions/v2/routeshape?key=';

// Une clé est indispensable pour y accéder
const cle = MAPQUEST_KEY;

// Spécifie dans quelle langue le résultat doit être envoyé
const locale = 'locale=' + MAPQUEST_LANG;

// option MapQuest de reverseGeocoding
const geo = 'doReverseGeocode=false';

const shape = 'fullShape=true';

let _instance = null; // Instance de Carte

/**
 * Classe qui concerne les informations de la route à suivre.
 * Fait le: 2018/02/13
 * @author Érik Béland & Steve Morin
 */
class Route {
    /**
     * Constructeur de Route
     * @constructor
     */
    constructor() {
        if (!_instance) {
            _instance = this;
        } else {
            return _instance;
        }

        this.forme = [];
        this.directives = [];
        this.manoeuvres = [];
        this.narration = [];
        this.indexRendu = 0;
        this.indexPrecedent = 0;
        this.boundingBox = []; // Sous forme [lr:{lng:number, lat:number}, ul:{lng:number, lat:number}]
        this.positionActuelle = 0;
        this.icones = [];
        this.distancesNarration = [];

        this.enumIcone = {
            0: 'avant',
            1: 'leger-droite',
            2: 'droite',
            3: 'prononce-droite',
            4: 'marche-arriere',
            5: 'prononce-gauche',
            6: 'gauche',
            7: 'leger-gauche',
            8: 'u-turn-droite',
            9: 'u-turn-gauche',
            10: 'fusion-droite',
            11: 'fusion-gauche',
            12: 'rampe-droite',
            13: 'rampe-gauche',
            14: 'quitter-rampe-droite',
            15: 'quitter-rampe-gauche',
            16: 'fourche-droite',
            17: 'fourche-gauche',
            18: 'fourche-avant',
            19: 'transit',
            20: 'transfert-transit',
            21: 'port-transit',
            22: 'entrer-transit',
            23: 'quitter-transit',
            '-1': 'arrivee-directives',
        };

        this.positionActuelle = [];
        this.positionPrecedente = [];
        this.indiceNarratifActuel = 0;

        return _instance;
    }

    getDistanceParPoint() {
        return this.distancesNarration;
    }

    /**
     * Permet de demander un nouveau trajet en faisant une requête au service en ligne.
     * @param {string} p_coordDepart Coordonnée de départ.
     * @param {string} p_coordArrivee Coordonnée d'arrivée.
     * @returns {void}
     */
    demanderNouveauTrajet(p_coordDepart, p_coordArrivee) {

        // Url de la requête pour la route
        const url = `${domaine}${cle}&from=${p_coordDepart}&to=${p_coordArrivee}&${locale}&${geo}`;
        const self = this;
        // Pour obtenir les données du service en ligne
        return axios.get(url.toString()).then((p_reponse) => {
            self.indexRendu = 0;
            self.maneuvres = [];
            self.forme = [];
            self.directives = [];
            self.narration = self.obtenirInfoManeuvres(self.obtenirManeuvres(p_reponse.data), 'narrative');
            self.icones = self.obtenirInfoManeuvres(self.obtenirManeuvres(p_reponse.data), 'turnType');
            self.distancesNarration = self.obtenirInfoManeuvres(self.obtenirManeuvres(p_reponse.data), 'distance');
            self.narratifs = self.afficherEtapesSuivantes(self.forme[0], self.forme, self.directives, self.narration);
            self.distanceTotale = self.route.distance;
            self.boundingBox = p_reponse.data.route.boundingBox;
            self.route = p_reponse.data;
            const status = self.route.info;

            if (status.hasOwnProperty('statuscode') && self.route.info.statuscode === 0) {
                self.sessionId = self.route.route.sessionId;

                return self.sessionId;
            }
        });
    }

    /**
     * Fonction pour obtenir la forme d'un traget.
     * @param {string} p_sessionId Coordonnée d'arrivée.
     * @returns {Object} informations du trajet
     */
    obtenirFormeTrajet(p_sessionId) {
        const self = this;
        const urlForme = `${domaineShape}${cle}&sessionId=${p_sessionId}&${shape}`;

        let taille = 0;

        return axios.get(urlForme.toString()).then((p_reponse) => {
            self.forme = [];
            self.directives = [];

            const formeRoute = p_reponse.data;

            taille = formeRoute.route.shape.shapePoints.length;

            for (let i = 0; i < taille - 1; i += 2) {
                self.forme.push([formeRoute.route.shape.shapePoints[i + 1], formeRoute.route.shape.shapePoints[i]]);
            }

            const tailleDirectives = formeRoute.route.shape.maneuverIndexes.length;

            for (let i = 0; i < tailleDirectives; i++) {
                self.directives.push(formeRoute.route.shape.maneuverIndexes[i]);
            }

            if (self.forme.length > 1 && Carte.getTurnByTurn()) {
                Carte.getView().cancelAnimations();
                MapAnim.centrerSurMonCamion();
                MapAnim.setAngleRotation(angleEntrePoints(self.forme[0], self.forme[1]));
            }

            return {
                indicesDirectives: self.directives,
                forme: self.forme,
                narration: self.narration,
            };
        });
    }

    /**
     * Cette fonction permet d'obtenir le paramètre la section des coordonnées
     * et des étapes à suivre en texte de la route obtenue via un service en ligne.
     * Pour l'instant, cette fonction est basée sur le JSON obtenue de Mapquest.
     * @param {JSON} p_jsonDeBase Le JSON brut obtenu du service en ligne.
     * @return {JSON} le array des maneuvres. Null si les coordonnées ne sont pas récuperables.
     */
    obtenirManeuvres(p_jsonDeBase) {
        // Valider que le début de la structure possède la bonne clé
        if (Object.prototype.hasOwnProperty.call(p_jsonDeBase, 'route')) {
            this.route = p_jsonDeBase.route;

            if (Object.prototype.hasOwnProperty.call(this.route, 'legs')) {
                const legs = this.route.legs;

                this.manoeuvres = [];

                for (let i = 0; i < legs.length; i += 1) {
                    for (let j = 0; j < legs[i].maneuvers.length; j += 1) {
                        this.manoeuvres.push(legs[i].maneuvers[j]);
                    }
                }

                return this.manoeuvres;
            }
        }

        return null;
    }

    /**
     * Permet d'obtenir les informations du noeud "maneuvers" à partir d'une clé donnée
     * Voici une liste de clés valides qui sont utiles :
     *     - narrative
     *     - startPoint
     *     - streets
     *     - Direction (1 = Nord, 2 = Est , 3 = Ouest, 4 = Sud)
     *     - iconUrl
     *     - turnType (Un enum sera à faire puisque la donnée n'est qu'un chiffre)
     * @param {Objet} p_jsonManoeuvres L'objet obtenu à partir du json de base.
     * @param {string} p_cle La clé de l'information à accéder dans le noeud "maneuvers" (mapquest).
     * @returns {Object} Les informations dans le cas d'un succès ou null à l'échec.
     */
    obtenirInfoManeuvres(p_jsonManoeuvres, p_cle) {
        /* Il est nécessaire de vérifier si le JSON est le bon (lui formatté par la fonction
        obtenirManeuvres). */
        if (Array.isArray(p_jsonManoeuvres) && p_jsonManoeuvres.length !== 0 &&
            Object.prototype.hasOwnProperty.call(p_jsonManoeuvres[0], p_cle)) {
            this.tousLesTextes = [];

            for (let i = 0; i < p_jsonManoeuvres.length; i += 1) {
                this.tousLesTextes.push(p_jsonManoeuvres[i][p_cle]);
            }

            return this.tousLesTextes;
        }

        return null;
    }

    /**
     * Permet d'obtenir la distance ou le temps total de la route (distance du point A au point B)
     * à partir de la clé 'distance' ou 'time'.
     * @param {Objet} p_jsonDeBase L'objet json de base.
     * @param {string} p_cle La clé de l'information à accéder dans la route (mapquest).
     * @returns {number} La distance totale ou le temps total pour se rendre de A à B.
     */
    obtenirDistanceOuTempsTotal(p_jsonDeBase, p_cle) {
        if (p_jsonDeBase.hasOwnProperty('route')) {
            const route = p_jsonDeBase.route;
            if (route.hasOwnProperty(p_cle)) {
                this.propriete = route[p_cle];
            }

            return this.propriete;
        }

        return null;
    }

    /**
     * @desc Permet de distribués les prochaines directives pour les préparer à l'affichage.
     * @param {array} p_positonActuelle La position actuelle [lon, lat].
     * @param {array} p_formeRoute Tableau de toutes les coordonnées de la route.
     * @param {array} p_tableauIndiceDirectives Tableau des indices de directives.
     * @param {array} p_tableauNarration Tableau de tous les textes de narrations.
     * @returns {Object} Un objet avec le narratif actuel, les 3 prochains narratifs
     * ainsi que toutes les autres narratifs n'incluant pas l'actuel.
     */
    afficherEtapesSuivantes(p_positonActuelle, p_formeRoute, p_tableauIndiceDirectives, p_tableauNarration) {
        const pointSuivant = this.obtenirDirectivePointSuivant(p_positonActuelle, p_tableauIndiceDirectives, p_formeRoute);
        const listeNarrative = [];
        const listeNarrationComplete = [];
        const listeIcons = [];

        for (let i = 1; i <= 3; i += 1) {
            if (p_tableauNarration[pointSuivant + i] != null) {
                listeNarrative.push(p_tableauNarration[pointSuivant + i]);
            }
        }

        for (let i = 1; i <= p_tableauNarration.length; i++) {
            if (p_tableauNarration[pointSuivant + i] != null) {
                listeNarrationComplete.push(p_tableauNarration[pointSuivant + i]);
                listeIcons.push(this.enumIcone[this.icones[pointSuivant + i]]);
            }
        }

        this.indiceNarratifActuel = pointSuivant;

        return {
            narratifActuel: p_tableauNarration[pointSuivant],
            icon: this.enumIcone[this.icones[pointSuivant]],
            listeProchainsIcons: listeIcons,
            narratifsSuivants: listeNarrative,
            narratifComplet: listeNarrationComplete,
        };
    }

    /**
     * @desc Cette fonction permet d'obtenir la directive concernant le point le proche
     * par rapport à la position du camion.
     * @param {array} p_positionActuelle position du camion [lon, lat].
     * @param {array} p_tableauDirectives Tableau des indices des directives.
     * @param {array} p_tableauRoute contient les points de la route.
     * @returns {number} L'indice de la prochaine directive.
     */
    obtenirDirectivePointSuivant(p_positionActuelle, p_tableauDirectives, p_tableauRoute) {
        const pointLePlusProche = trouverProchainPoint(p_positionActuelle, p_tableauRoute);

        for (let i = 0; i < p_tableauDirectives.length; i += 1) {
            if (p_tableauDirectives[i] >= pointLePlusProche) {
                return i;
            }
        }

        return 0;
    }

    /**
     * @desc Permet d'obtenir la distance parcourue au point donnée.
     * @param {Number} p_indicePositionActuelle L'indice de la position actuelle.
     * @param {Number} p_indicePositionPrecedente L'indice de la position avant l'actuelle.
     * @param {Array} p_tableauRoute Le tableau de la route.
     * @returns {Number} La distance parcourue calculée.
     */
    calculerDistanceParcourue(p_indicePositionActuelle, p_indicePositionPrecedente, p_tableauRoute) {
        const positionActuelle = p_tableauRoute[p_indicePositionActuelle];
        const positionSuivante = p_tableauRoute[p_indicePositionActuelle + 1];
        let distance;

        if (p_indicePositionActuelle > p_indicePositionPrecedente) {
            if (p_indicePositionActuelle < p_tableauRoute.length - 1) {
                distance = calculDistanceCoordonnees(positionActuelle, positionSuivante);
            }

            if (!isNaN(distance)) {
                return distance;
            }
        }

        return 0;
    }

    /**
     * @desc Permet de calculer la distance totale que le trajet va prendre.
     * @param {Array} p_tableauRoute le tableau de la route.
     * @param {Boolean} p_pourProchaineDirective Si le calcul est pour jusqu'à la prochaine directive. False par défaut.
     * @returns {Number} La distance totale calculée.
     */
    calculerDistanceTotale(p_tableauRoute, p_pourProchaineDirective = false) {
        let distanceTotale = 0;
        let test = 0;
        const indice = p_pourProchaineDirective ? this.directives[this.indiceNarratifActuel] : p_tableauRoute.length;
        for (let i = 0; i < indice - 1; i++) {
            test = this.calculerDistanceParcourue(i, i == 0 ? i : i - 1, p_tableauRoute);
            distanceTotale += test;
        }

        return distanceTotale;
    }

    /**
     * @desc Met a jour les indices et coordonnées
     * @param {Array} p_positionActuelle La position actuelle.
     * @param {Boolean} p_positionPrecedente La position prédèdente.
     * @returns {void}
     */
    miseAJourIndicesEtCoordonnees(p_positionActuelle, p_positionPrecedente) {
        this.positionActuelle = p_positionActuelle;
        this.positionPrecedente = p_positionPrecedente;
        this.indexPrecedent = trouverProchainPoint(p_positionPrecedente, this.forme);
        this.indexRendu = trouverProchainPoint(p_positionActuelle, this.forme);
    }
}

export default new Route;

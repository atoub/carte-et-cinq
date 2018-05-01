import * as ol from 'openlayers';
import lineString from 'turf-linestring';
import $ from 'jquery';

// Angle de la moitié d'un cercle
const ANGLE_MOITIE_CERCLE = 180;

// Conversion mile nautique en mile
const MILES_NAUTIQUE = 1.1515;

// Conversion miles en km
const MILES_EN_KM = 1.609344;

// Nombre de minutes dans un degré
const NB_MINUTES_DEGRE = 60;

/**
 * Affiche un popup du niveau de zoom choisi
 * @param {number} zoom le niveau de zoom du mode tout-par-tour
 * @return {void}
 */
export const afficherZoom = (zoom) => {
    let zoomTXT;

    switch (zoom) {
    case 15: zoomTXT = '25 %'; break;
    case 16: zoomTXT = '50 %'; break;
    case 17: zoomTXT = '75 %'; break;
    default: zoomTXT = '100 %'; break;
    }

    afficherPopup('Niveau de zoom à : ' + zoomTXT, 1000);
};

/**
 * Fonction qui parse une query string en objet javascript.
 * @param {string} p_queryString La query string à parser.
 * @returns {Object} La query string en objet javascript.
 */
export const parseQuery = (p_queryString) => {
    const query = {};
    const pairs = (p_queryString[0] === '?' ? p_queryString.substr(1) : p_queryString).split('&');
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
};

/**
 * Fonction qui retourne une coordonnée ol.Coordinate a partir d'une longitude
 * et une latitude.
 * @param {number} p_lon La longitude de la position.
 * @param {number} p_lat La latitude de la position.
 * @returns {ol.Coordinate} La coordonnée.
 */
export const getProjFromLonLat = (p_lon, p_lat) => {
    return ol.proj.fromLonLat([p_lon, p_lat]);
};

/**
 * Calcule une clé pour une requête à Bing pour avoir les informations sur le traffic.
 * Fait le: 2018/02/16
 * @param {number} p_x Coordonée X de la tuile.
 * @param {number} p_y Coordonée Y de la tuile.
 * @param {number} p_z Coordonée Z de la tuile.
 * @returns {number} Quadkey identifier pour la requête à Bing.
 */
export const computeQuadKey = (p_x, p_y, p_z) => {
    const quadKeyDigits = [];

    for (let i = p_z; i > 0; i--) {
        let digit = 0;
        const mask = 1 << i - 1;

        if ((p_x & mask) != 0) {
            digit++;
        }
        if ((p_y & mask) != 0) {
            digit = digit + 2;
        }

        quadKeyDigits.push(digit);
    }
    return quadKeyDigits.join('');
};

/**
 * Permet d'ajouter un cookie.
 * @param {string} p_nom Nom du cookie.
 * @param {string} p_valeur Valeur du cookie.
 * @returns {void}
 */
export const setCookie = (p_nom, p_valeur) => {
    const nbJours = 1000;
    const date = new Date();
    date.setTime(date.getTime() + nbJours * 24 * 60 * 60 * 1000);
    const expiration = '; expires=' + date.toUTCString();
    document.cookie = p_nom + '=' + p_valeur + expiration + '; path=/';
};

/**
 * Permet d'obtenir la valeur d'un cookie.
 * @param {string} p_nom Nom du cookie
 * @returns {boolean | string} La valeur en texte ou en bool.
 */
export const getCookie = (p_nom) => {
    const nom = p_nom + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const listeCookie = decodedCookie.split(';');

    for (let i = 0; i < listeCookie.length; i++) {
        let cookie = listeCookie[i];

        // Enlève le cookie de la string s'il n'est pas bon.
        if (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }

        if (cookie.indexOf(nom) == 0) {
            let valeur = cookie.substring(nom.length, cookie.length);
            const valeurEstBoolean = valeur.indexOf('true') == 0 || valeur.indexOf('false') == 0;

            if (valeurEstBoolean) {
                valeur = valeur == 'true' ? true : false;
            }

            return valeur;
        }
    }
    return '';
};

/**
 * Retire un cookie en mettant un date antérieure.
 * @param {*} p_nom Nom du cookie.
 * @returns {void}
 */
export const retirerCookie = (p_nom) => {
    document.cookie = p_nom + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

/**
 * Change le message affiché dans la barre d'information.
 * @param {string} p_txt Message à afficher à l'utilisateur.
 * @returns {void}
 */
export const setLabelMsg = (p_txt) => {
    $('#barInformation .donneeMessage').text(p_txt);
};

/**
 * Fait afficher un popup avec le text et le delai désiré.
 * @param {string} p_txt Message à afficher à l'utilisateur.
 * @param {number} p_time Temp que le message reste à l'écran
 * @returns {void}
 */
export const afficherPopup = (p_txt, p_time) => {
    $('#messageNotification').stop(true);
    $('#messageNotification div p:first').text(p_txt);
    $('#messageNotification').fadeIn(200).delay(p_time).fadeOut(1000);
};

/**
 * Change le numéro du camion affiché dans la barre d'information.
 * Affiche un autre message si aucun camion n,est sélectionné.
 * @param {number} p_camion Numéro du camion sélectionné.
 * @returns {void}
 */
export const setLabelCamion = (p_camion) => {
    $('#barInformation .donneeCamion').text(p_camion ? 'Camion #' + p_camion : 'Sélectionnez un camion...');
};

/**
 * Change les coordonées affichées dans la barre d'information.
 * @param {number} p_lon Longitude du camion sélectionné.
 * @param {number} p_lat Latitude du camion sélectionné.
 * @returns {void}
 */
export const setLabelCoord = (p_lon, p_lat) => {
    $('#barInformation .donneeCoordonees').text(p_lon && p_lat ? '( ' + p_lat + ', ' + p_lon + ' )' : '');
};

/**
* @desc Convertit une valeur en degrée en valeur en radian.
* @param {double} p_valeur Une valeur en degrée.
* @returns {double} La valeur en radian.
*/
export const degreeEnRadian = (p_valeur) => {
    return p_valeur * Math.PI / ANGLE_MOITIE_CERCLE;
};

/**
* @desc Calcule l'angle entre deux coordonnées.
* @param {array} p_premierPoint Coordonnée premier point.
* @param {array} p_secondPoint Coordonnées deuxième point.
* @returns {double} L'angle entre deux points en radian.
*/
export const angleEntrePoints = (p_premierPoint, p_secondPoint) => {
    // Converti toute les latitudes/longitudes de nos points en radian
    const premierPointLong = degreeEnRadian(p_premierPoint[0]);
    const premierPointLat = degreeEnRadian(p_premierPoint[1]);
    const secondPointLong = degreeEnRadian(p_secondPoint[0]);
    const secondPointLat = degreeEnRadian(p_secondPoint[1]);

    // Calcule l'angle
    const longitude = secondPointLong - premierPointLong;
    const coordinateY = Math.sin(longitude) * Math.cos(secondPointLat);
    const coordinateX = Math.cos(premierPointLat) * Math.sin(secondPointLat) - Math.sin(premierPointLat) * Math.cos(secondPointLat) * Math.cos(longitude);

    // Math.Pi * 2 car la map est inversée
    return Math.PI * 2 - Math.atan2(coordinateY, coordinateX);
};

/**
 * Calcule et retourne une coordonée Openlayers depuis une longitude et une latitude.
 * @param {number} p_lon Longitude de la position.
 * @param {number} p_lat Latitude de la position.
 * @returns {ol.proj} Projection de la position.
 */
export const getCoordDeLonLat = (p_lon, p_lat) => {
    return ol.proj.fromLonLat([p_lon, p_lat]);
};

/**
 * @desc Trouve la distance entre deux coordonnées
 * @param {coordonnee1} p_coordonnee1 Premiere coordonnée.
 * @param {coordonnee2} p_coordonnee2 Deuxième coordonnée.
 * @return {d} Distance entre les deux coordonnées.
 */
export const calculDistanceCoordonnees = (p_coordonnee1, p_coordonnee2) => {
    const lat1 = degreeEnRadian(p_coordonnee1[1]);
    const lat2 = degreeEnRadian(p_coordonnee2[1]);
    const lng1 = degreeEnRadian(p_coordonnee1[0]);
    const lng2 = degreeEnRadian(p_coordonnee2[0]);
    const radlat1 = Math.PI * lat1 / 180;
    const radlat2 = Math.PI * lat2 / 180;
    const theta = lng1 - lng2;
    const radtheta = Math.PI * theta / 180;
    let distance = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

    distance = Math.acos(distance);
    distance = distance * 180 / Math.PI;
    distance = distance * NB_MINUTES_DEGRE * MILES_NAUTIQUE * MILES_EN_KM;

    if (isNaN(distance)) {
        return 0;
    }

    return distance;
};

/**
 * @desc Compare la position actuelle avec toutes les positions
 * de la route pour savoir quel est le point le plus proche.
 * @param {array} p_positionActuelle Correspond à la position du camion [lon, lat].
 * @param {array} p_tableauRoute Correspond au tableau contenant les points de la route.
 * @returns {number} L'indice du point de la route le plus proche.
 */
export const trouverProchainPoint = (p_positionActuelle, p_tableauRoute) => {
    // Initialiser à la plus haute valeur pour comparer la distance
    let differenceMinimum = Number.MAX_SAFE_INTEGER;
    let plusProche;
    let difference;

    for (let i = 0; i < p_tableauRoute.length; i += 1) {
        difference = calculDistanceCoordonnees(p_positionActuelle, p_tableauRoute[i]);

        if (difference < differenceMinimum) {
            plusProche = i;
            differenceMinimum = difference;
        }
    }

    return plusProche;
};

/**
 * Fonction qui prend un point et qui rajout le paramètre p_augmentation
 * de chaque cotés pour former un losange en linestring
 * @param {Array.<number, number>} p_point Le point à transformer en losange.
 * @param {number} p_augmentation Le rayon du losange.
 * @returns {lineString} Le losange.
 */
export const pointVersLosange = (p_point, p_augmentation) => {
    return lineString([
        [p_point[0] + p_augmentation, p_point[1]],
        [p_point[0], p_point[1] + p_augmentation],
        [p_point[0] - p_augmentation, p_point[1]],
        [p_point[0], p_point[1] - p_augmentation],
        [p_point[0] + p_augmentation, p_point[1]],
    ]);
};

/**
 * Fonction qui retourne un texte pour l'affichage d'une distance
 * @param {number} p_distance le point à transformer en losange
 * @returns {string} Distance
 */
export const texteDistance = (p_distance) => {
    const dist = parseFloat(p_distance);
    if (isNaN(dist)) {
        return '';
    } else if (p_distance > 1) {
        return dist.toFixed(2) + ' km';
    } else {
        return (dist * 1000).toFixed(0) + ' m';
    }
};

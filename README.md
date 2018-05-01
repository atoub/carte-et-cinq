Projet CEGEP 2018
# Radar Azimut

> Auteur : Équipes Nidotrio et Vizual Wizard

# Installation des dépendances

## Installation NodeJs

- *GNU/Linux*
    1.  Node.js est disponible sur la plupart des gestionnaires de paquets.
- *Windows/MacOS*
    1.  Se rendre sur le site de [**NodeJS**](https://nodejs.org/fr/).
    2.  Télécharger la version “recommandée”.
    3.  Exécuter le fichier (fichier avec extension .msi sous windows, .pkg sous Mac OS), avec les **droits d'administrateur**.
    4.  Accepter le contrat de licence, puis cliquer sur suivant.
    5.  Choisir le chemin d’installation selon votre préférence ( par exemple : C:\\Program Files\\nodejs\ ), puis accepter.
    6.  Garder la configuration par défaut de la fenêtre "Configuration personnalisée", puis accepter.
    7.  Cliquer ensuite sur installer.
    8.  Cliquer sur terminer (ou finish), **NodeJs** est maintenant disponible en tapant **``npm``**.
    (visible dans le menu démarrer, ou depuis l'invite de commande / bash / powershell)

## Installation exécutable Python

- *GNU/Linux*
    1.  Python est disponible sur la plupart des gestionnaires de paquets.
- *Windows/MacOS*
    1.  Se rendre sur le site de [**Python**](https://www.python.org/downloads/).
    2.  Cliquez sur la version “2.7.14”.
    3.  Choisir le fichier “Windows x86-64 MSI installer” ou “Mac OS X 64-bit/32-bit installer”, cela lance le téléchargement.
    4.  Lancer le fichier (fichier avec extension .msi sous windows, .pkg sous Mac OS), avec les **droits d'administrateur**.
    5.  Garder l’option “installation pour tous les utilisateurs”, puis accepter.
    6.  Choisir le chemin d’installation selon votre préférence ( par exemple : C:\\Python27\ ), puis accepter.
    7.  Garder la configuration par défaut de la fenêtre "Personaliser Python 2.7.14 (64-bit)", puis accepter.
    8.  Cliquer sur terminer (ou finish), **Python** est maintenant disponible (visible dans le menu démarrer).

## Installation Xampp (optionnel, mais un serveur pour les fichier xml est nécessaire)

1.  Se rendre sur le site de  [**Xampp**](https://www.apachefriends.org/fr/index.html).
2.  Cliquer sur “Xampp pour ...”, en choisissant suivant votre système, cela lance le téléchargement, et vous dirige sur une autre page.
3.  Lancer le fichier ((fichier avec extension .exe sous Windows, .dmg sous Mac OS, .run sur GNU/Linux),), avec les **droits d'administrateur**.
4. Dans la fenêtre "Choisir les composants" ou "Select Components"
    - cocher "Apache" de la partie "Server",
    - Cocher "PHP" de la partie "Program Languages", puis accepter.
5. Choisir le chemin d’installation selon votre préférence ( par exemple : C:\\xampp ), puis accepter.
6. Décocher la case “**Learn more about Bitami…**”  de la fenêtre "Bitnami for XAMPP"
7. Lancer l’installation.
8. Décocher la case “**Do you want…**”, puis cliquer sur terminer (ou finish), **Xampp** est maintenant disponible (visible dans le menu démarrer).

## Installation des paquets redistribuables de Visual C++ (seulement sur Windows)

1.  Se rendre sur le site de téléchargement [**Microsoft**](https://www.microsoft.com/en-ca/download/details.aspx?id=48145).
2.  Choisir une langue (optionnel) puis télécharger.
3.  Cocher les 2 fichiers (version x86 et x64), puis accepter.
4.  Lancer le fichier (fichier avec extension .exe), avec les **droits d'administrateur**.
5.  Accepter le contrat de licence, puis accepter.
6.  Si un message d’erreur “0x80070666” apparaît, VC++ redist. est déjà installé, dans ce cas passer à l'installation suivante.
7.  Sinon cliquer sur installer.
8.  Cliquer sur terminer (ou finish), **VC++ redist.** est maintenant disponible.

## Installation GTK (seulement sur Windows)

1.  En fonction de votre système, choisir la version nécessaire :
    -  [**Win64**](http://ftp.gnome.org/pub/GNOME/binaries/win64/gtk+/2.22/gtk+-bundle_2.22.1-20101229_win64.zip) (si vous ne savez pas, prendre cette version) :
    -  [**Win32**](http://ftp.gnome.org/pub/GNOME/binaries/win32/gtk+/2.24/gtk+-bundle_2.24.10-20120208_win32.zip)
    -  [**GitHub**](https://github.com/Automattic/node-canvas/wiki/Installation---Windows) (en cas de lien mort, ce lien peut être utilisé)
2.  Créer un dossier 'GTK' dans le répertoire 'C:\\', (les droits administrateur peuvent être requis) :
3.  Ouvrir le fichier (fichier avec extension .zip), un logiciel tiers peut-être requis pour ce type de fichier. [7-zip](http://www.7-zip.org/), libre et gratuit, est conseillé.
4.  Décompresser les fichiers de l’archive et les placer dans le dossier GTK créé précédemment.
5.  Une fois la copie terminée, **GTK** est disponible.

# Mise en place du serveur XML (optionnel, mais un serveur pour les fichiers xml est nécessaire)

## Installation

1.  Se rendre dans le dossier de projet de xampp (par exemple : 'C:/xampp/htdocs').
2.  Créer un dossier nommé '**xml**'.
3.  En utilisant Git ou le CD/clé USB, copier le contenu du dossier 'Serveur-Mock' dans le dossier ‘xml’.
4.  Vérifier la présence du fichier ‘index.php’ dans le dossier ‘appels’.

## Configuration

1.  Lancer Xampp (disponible depuis le menu démarrer).
2.  Cliquer sur 'config' pour Apache.
3.  Sélectionnez **httpd.conf**.
4.  Repérer la ligne **Listen XXXX** (XXXX peut être n”importe quel nombre). L’utilisation de la commande ‘Ctrl + F’ est conseillée pour rechercher la ligne.
5.  Remplacer XXXX par 8081, puis sauvegarder le fichier.

## Lancement

1. Lancer Xampp (disponible depuis le menu démarrer).
2. Cliquer sur ‘start’ pour apache.
3. Pour tester le serveur, depuis un navigateur (par exemple : Google Chrome) tapez l’URL ‘http://localhost:8081/xml/appels’.

## Arrêt

1. Pour arrêter le serveur, cliquer sur le bouton ‘stop’ d’apache.

# Mise en place du projet

## Installation

1. Se rendre dans le dossier de votre choix, pour l’installation de votre projet ( le projet doit être facile d’accès ).
2. Créer un dossier ‘Carte et Cinq’.
3. En utilisant Git ou le CD/clé USB, copier le contenu du dossier du projet dans le dossier ‘Carte et cinq’.
4. Ouvrir un terminal ( par exemple cmd Windows ), avec les **droits d’administrateur**.
5. Se rendre à l’aide des commandes **``cd``** dans le répertoire ‘Carte et Cinq’.
6. Configurer les dépendances de nodeJS :
    1. Lancer la commande **``npm install -g node-gyp``** pour installer le module de compatibilité python.
    2. Lancer la commande **``npm install -g --production windows-build-tools``** pour installer les outils de build (seulement sur Windows).
    3. Lancer la commande **``npm config set msvs_version 2015``** pour utiliser VC++ 2015 redist. (seulement sur Windows).
7. Installer les dépendances du projet :
    1. Lancer la commande **``npm install canvas``** pour installer le module canvas
    4. Lancer la commande **``npm install``** pour installer les autres dépendances.

## Lancement

1. Ouvrir un terminal ( par exemple cmd Windows ).
2. Se rendre à l’aide des commandes **``cd``** dans le répertoire ‘Carte et Cinq’.
3. Lancer le projet avec la commande : **``npm start``**
4. Une fois les test et analyse terminés, l'application devrait être accessible via l’URL: [http://localhost:8080](http://localhost:8080)
5. Pour activer le mode Turn by Turn, configurer l’application avec cette adresse : [http://localhost:8080/?f=Options](http://localhost:8080/?f=Options).
6. Mettre 320, puis accepter.
7. Le Mode Turn By Turn s’active, vous devez alors mettre cette adresse : [http://localhost:8080/?f=Route&camionID=320&appelID=1202](http://localhost:8080/?f=Route&camionID=320&appelID=1202).
8. L'adresse pour zoomer sur le véhicule 320 est : [http://localhost:8080/?f=Zoom&camionID=420](http://localhost:8080/?f=Zoom&camionID=420)
9. L'adresse pour zoomer sur l'appel 1202 est : [http://localhost:8080/?f=Zoom&appelID=1202](http://localhost:8080/?f=Zoom&appelID=1202)
10. L'adresse pour zoomer globalement sur tout les appels et les camions est : [http://localhost:8080/?f=ZoomGlobal](http://localhost:8080/?f=ZoomGlobal) (par défaut dans l'application)

11. Si le projet n’est pas accessible via ces liens, il est possible que l’ordinateur ait ouvert le serveur sur un autre port. Si tel est le cas, au lancement du projet via la commande npm start, il est inscrit sur quel port le projet va démarrer, juste après que les tests soient passés, sous cette forme : Project is running at http://localhost:8080/.

## Autres commandes

- **``npm clean``** - supprime le dossier de production.
- **``npm run production``** - créer une version prête à la production dans le dossier “dist”.
- **``npm run lint``** - exécute une vérification d'ESlint (vérification de code statique).
- **``npm test``** - exécute tous les tests.

## Configuration

L'ensemble des paramètres modifiable du programme se trouve dans 'app/Models/Env.js'.
- xml Camion Url : url du serveur xml pour les camions (par défaut : http://localhost:8081/xml/camions/).
- xml Appel Url : url du serveur xml pour les appels (par défaut : http://localhost:8081/xml/appels/).
- borne Url : url du serveur pour la couche WMS des bornes incendie.
- borne Name : Nom pour la couche WMS des bornes incendie.
- bing Key : clé pour le service BingMap (vue satellite).
- map Quest Key : clé pour le service MapQuest (itinéraire).
- map Quest Lang : Langue pour les directives mapQuest (par défaut : fr_CA).

# Installation des outils conseillés pour la maintenance (optionnel).

## Git

L’installation de git est conseillé pour pouvoir télécharger le projet, modifier / créer des branches : https://git-scm.com/downloads
Un client graphique, comme SourceTree peut-être plus simple d’utilisation : https://www.sourcetreeapp.com/

## Visual Studio Code

Visual Studio Code, pratique si vous gérez le projet sous un environnement Git, il vous permet de connaître votre branche courante et bien gérer les conflits lors des fusions de branche, il intègre aussi l’invite de commande. https://code.visualstudio.com/

### Extensions conseillées sous VSCode :
- [Beautify css/sass/scss/less](https://marketplace.visualstudio.com/items?itemName=michelemelluso.code-beautifier) : indentation de code css et dérivé.
- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) : indentation pour fichier de configuration.
- [HTML CSS Support](https://marketplace.visualstudio.com/items?itemName=ecmel.vscode-html-css) : support pour langage web + autocomplétion.
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) : analyse de code JavaScript.
- [React-beautify](https://marketplace.visualstudio.com/items?itemName=taichi.react-beautify) : indentation de code React + JSX.
- [SCSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-scss) : auto-completion SASS.

# Technologies

Ce Projet est basé sur le **react-webpack-boilerplate** disponible [ici](https://github.com/KleoPetroff/react-webpack-boilerplate)

## Outils de développement

1. Build
    - [Webpack](https://webpack.js.org/)
2. Framework
    - [React](https://reactjs.org/)
    - [Electron](https://electronjs.org/)
3. Test
    - [Jest](https://facebook.github.io/jest/)
    - [Enzyme](https://github.com/airbnb/enzyme)
4. Analyse
    - [ESLint](https://eslint.org/)
    - [JSInspect](https://github.com/danielstjules/jsinspect)
5. Documentation
    - [JSDoc](http://usejsdoc.org/index.html)

## Bibliothèques

- [Bootstrap](http://getbootstrap.com/)
- [JQuery](http://jquery.com/)
- [OpenLayers](https://openlayers.org)
- [Turf.js](http://turfjs.org/)

## API Web

- [OpenStreet Map](https://www.openstreetmap.org)
- [Bing Maps](https://www.bing.com/maps) **nécessite une clé d'activation**
- [MapQuest](https://www.mapquest.com) **nécessite une clé d'activation**

## Autre

- Compatibilité SASS
- Compatibilité JSX et ECMAScript v6
- Serveur de développement.
- Module [canvas](https://www.npmjs.com/package/canvas)



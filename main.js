// ./main.js
//electron-packager . --platform=win32 --arch=x64 --icon=favicon.ico
const { Menu, app, shell, BrowserWindow, MenuItem } = require('electron');
const defaultMenu = require('electron-default-menu');
const prompt = require('electron-prompt');
const infoRoute = { camionID: -1, appelID: -1 }; // Objet litéral contenant les infos des saisis
const server = require('./server'); // Obligatoire car il part le server
let win = null;

// https://github.com/electron/windows-installer
// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent(app)) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

/**
 * Permet la création de la fenêtre pour l'application
 * @return {void}
 */
function createWindow() {
    // Initialise la fenêtre selon certaines configurations
    win = new BrowserWindow({ width: 1000, height: 600, fullscreen: true });
    // Point d'entrée
    win.loadURL('http://localhost:8080');
    // Ferme la fenêtre quand l'application est fermée
    win.on('closed', function () {
        win = null;
    });
    initialiserMenu(); // Remplir menu
}

/**
 * Rempli et modifie le menu d'electron
 * @return {void}
 */
function initialiserMenu() {
    // Menu déroulant qui traite les zooms
    menuItemZoom = new MenuItem({
        label: 'Zoom',
        submenu: [
            // Permet le zoom global
            {
                label: 'Zoom global',
                accelerator: 'Alt+G',
                click: () => {
                    win.loadURL('http://localhost:8080/?f=ZoomGlobal');
                },
            },
            // Permet le zoom à un camion saisi
            {
                label: 'Zoom au camion',
                accelerator: 'Alt+C',
                click: () => {
                    // Appel l'url pour zoomer sur le camion
                    const appelUrlZoomCamion = () => {
                        win.loadURL('http://localhost:8080/?f=Zoom&camionID=' + infoRoute.camionID);
                    };

                    promptNoCamion(appelUrlZoomCamion);
                },
            },
            // Permet le zoom à un appel saisi
            {
                label: 'Zoom à l\'appel',
                accelerator: 'Alt+A',
                click: () => {
                    // Appel l'url pour zoomer sur un appel
                    const appelUrlZoomAppel = () => {
                        win.loadURL('http://localhost:8080/?f=Zoom&appelID=' + infoRoute.appelID);
                    };

                    promptNoAppel(appelUrlZoomAppel);
                },
            },
        ],
    });
    // Menu déroulant qui traite les options générals
    menuItemOptions = new MenuItem({
        label: 'Options',
        submenu: [
            // Permet de changer le numéro du camion courrant
            {
                label: 'Changer numéro camion',
                accelerator: 'Shift+C',
                click: () => {
                    win.loadURL('http://localhost:8080/?f=Options');
                },
            },
            // Active la route entre params.camionID et params.appelID
            {
                label: 'Active route entre camion et appel',
                accelerator: 'Shift+A',
                click: () => {
                    const appelUrlTracerRoute = () => {
                        win.loadURL('http://localhost:8080/?f=Route&camionID=' + infoRoute.camionID +
                            '&appelID=' + infoRoute.appelID);
                    };
                    const dialogueSaisiAppel = () => {
                        promptNoAppel(appelUrlTracerRoute);
                    };

                    promptNoCamion(dialogueSaisiAppel);
                },
            },
        ],
    });

    // Création d'un nouveau menu
    const barMenu = new Menu();
    const menu = defaultMenu(app, shell);
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
    const itemsView = Menu.getApplicationMenu().items.find(i => i.label == 'View');
    // Rend non visible certaines fonctionnalités de View
    itemsView.submenu.items[2].visible = false;

    // Ajoute les différents menu déroulant custom ou fournit par défaut
    barMenu.append(itemsView);
    barMenu.append(menuItemZoom);
    barMenu.append(menuItemOptions);
    barMenu.append(Menu.getApplicationMenu().items.find(i => i.label == 'Window'));
    barMenu.append(Menu.getApplicationMenu().items.find(i => i.label == 'Help'));

    // Applique le menu modifié
    Menu.setApplicationMenu(barMenu);
}

/**
 * Permet d'afficher un dialogue demandant le numéro d'un appel
 * @param {function} p_callback Fonction à effectuer après la saisi
 * @return {void}
 */
function promptNoAppel(p_callback) {
    const promptSaisi = afficherPromptAvecSaisi('Obtenir numéro de l\'appel', 'Numéro de l\'appel');

    promptSaisi.then((resultat) => {
        if (resultat === null) {
            return;
        }

        infoRoute.appelID = resultat;
        p_callback();
    });
}

/**
 * Permet d'afficher un dialogue demandant le numéro d'un camion
 * @param {function} p_callback Fonction à effectuer après la saisi
 * @return {void}
 */
function promptNoCamion(p_callback) {
    const promptSaisi = afficherPromptAvecSaisi('Obtenir numéro du camion', 'Numéro du camion');

    promptSaisi.then((resultat) => {
        if (resultat === null) {
            return;
        }

        infoRoute.camionID = resultat;
        p_callback();
    });
}

/**
 * Permet d'afficher un dialogue demandant une saisi
 * @param {string} p_titre Titre du dialogue
 * @param {string} p_label Texte à côté de la question
 * @return {void}
 */
function afficherPromptAvecSaisi(p_titre, p_label) {
    return prompt({
        title: p_titre,
        label: p_label + ' : ',
    });
}

// Création de lafenêtre quand l'app est prêt
app.on('ready', function () {
    createWindow();
});

// S'assure de la création de la fenêtre
app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

app.on('window-all-closed', app.quit);
app.on('before-quit', () => {
    mainWindow.removeAllListeners('close');
    mainWindow.close();
});

// Code pour la version installable avec electron
// https://github.com/electron/windows-installer
function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');
    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function (command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true,
            });
        } catch (error) { }

        return spawnedProcess;
    };

    const spawnUpdate = function (args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
        // Optionally do things such as:
        // - Add your .exe to the PATH
        // - Write to the registry for things like file associations and
        //   explorer context menus

        // Install desktop and start menu shortcuts
        spawnUpdate(['--createShortcut', exeName]);

        setTimeout(application.quit, 1000);
        return true;

    case '--squirrel-uninstall':
        // Undo anything you did in the --squirrel-install and
        // --squirrel-updated handlers

        // Remove desktop and start menu shortcuts
        spawnUpdate(['--removeShortcut', exeName]);

        setTimeout(application.quit, 1000);
        return true;

    case '--squirrel-obsolete':
        // This is called on the outgoing version of your app before
        // we update to the new version - it's the opposite of
        // --squirrel-updated

        application.quit();
        return true;
    default: return false;
    }
}

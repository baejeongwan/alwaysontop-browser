const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron')
const path = require('path');
const { TransformStreamDefaultController } = require('stream/web');

/**
 * Window
 * @type BrowserWindow
 */
let win;

/**
 * Create a new window.
 */
const createWindow = () => {
    const win = new BrowserWindow({
        width: 300,
        height: 700,
        minWidth: 200,
        webPreferences: {
            webviewTag: true,
            preload: path.join(__dirname, "preload.js")
        },
        alwaysOnTop: true
    })

    win.loadFile("index.html")
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (e, commandLine, workingDirectory) => {
        if (win) {
            if (win.isMinimized()) win.restore()
            win.focus()
            console.log(commandLine)
        }

        
        app.whenReady().then(() => {
            createWindow()
        })
    })
}


app.on("window-all-closed", () => {
    if (process.platform != 'darwin') app.quit()
})


const menuTemplate = [
    {role: 'filemenu'},
    {
        label: 'User data',
        submenu: [
            {
                label: 'Clear everything',
                click: () => {
                    const appPath = path.join(app.getPath('appData'), "alwaysontop-browser");
                    require('fs').rm(appPath, () => {
                        app.relaunch()
                        app.exit()
                    })
                }
            }
        ]
    },
    {
        label : 'Help',
        submenu: [
            {
                label: "Visit official repository",
                click: () => {
                    shell.openExternal("https://github.com/baejeongwan")
                }
            },
            {
                label: "About",
                click: () => {
                    require('electron').dialog.showMessageBox(null, {
                        message: `${app.getName()} version ${app.getVersion()}`,
                        title: "About",
                        type: 'info'
                    })
                }
            }
        ]
    }
]

const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)

if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient('alwaysontop-browser', process.execPath, [path.resolve(process.argv[1])])
    }
} else {
    app.setAsDefaultProtocolClient('alwaysontop-browser')
}
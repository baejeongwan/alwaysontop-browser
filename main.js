const { app, BrowserWindow, ipcMain, Menu, shell, dialog } = require('electron')
const path = require('path');

require('./updater.js')

/**
 * Window
 * @type BrowserWindow
 */
let win;
let startUrl = null;

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

app.whenReady().then(() => {
    createWindow()
})

ipcMain.on('preloader-ready', (e) => {
    if (process.argv[1] != undefined) {
        // alwaysontop-browser://open?url=https://example.com
        try {
            const url = new URL(process.argv[1]).searchParams;
            if (url.get("url") != null) {
                e.sender.send('navigate-to', url.get("url"))
            }
        } catch {
            dialog.showMessageBox(win, {
                message: "The requested URL is not in URL format.",
                title: "Open to Always on Top Browser",
                type: 'warning'
            })
        }
    }
})

app.on("window-all-closed", () => {
    if (process.platform != 'darwin') app.quit()
})


const menuTemplate = [
    {role: 'filemenu'},
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Clear every userdata',
                click: () => {
                    const appPath = path.join(app.getPath('appData'), "alwaysontop-browser");
                    require('electron-clear-data').clearAllUserData()
                    app.relaunch()
                }
            },
            {role: "toggledevtools"}
        ]
    },
    {
        label : 'Help',
        submenu: [
            {
                label: "Visit official repository",
                click: () => {
                    shell.openExternal("https://github.com/baejeongwan/alwaysontop-browser")
                }
            },
            {
                label: "About",
                click: () => {
                    dialog.showMessageBox(null, {
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
const { contextBridge, ipcRenderer } = require('electron')

let pending = null;

window.addEventListener("DOMContentLoaded", () => {
    ipcRenderer.send('preloader-ready')
})

contextBridge.exposeInMainWorld('aotBrowser', {
    checkPendingNavigation: () => {
        return pending
    }
})


ipcRenderer.on("navigate-to", (e,arg) => {
    pending = arg
})


ipcRenderer.on("go-back", () => {
    document.querySelector("webview").goBack()
})

ipcRenderer.on("go-forward", () => {
    document.querySelector("webview").goForward()
})

ipcRenderer.on("reload", () => {
    document.querySelector("webview").reload()
})
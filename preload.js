const { contextBridge, ipcRenderer } = require('electron')

let urlPendingToNavigate = null
let isRendererReady = false

window.addEventListener("DOMContentLoaded", () => {
    isRendererReady = true
    if (urlPendingToNavigate != null) {
        document.querySelector("webview").loadURL(urlPendingToNavigate)
    }
})

contextBridge.exposeInMainWorld('aotBrowser', {
    checkPendingNavigation: () => {
        return urlPendingToNavigate
    }
})


ipcRenderer.on("navigate-to", (url) => {
    if (isRendererReady) {
        document.querySelector("webview").loadURL(url)
    } else {
        urlPendingToNavigate = url
    }
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
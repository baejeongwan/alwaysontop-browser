document.getElementById("navigate-bar").addEventListener("submit", function (e) {
    e.preventDefault()
    e.stopPropagation()
    if (document.getElementById("navigate-bar").checkValidity()) {
        document.querySelector("webview").loadURL(document.getElementById("url-input-box").value)
    } else {
        document.querySelector("webview").loadURL("https://google.com/search?q=" + document.getElementById("url-input-box").value)
    }
}, false)

document.getElementById("back-btn").addEventListener("click", function (e) {
    document.querySelector("webview").goBack()
})

document.getElementById("forward-btn").addEventListener("click", function (e) {
    document.querySelector("webview").goForward()
})

document.getElementById("refresh-btn").addEventListener("click", function (e) {
    document.querySelector("webview").reload()
})

document.querySelector("webview").addEventListener("did-navigate", function (e) {
    document.getElementById("url-input-box").value = e.url
})

document.querySelector("webview").addEventListener("did-navigate-in-page", function (e) {
    document.getElementById("url-input-box").value = e.url
})

document.querySelector("webview").addEventListener("did-start-loading", function () {
    document.getElementById("refresh-btn-refresh-icon").classList.add("hidden")
    document.getElementById("refresh-btn-x-icon").classList.remove("hidden")
    document.getElementById("loading-bar").classList.add("active")
})

document.querySelector("webview").addEventListener("did-stop-loading", function () {
    document.getElementById("refresh-btn-refresh-icon").classList.remove("hidden")
    document.getElementById("refresh-btn-x-icon").classList.add("hidden")
    document.getElementById("loading-bar").classList.remove("active")
})
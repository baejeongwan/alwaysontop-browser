// updater.js

const { dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const ProgressBar = require('electron-progressbar');

autoUpdater.autoDownload = false;

module.exports = () => {
    autoUpdater.checkForUpdates();

    let progressBar;
  
    /* Check if update is possible. */
    autoUpdater.on('update-available', () => {
        dialog.showMessageBox({
            type: 'info',
            title: 'Update available',
            message: 'A new version of Project is available. Do you want to update now?',
            buttons: ['Update', 'Later'],
        }).then((result) => {
            const buttonIndex = result.response;
            if (buttonIndex === 0) autoUpdater.downloadUpdate();
        });
    });

    autoUpdater.once('download-progress', (progressObj) => {
        progressBar = new ProgressBar({
            text: 'Downloading...',
            detail: 'Downloading...',
        });

        progressBar
            .on('completed', function () {
                console.info(`completed...`);
                progressBar.detail = 'Task completed. Exiting...';
            })
            .on('aborted', function () {
                console.info(`aborted...`);
            });
    });

    // 업데이트를 다운받고 나면 업데이트 설치 후 재시작을 요청하는 팝업이 뜬다.
    autoUpdater.on('update-downloaded', () => {
        progressBar.setCompleted();
        dialog
            .showMessageBox({
                type: 'info',
                title: 'Update ready',
                message: 'Install & restart now?',
                buttons: ['Restart', 'Later'],
            })
            .then((result) => {
                const buttonIndex = result.response;

                if (buttonIndex === 0) autoUpdater.quitAndInstall(false, true);
            });
    });
};
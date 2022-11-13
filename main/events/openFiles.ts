import { ipcMain, dialog } from 'electron'
export default () => {
    ipcMain.addListener("openFile", () => {
        dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }).then(res => {
            console.log('res', res)
        })
    })
}


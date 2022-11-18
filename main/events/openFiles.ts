import { ipcMain, dialog } from 'electron'
import CfgMainConfig from '../helpers/cfg/main/cfg_main_config'

let cfg: CfgMainConfig = undefined

export default (mainWindow: Electron.CrossProcessExports.BrowserWindow) => {
    ipcMain.addListener("openFile", () => {
        dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }).then(res => {
            console.log('res', res)
        })
    })

    ipcMain.addListener('selectApexDir', () => {
        dialog.showOpenDialog({ properties: ['openDirectory'] }).then(res => {
            cfg = new CfgMainConfig(res.filePaths[0])
            mainWindow.webContents.send('selectedApexDir', res.filePaths[0])
            mainWindow.webContents.send('loadCfg', cfg.cfgToRenderData())
        })
    })

    ipcMain.addListener('changeChildCfgStatus', (e, item) => {
        cfg.changeChildCfgStatus(item)
    })

}


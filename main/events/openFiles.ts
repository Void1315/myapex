import { ipcMain, dialog } from 'electron'
const sleep = ms => new Promise(r => setTimeout(r, ms));
import CfgMainConfig from '../helpers/cfg/main/cfg_main_config'

let cfg: CfgMainConfig = undefined

export default (mainWindow: Electron.CrossProcessExports.BrowserWindow) => {
    ipcMain.addListener("openFile", () => {
        dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }).then(res => {
            console.log('res', res)
        })
    })



    ipcMain.handle('openApexDir', () => {
        return new Promise((resolve, reject) => {
            dialog.showOpenDialog({ properties: ['openDirectory'] }).then(res => {
                cfg = new CfgMainConfig(res.filePaths[0])
                resolve({
                    path: res.filePaths[0],
                    cfgData: cfg.cfgToRenderData()
                })
            })
        })
    })

    ipcMain.handle('changeChildCfgStatus', (_, item) => {
        return new Promise<void>((resolve, reject) => {
            cfg.changeChildCfgStatus(item)
            resolve()
        })
    })


}


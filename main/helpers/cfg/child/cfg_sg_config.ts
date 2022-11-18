import ChildCfgConfig from './base_child'
import CfgMainConfig from '../main/cfg_main_config'
import { CHILD_CFG_CONFIG} from '../../../config/cfg_config'
import { getRandomString } from '../../../utils';


class CfgSgConfig extends ChildCfgConfig {

    public fields = CHILD_CFG_CONFIG['sg'].childCfgContentConfig;

    constructor(public mainCfg: CfgMainConfig, public childCfgPrefix: string, childCfgInMainCfgContent?: string, startKey?: string) {
        super(mainCfg, childCfgPrefix, childCfgInMainCfgContent, startKey)

    }

    protected getNextCfgName(index: number){
        if(CHILD_CFG_CONFIG[this.childCfgPrefix].size == index + 1){
            return this.mainCfg.mainCfgFileName; // TODO 后续根据判断 可以接 ts.cfg
        }else{
            return `${this.childCfgPrefix}_${getRandomString()}.cfg`
        }
    }

    // public startKey: string = "space"; // 启动键
    // protected sgCfgPrefix = 'sg'; // 前缀

    // protected _childCfgSetUpFileName?: string = `${this.sgCfgPrefix}_start_${getRandomString()}.cfg`;
    // private startSgCfgFileName = this._childCfgSetUpFileName;
    // private endSgCfgFileName = `${this.sgCfgPrefix}_end_${getRandomString()}.cfg`;
    // public sgCfgFileNames: { name: string }[] = [];


    // constructor(mainCfg: CfgMainConfig) {
    //     super(mainCfg)
    //     this.loadCfg();
    //     this.childCfgInMainCfgContent = `${CFG_CONFIG.BIND_US_STANDARD} "${this.startKey}" "+jump; exec ${this.startSgCfgFileName}; " 0\n`
    // }

    // protected loadCfg() {
    //     const cfgFlies = fs.readdirSync(this.mainCfg.getCfgPath())
    //     let isStartSgCfg = false
    //     let isEndtSgCfg = false
    //     for (let name of cfgFlies) {

    //         if (SG_START_CFGREG.exec(name)) {
    //             this.startSgCfgFileName = name
    //             this.sgCfgFileNames.push({ name: name })
    //             isStartSgCfg = true
    //         }
    //         else if (SG_END_CFGREG.exec(name)) {
    //             this.endSgCfgFileName = name
    //             this.sgCfgFileNames.push({ name: name })
    //             isEndtSgCfg = true
    //         }

    //         if (isStartSgCfg && isEndtSgCfg) {
    //             this.isExistFiles = true;
    //             break;
    //         }
    //     }
    // }

    // private generateSgStartFile(): string | undefined {
    //     const sgStartContent = this.SgStartFileContent();
    //     try {
    //         fs.writeFileSync(`${this.mainCfg.getCfgPath()}\\${this.startSgCfgFileName}`, sgStartContent, { flag: "w+" })
    //         return this.startSgCfgFileName
    //     } catch (err) {
    //         console.error(err)
    //         return undefined;
    //     }
    // }

    // private SgStartFileContent() {
    //     return `${CFG_CONFIG.BIND_US_STANDARD} "MWHEELDOWN" "+jump; fps_max 30; exec ${this.endSgCfgFileName}" 1\n${CFG_CONFIG.BIND_US_STANDARD} "MWHEELUP" "+forward" 1\n`
    // }

    // private generateSgEndFile(): string | undefined {
    //     const sgEndContent = this.SgEndFileContent();
    //     try {
    //         fs.writeFileSync(`${this.mainCfg.getCfgPath()}\\${this.endSgCfgFileName}`, sgEndContent, { flag: "w+" })
    //         return this.endSgCfgFileName
    //     } catch (err) {
    //         console.error(err)
    //         return undefined;
    //     }
    // }

    // private SgEndFileContent() {
    //     //bind "MWHEELDOWN" "+duck; -duck; fps_max 200; exec 1.cfg" 0
    //     //bind_US_standard "MWHEELUP" "+forward" 1

    //     return `${CFG_CONFIG.BIND} "MWHEELDOWN" "+duck; -duck; fps_max 200; exec ${this.mainCfg.mainCfgFileName}" 0\n${CFG_CONFIG.BIND_US_STANDARD} "MWHEELUP" "+forward" 1\n`
    // }

    // public installChildCfg() {
    //     const startSgFileName = this.generateSgStartFile()
    //     if (!startSgFileName) return undefined

    //     const endSgFileName = this.generateSgEndFile()
    //     if (!endSgFileName) return undefined
    //     this.sgCfgFileNames = [{
    //         name: startSgFileName
    //     }, {
    //         name: endSgFileName
    //     },]
    //     this.isExistFiles = true
    //     return startSgFileName;
    // }

    // public uninstallChildCfg() {
    //     for (let names of this.sgCfgFileNames) {
    //         try {
    //             let fileName = `${this.mainCfg.getCfgPath()}\\${names.name}`;
    //             if (fs.existsSync(fileName)) {
    //                 fs.unlinkSync(fileName);
    //             } else {
    //                 throw (new Error(`${names.name} 文件不存在!卸载失败`))
    //             }
    //         } catch (err) {
    //             console.error(err);
    //             throw err;
    //         }
    //     }
    //     this.isExistFiles = false;
    //     return true
    // }
}

export default CfgSgConfig;
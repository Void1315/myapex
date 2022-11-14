// 处理cfg文件
import fs from 'fs'

const CFG_CONFIG = {
    BIND_US_STANDARD: 'bind_US_standard', // cfg前缀
    BIND: 'bind',
}
const SG_START_CFGREG = /^sg_start_\w{8}\.cfg$/ // sg start查找用正则
const SG_END_CFGREG = /^sg_end_\w{8}\.cfg$/ // sg end 查找用正则
const SG_EXITS_REG = /bind_US_standard\s"\w+"\s"\+jump;\sexec\ssg_start_\w{8}\.cfg;\s"\s0/m // 忽略了启动键的sg再main文件中的匹配规则

interface cfgToRenderDataProps {
    childCfg: {
        name: string,
        title: string,
        status: boolean
    }[]
}

const getRandomString = () => Math.random().toString(36).slice(-8);
class CfgMainConfig {
    public isOpenSg: boolean = false; // 是否开启 一键sg
    public isOpenZword: boolean = false; // 是否开启 z字抖动
    public isSetMainCfg: boolean = false;
    public mainCfgFileName = `main_${getRandomString()}.cfg`;
    public mainCfgReg = /^main_\w{8}\.cfg$/;
    public mainCfgStatus = false;
    private mainCfgContent?= ''; // main cfg 文件内容
    public gameRootPath = ''; // 游戏根目录路径
    private childCfg: { sg: CfgSgConfig } | {} = {}

    private supportChildCfg = [
        {
            name: 'sg',
            title: '一键sg',
            reg: SG_EXITS_REG,
            type: CfgSgConfig,
        }
    ]

    constructor(gameRootPath: string) {
        this.gameRootPath = gameRootPath;
        this.loadCfg()
        this.loadChildCfg()
    }



    public cfgToRenderData(): cfgToRenderDataProps {
        let renderCfg: cfgToRenderDataProps = { childCfg: [] }
        for (let child of this.supportChildCfg) {
            renderCfg.childCfg.push({
                name: child.name,
                title: child.title,
                status: (this.childCfg?.[child.name] as ChildCfgConfig)?.isSetChildCfg || false,
            })
        }
        return renderCfg

    }

    public loadCfg() {
        const cfgFlies = fs.readdirSync(this.getCfgPath())
        try {
            for (let name of cfgFlies) {
                if (this.mainCfgReg.exec(name)) {
                    this.mainCfgStatus = true; // main cfg 是存在且开启
                    this.mainCfgFileName = name;
                    this.mainCfgContent = fs.readFileSync(this.getMainCfgPath()).toString()
                    return;
                }
            }

        } catch (err) {
            console.error(err)
            throw err;
        }
    }

    public loadChildCfg() {
        try {
            for (let childCfg of this.supportChildCfg) {
                this.childCfg[childCfg.name] = new childCfg.type(this);
            }
        } catch (err) {
            console.error(err)
            throw err;
        }
    }

    public getCfgPath() {
        return `${this.gameRootPath}\\cfg`;
    }

    public getMainCfgPath() {
        return `${this.gameRootPath}\\cfg\\${this.mainCfgFileName}`;
    }

    public changeChildCfgStatus(item: { name: string, value: boolean }) {
        if (!item.value) {
            this.uninstallChildCfg([item.name])
        } else {
            this.installChildCfg([item.name])
        }
    }

    private installChildCfg(names: string[]) {
        for (let name of names) {
            if (Object.keys(this.childCfg).includes(name)) {
                if (!(this.childCfg[name] as ChildCfgConfig).isSetChildCfg && !this.mainCfgContent.includes((this.childCfg[name] as ChildCfgConfig).childCfgInMainCfgContent)) {
                    (this.childCfg[name] as ChildCfgConfig).installChildCfg();
                    this.mainCfgContent += (this.childCfg[name] as ChildCfgConfig).childCfgInMainCfgContent

                    this.updateMainCfg();
                } else {
                    throw "已经启动此子项  " + name;
                }
            } else {
                throw "不支持的子项cfg  " + name;
            }
        }

    }

    private uninstallChildCfg(names: string[]) {
        for (let name of names) {
            if (Object.keys(this.childCfg).includes(name)) {
                if ((this.childCfg[name] as ChildCfgConfig).isSetChildCfg && this.mainCfgContent.includes((this.childCfg[name] as ChildCfgConfig).childCfgInMainCfgContent)) {
                    (this.childCfg[name] as ChildCfgConfig).uninstallChildCfg();
                    this.mainCfgContent = this.mainCfgContent.replaceAll((this.childCfg[name] as ChildCfgConfig).childCfgInMainCfgContent, '') // 从main 剔除 开关
                    this.updateMainCfg();
                } else {
                    throw "已经关闭此子项  " + name;
                }
            } else {
                throw "不支持的子项cfg  " + name;
            }
        }
    }

    updateMainCfg() {
        try {
            fs.writeFileSync(this.getMainCfgPath(), this.mainCfgContent, { flag: 'w+' })
        } catch (err) {
            console.error(err)
            throw err;
        }
    }

}

class ChildCfgConfig {
    public mainCfg: CfgMainConfig;
    public startKey?: string = undefined; // 启动键
    // 子项cfg文件名称列表
    protected _childCfgConfigFiles?: { name: string }[] = undefined;
    protected _childCfgSetUpFileName?: string = undefined;
    public isSetChildCfg: boolean = false;
    public childCfgInMainCfgContent?: string = undefined
    constructor(mainCfg: CfgMainConfig) {
        this.mainCfg = mainCfg;
    }

    // 获得启动子项cfg的字符串
    public getOpenChildCfgConfigStr() {
        return '';
    }

    // 生成子项cfg文件，并返回文件名称列表
    public installChildCfg(): string | undefined {
        return undefined;
    };

    public uninstallChildCfg(): boolean {
        return false;
    }

}



class CfgSgConfig extends ChildCfgConfig {
    public startKey?: string = "space"; // 启动键
    private sgCfgPrefix = 'sg'; // 前缀

    protected _childCfgSetUpFileName?: string = `${this.sgCfgPrefix}_start_${getRandomString()}.cfg`;
    private startSgCfgFileName = this._childCfgSetUpFileName;
    private endSgCfgFileName = `${this.sgCfgPrefix}_end_${getRandomString()}.cfg`;
    public sgCfgFileNames: { name: string }[] = [];


    constructor(mainCfg: CfgMainConfig) {
        super(mainCfg)
        this.loadCfg();
        this.childCfgInMainCfgContent = `${CFG_CONFIG.BIND_US_STANDARD} "${this.startKey}" "+jump; exec ${this.startSgCfgFileName}; " 0\n`
    }

    private loadCfg() {
        const cfgFlies = fs.readdirSync(this.mainCfg.getCfgPath())
        let isStartSgCfg = false
        let isEndtSgCfg = false
        for (let name of cfgFlies) {

            if (SG_START_CFGREG.exec(name)) {
                this.startSgCfgFileName = name
                this.sgCfgFileNames.push({ name: name })
                isStartSgCfg = true
            }
            else if (SG_END_CFGREG.exec(name)) {
                this.endSgCfgFileName = name
                this.sgCfgFileNames.push({ name: name })
                isEndtSgCfg = true
            }

            if (isStartSgCfg && isEndtSgCfg) {
                this.isSetChildCfg = true;
                break;
            }
        }
    }

    private generateSgStartFile(): string | undefined {
        const sgStartContent = this.SgStartFileContent();
        try {
            fs.writeFileSync(`${this.mainCfg.getCfgPath()}\\${this.startSgCfgFileName}`, sgStartContent, { flag: "w+" })
            return this.startSgCfgFileName
        } catch (err) {
            console.error(err)
            return undefined;
        }
    }

    private SgStartFileContent() {
        return `${CFG_CONFIG.BIND_US_STANDARD} "MWHEELDOWN" "+jump; fps_max 30; exec ${this.endSgCfgFileName}" 1\n${CFG_CONFIG.BIND_US_STANDARD} "MWHEELUP" "+forward" 1\n`
    }

    private generateSgEndFile(): string | undefined {
        const sgEndContent = this.SgEndFileContent();
        try {
            fs.writeFileSync(`${this.mainCfg.getCfgPath()}\\${this.endSgCfgFileName}`, sgEndContent, { flag: "w+" })
            return this.endSgCfgFileName
        } catch (err) {
            console.error(err)
            return undefined;
        }
    }

    private SgEndFileContent() {
        //bind "MWHEELDOWN" "+duck; -duck; fps_max 200; exec 1.cfg" 0
        //bind_US_standard "MWHEELUP" "+forward" 1

        return `${CFG_CONFIG.BIND} "MWHEELDOWN" "+duck; -duck; fps_max 200; exec ${this.mainCfg.mainCfgFileName}" 0\n${CFG_CONFIG.BIND_US_STANDARD} "MWHEELUP" "+forward" 1\n`
    }

    public installChildCfg() {
        const startSgFileName = this.generateSgStartFile()
        if (!startSgFileName) return undefined

        const endSgFileName = this.generateSgEndFile()
        if (!endSgFileName) return undefined
        this.sgCfgFileNames = [{
            name: startSgFileName
        }, {
            name: endSgFileName
        },]
        this.isSetChildCfg = true
        return startSgFileName;
    }

    public uninstallChildCfg() {
        for (let names of this.sgCfgFileNames) {
            try {
                let fileName = `${this.mainCfg.getCfgPath()}\\${names.name}`;
                if (fs.existsSync(fileName)) {
                    fs.unlinkSync(fileName);
                } else {
                    throw (new Error(`${names.name} 文件不存在!卸载失败`))
                }
            } catch (err) {
                console.error(err);
                throw err;
            }
        }
        this.isSetChildCfg = false;
        return true
    }
}

export {
    CfgMainConfig
}
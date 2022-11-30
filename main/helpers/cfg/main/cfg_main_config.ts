import { getRandomString } from '../../../utils'
import CfgSgConfig from '../child/cfg_sg_config'
import { CHILD_CFG_CONFIG } from '../../../config/cfg_config'
import ChildCfgConfig from '../child/base_child'
import fs from 'fs'
interface cfgToRenderDataProps {
    childCfg: {
        name: string,
        title: string,
        status: boolean
    }[]
}

type TCfgRenderData = {
    id: string,
    value: string | boolean | number,
    title: string,
    document?: string,
    type: 'key' | 'number' | 'switch',
    child?: TCfgRenderData
}[]

class CfgMainConfig {
    public isOpenSg: boolean = false; // 是否开启 一键sg
    public isOpenZword: boolean = false; // 是否开启 z字抖动
    public isSetMainCfg: boolean = false;
    public mainCfgFileName = `main_${getRandomString()}.cfg`;
    public mainCfgReg = /^main_\w{8}\.cfg$/;
    public mainCfgStatus = false;
    public mainCfgContent?= ''; // main cfg 文件内容
    public gameRootPath = ''; // 游戏根目录路径
    private childCfg: { sg: CfgSgConfig } | {} = {}

    private supportChildCfg = [ // TODO 到时候移动到配置中
        {
            name: 'sg',
            title: '一键sg',
            type: CfgSgConfig,
            document: '',
        }
    ]

    constructor(gameRootPath: string) {
        this.gameRootPath = gameRootPath;
        this.loadCfg()
        this.loadChildCfg()
    }


    /**
     * 将cfg配置转换为前端识别的json数据
     * @returns 
     */
    public cfgToRenderData(): TCfgRenderData {
        let renderCfgData: TCfgRenderData = []
        for (let cfg of this.supportChildCfg) { // 第一层 主功能
            const thisChildCfg = (this.childCfg?.[cfg.name] as ChildCfgConfig)
            renderCfgData.push({
                id: cfg.name,
                title: cfg.title,
                type: 'switch',
                document: cfg.document,
                value: thisChildCfg?.isExistFiles || false,
                child: []
            })
            let thisChildCfgRenderData = renderCfgData[renderCfgData.length - 1]
            for (let child in CHILD_CFG_CONFIG[cfg.name].childCfgContentConfig) {
                for (let params of CHILD_CFG_CONFIG[cfg.name].childCfgContentConfig[child].fields) {
                    thisChildCfgRenderData.child.push({ ...params, value: thisChildCfg._params[params.id] || params.defaultValue })
                }
            }
        }
        return renderCfgData
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
                const { content: childCfgInMainCfgContent, start_key } = CHILD_CFG_CONFIG[childCfg.name].getInMainContent(this.mainCfgContent) || {}
                this.childCfg[childCfg.name] = new childCfg.type(this, childCfg.name, childCfgInMainCfgContent, start_key);

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

    public changeChildCfgStatus(item: { id: string, value: boolean }) {
        if (!item.value) {
            this.uninstallChildCfg([item.id])
        } else {
            this.installChildCfg([item.id])
        }
    }

    public changeChildCfgParams(data: { cfgName: string, paramName: string, value: any }) {
        const { cfgName, paramName, value } = data;
        if (paramName === 'startKey') {
            (this.childCfg[cfgName] as ChildCfgConfig).startKey = value
        } else {
            const paramsKeys = Object.keys((this.childCfg[cfgName] as ChildCfgConfig)._params)
            if (paramsKeys.includes(paramName)) {
                (this.childCfg[cfgName] as ChildCfgConfig)._params[paramName] = value
                console.log('_params', (this.childCfg[cfgName] as ChildCfgConfig)._params)

            } else {
                throw new Error('不存在的参数!')
            }
        }
        this.uninstallChildCfg([cfgName]);
        this.installChildCfg([cfgName]);
        // (this.childCfg[cfgName] as ChildCfgConfig).updateChildCfg()
    }

    private installChildCfg(names: string[]) {
        for (let name of names) {
            if (Object.keys(this.childCfg).includes(name)) {
                if (!(this.childCfg[name] as ChildCfgConfig).isExistFiles && !this.mainCfgContent.includes((this.childCfg[name] as ChildCfgConfig).childCfgInMainCfgContent)) {

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
                if ((this.childCfg[name] as ChildCfgConfig).isExistFiles && this.mainCfgContent.includes((this.childCfg[name] as ChildCfgConfig).childCfgInMainCfgContent)) {
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
export default CfgMainConfig
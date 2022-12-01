import CfgMainConfig from '../main/cfg_main_config'
import fs from 'fs';
import { getRandomString } from '../../../utils'
import { CHILD_CFG_CONFIG } from '../../../config/cfg_config'
class ChildCfgConfig {


    /**
     * 此子项所有cfg文件名称列表
     */
    protected _childCfgConfigFiles?: { name: string }[] = [];

    /**
     * 子项在main文件中启动项的cfg文件名称 也就是链表第一个文件
     */
    protected _childCfgFirstFileName?: string = undefined;

    /**
     * 子项cfg是否存在
     */
    public isExistFiles: boolean = false;


    public childCfgFilesReg: RegExp;
    public childCfgInMainCfgContent: string; // 子项cfg在main文件中 开启的文字内容
    public startKey: string; // 启动键
    public _params: {} = {}
    /**
     * 构造子项cfg的构造函数
     * @param mainCfg 主cfg对象
     * @param childCfgPrefix 子项cfg前缀
     * @param childCfgInMainCfgContent 子项cfg在main文件中 开启的文字内容
     * @param startKey 启动键
     */
    constructor(public mainCfg: CfgMainConfig, public childCfgPrefix: string, childCfgInMainCfgContent?: string, startKey?: string) {
        this.childCfgInMainCfgContent = childCfgInMainCfgContent;
        this.startKey = startKey;
        this.init()
        this.initFirstName();
        this.loadCfg();
    }

    private init() {
        const defaultConfig = CHILD_CFG_CONFIG[this.childCfgPrefix];
        this.childCfgFilesReg = defaultConfig.childCfgFilesReg;
        this.startKey = this.startKey ?? defaultConfig.defaultStartKey;
        for (let key in defaultConfig.childCfgContentConfig) {
            for (let param of defaultConfig.childCfgContentConfig[key].fields) {
                this._params = { ...this._params, [param.id]: param.defaultValue }
            }
        }
    }

    public changeStartKey(newStartKey: string) {
        this.startKey = newStartKey;
        const newChildCfgInMainCfgContent = CHILD_CFG_CONFIG[this.childCfgPrefix].getDefaultInMainContent(this._childCfgFirstFileName, this.startKey)
        this.mainCfg.mainCfgContent = this.mainCfg.mainCfgContent.replaceAll(this.childCfgInMainCfgContent, newChildCfgInMainCfgContent)
        this.childCfgInMainCfgContent = newChildCfgInMainCfgContent
    }
    /**
     * 尝试去main中查找子项第一个cfg文件名称，如果没有就生成一个
     * @returns 
     */
    private initFirstName() {
        let m: RegExpExecArray, firstName: string;
        const defaultConfig = CHILD_CFG_CONFIG[this.childCfgPrefix];
        m = this.childCfgFilesReg.exec(this.mainCfg.mainCfgContent)
        firstName = m?.[0] ?? `${this.childCfgPrefix}_${getRandomString()}.cfg`
        this._childCfgFirstFileName = firstName;
        this.childCfgInMainCfgContent = this.childCfgInMainCfgContent ?? defaultConfig.getDefaultInMainContent(this._childCfgFirstFileName, this.startKey)
        return this._childCfgFirstFileName
    }

    /**
     * 实例化子项时，将会第一步执行。会从cfg配置文件中查询是否有已经启动的子项cfg，如果有将更新this状态
     */
    protected loadCfg(): void {
        // 第一步 从main.cfg中找到此子项的cfg
        const mainConfig = CHILD_CFG_CONFIG[this.childCfgPrefix].mainCfgContentConfig.matchFunc(this.mainCfg.mainCfgContent)
        if (!mainConfig) return
        this.startKey = mainConfig.start_key // 获取start_key
        const firstFileName = mainConfig.childCfgName
        this._childCfgFirstFileName = firstFileName
        this._childCfgConfigFiles.push({ name: firstFileName });
        // 第二步 根据第一个文件找到所有cfg文件和配置项
        const thisConfig = CHILD_CFG_CONFIG[this.childCfgPrefix];
        let keys = Object.keys(thisConfig.childCfgContentConfig).map(item => parseInt(item))
        let nextPath = `${this.mainCfg.getCfgPath()}\\${firstFileName}`;
        const childReg = thisConfig.childCfgFilesReg;
        let childIndex = 0;
        while (fs.existsSync(nextPath)) {
            let nextContent = fs.readFileSync(nextPath).toString()
            if (keys.includes(childIndex)) {
                const params = thisConfig.childCfgContentConfig[childIndex].matchFunc(nextContent);
                this._params = { ...this._params, ...params }
            }

            const result = childReg.exec(nextContent)
            if (!result) break; // 到头了
            childIndex++
            this._childCfgConfigFiles.push({ name: result[0] });
            nextPath = `${this.mainCfg.getCfgPath()}\\${result[0]}`; // 读取下一个
        }
        this.isExistFiles = true
    }

    protected getNextCfgName(index: number) {

        if (CHILD_CFG_CONFIG[this.childCfgPrefix].size == index + 1) {
            return this.mainCfg.mainCfgFileName;
        } else {
            return `${this.childCfgPrefix}_${getRandomString()}.cfg`
        }
    }

    protected generateChildFile(): string | undefined {
        let thisCfgName = this._childCfgFirstFileName;
        try {
            for (let i = 0, len = Object.keys((CHILD_CFG_CONFIG[this.childCfgPrefix]).childCfgContentConfig).length; i < len; i++) {
                thisCfgName !== this.mainCfg.mainCfgFileName && this._childCfgConfigFiles.push({ name: thisCfgName })
                let nextCfgName = this.getNextCfgName(i)
                fs.writeFileSync(`${this.mainCfg.getCfgPath()}\\${thisCfgName}`, CHILD_CFG_CONFIG[this.childCfgPrefix].childCfgContentConfig[i].generateContentFunc(nextCfgName, this._params), { flag: "w+" })

                thisCfgName = nextCfgName
            }
            this.isExistFiles = true
        } catch (err) {
            console.error(err)
            return undefined;
        }
    }

    public updateChildCfg() {
        this.uninstallChildCfg()
        this.installChildCfg()
    }

    // 生成子项cfg文件，并返回文件名称列表
    public installChildCfg(): { name: string }[] | undefined {
        this.generateChildFile();
        return this._childCfgConfigFiles;
    };

    /**
     * 卸载子项cfg
     * @returns 
     */
    public uninstallChildCfg(): boolean {
        for (let index = 0, len = this._childCfgConfigFiles.length; index < len; index++) {
            let names = this._childCfgConfigFiles[index]
            let filePath = `${this.mainCfg.getCfgPath()}\\${names.name}`;
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                } else {
                    throw (new Error(`${names.name} 文件不存在!卸载失败`))
                }
            } catch (err) {
                console.error(err)
                throw err;
            }
        }
        this._childCfgConfigFiles = []; // 删除 
        this.isExistFiles = false
        return false;
    }

}

export default ChildCfgConfig
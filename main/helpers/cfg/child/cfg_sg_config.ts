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
}

export default CfgSgConfig;
import ChildCfgConfig from './base_child'
import CfgMainConfig from '../main/cfg_main_config'
import { CHILD_CFG_CONFIG} from '../../../config/cfg_config'


class CfgQuickPickaUpConfig extends ChildCfgConfig {

    public fields = CHILD_CFG_CONFIG['quickPickaUp'].childCfgContentConfig;

    constructor(public mainCfg: CfgMainConfig, public childCfgPrefix: string, childCfgInMainCfgContent?: string, startKey?: string) {
        super(mainCfg, childCfgPrefix, childCfgInMainCfgContent, startKey)
    }

    protected getNextCfgName(index: number){
        return ''
    }
}

export default CfgQuickPickaUpConfig;
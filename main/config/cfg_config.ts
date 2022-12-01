const CFG_CONFIG = {
    BIND_US_STANDARD: 'bind_US_standard', // cfg前缀
    BIND: 'bind',
}
const SG_START_CFGREG = /^sg_start_\w{8}\.cfg$/ // sg start查找用正则
const SG_END_CFGREG = /^sg_end_\w{8}\.cfg$/ // sg end 查找用正则
const SG_EXIST_REG = /bind_US_standard\s"\w+"\s"\+jump;\sexec\ssg_start_\w{8}\.cfg;\s"\s0/m // 忽略了启动键的sg再main文件中的匹配规则
interface childCfgConfigProps {
    defaultStartKey: string;
    getDefaultInMainContent: Function;
    getInMainContent: (string) => { content: string, start_key: string } | null
    childCfgFilesReg: RegExp;
    mainCfgContentConfig: {
        matchFunc: (string) => any;
    },
    size: number, // 一共有几个子项 
    childCfgContentConfig: {
        [key: number]: {
            name: string,
            fields: { id: string, title: string, document?: string, type: 'key' | 'number' | 'switch', defaultValue: string | number }[]
            generateContentFunc: (next_cfg: string, ...any) => string
            matchFunc: (string) => any;
        }
    }
}
const CHILD_CFG_CONFIG: { [key: string]: childCfgConfigProps } = {
    sg: {
        size: 2,
        defaultStartKey: 'space', // 启动键
        getDefaultInMainContent: (cfgFileName: string, startKey: string = 'space') => {
            return `${CFG_CONFIG.BIND_US_STANDARD} "${startKey}" "+jump; exec ${cfgFileName};" 0\n`
        },
        getInMainContent: (mainContent: string) => {
            const reg = /bind_US_standard\s"(\w+)"\s".+sg_\w{8}\.cfg.*/m
            const result = reg.exec(mainContent)
            if (!result) return null
            return {
                content: result[0],
                start_key: result[1]
            };
        },
        childCfgFilesReg: /sg_\w{8}\.cfg/mg,
        mainCfgContentConfig: {
            matchFunc: (mainContent: string) => {
                let result = /bind_US_standard\s+"(\w+)"\s.*(sg_\w{8}\.cfg)/mg.exec(mainContent)
                if (!result) return null;
                return {
                    start_key: result[1],
                    childCfgName: result[2]
                }
            },
        },
        childCfgContentConfig:
        {
            0: {
                name: 'sg开始时的cfg设置',
                fields: [
                    {
                        id: 'start_max_fps',
                        title: 'fps最小值',
                        document: 'sg时，将锁定低fps，来增加成功率',
                        type: 'number',
                        defaultValue: 30,
                    }
                ],
                generateContentFunc: (next_cfg: string, params: { start_max_fps: number } = { start_max_fps: 30 }) => `${CFG_CONFIG.BIND_US_STANDARD} "MWHEELDOWN" "+jump; fps_max ${params.start_max_fps}; exec ${next_cfg}"\n`,
                matchFunc: (matchStr: string) => {
                    let reg = /fps_max\s(\d+);/gm
                    let result = reg.exec(matchStr);
                    if (!result) return null;
                    return {
                        start_max_fps: parseInt(result[1])
                    }
                }
            },
            1: {
                name: 'sg结束时的cfg设置',
                fields: [
                    {
                        id: 'end_max_fps',
                        title: 'fps最大值',
                        document: 'sg结束，将恢复到的最大fps，0为无限制',
                        type: 'number',
                        defaultValue: 0,
                    }
                ],
                generateContentFunc: (next_cfg: string, params: { end_max_fps: number } = { end_max_fps: 0 }) => `${CFG_CONFIG.BIND} "MWHEELDOWN" "+duck; -duck; fps_max ${params.end_max_fps}; exec ${next_cfg}" 0\n`,
                matchFunc: (matchStr: string) => {
                    let reg = /fps_max\s(\d+);/gm
                    let result = reg.exec(matchStr);
                    if (!result) return null;
                    return {
                        end_max_fps: parseInt(result[1])
                    }
                }
            }
        }
    },
}

export {
    CFG_CONFIG,
    SG_START_CFGREG,
    SG_END_CFGREG,
    SG_EXIST_REG,
    CHILD_CFG_CONFIG,
}

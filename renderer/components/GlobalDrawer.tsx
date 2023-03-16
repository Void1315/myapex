import { Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { Home as HomeIcon, Surfing as SurfingIcon, CloudDownload as CloudDownloadIcon, Help as HelpIcon, QuestionAnswer as QuestionAnswerIcon } from '@mui/icons-material'
import { MouseEventHandler } from 'react';
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
function defineConfigs<T extends string>(configs: Array<ROUTE_ITEM<T>>) {
    return configs;
}

type ROUTE_ITEM<T> = {
    key: T,
    name: string,
    icon: any
}

const ROUTE_MAP = defineConfigs([{
    key: 'home',
    name: '主页',
    icon: HomeIcon
}, {
    key: 'cfgConfig',
    name: 'cfg身法修改',
    icon: SurfingIcon,
}, {
    key: 'cfgCloud',
    name: 'CFG远程同步',
    icon: CloudDownloadIcon,
}, {
    key: 'help',
    name: '帮助',
    icon: HelpIcon,
}, {
    key: 'qa',
    name: '关于',
    icon: QuestionAnswerIcon,
}])

type ROUTE_KEY = typeof ROUTE_MAP[number]['key']

const RouteList = ({ activeKey }: { activeKey: ROUTE_KEY }) => {
    const dispatch = useDispatch()
    const route = useRouter()
    const changeRoute: MouseEventHandler<HTMLDivElement> = (event) => {
        const routeId = event.currentTarget.id;
        if ('/' + routeId !== route.asPath) {
            dispatch({ type: 'global/setState', payload: { activeRouteKey: routeId } })
            route.push('/' + routeId)
        }
    }

    return <Box>
        <List>
            {ROUTE_MAP.map((item) => <ListItem key={item.key} >
                <ListItemButton id={item.key} selected={item.key === activeKey} onClick={changeRoute}>
                    <ListItemIcon children={<item.icon></item.icon>} />
                    <ListItemText primary={item.name} />
                </ListItemButton>
            </ListItem>)}
        </List>
    </Box>
}

const GlobalDrawer = ({ routeActiveKey }: { routeActiveKey: ROUTE_KEY }) => {
    return <>
        <Box>
            <Drawer
                sx={{
                    width: 260,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 260,
                        boxSizing: 'border-box',
                        backgroundColor: 'transparent'
                    },
                }}
                variant="permanent"
            >
                <RouteList activeKey={routeActiveKey} />
            </Drawer>

        </Box>
    </>
}

export type { ROUTE_KEY }

export default GlobalDrawer
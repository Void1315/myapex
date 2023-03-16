import GlobalDrawer, { ROUTE_KEY } from '../components/GlobalDrawer'
import { Box } from '@mui/material'
const DrawerLayout = ({ children, routeActiveKey }: { routeActiveKey: ROUTE_KEY, children: JSX.Element }) => {
    return <Box sx={{ width: '100%' }}>
        <Box width={260}>
            <GlobalDrawer routeActiveKey={routeActiveKey} />
        </Box>
        <Box minWidth={1100}>
            {children}
        </Box>
    </Box>
}
export default DrawerLayout
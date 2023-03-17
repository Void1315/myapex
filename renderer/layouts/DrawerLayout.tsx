import GlobalDrawer, { ROUTE_KEY } from '../components/GlobalDrawer'
import { Box } from '@mui/material'
const DrawerLayout = ({ children, routeActiveKey }: { routeActiveKey: ROUTE_KEY, children: JSX.Element }) => {
    return <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', backgroundColor: 'rgb(246,248,252)' , padding: '16px 0'}}>
        <Box>
            <GlobalDrawer routeActiveKey={routeActiveKey} />
        </Box>
        <Box  width={'100%'} sx={{
            backgroundColor: 'white',
            boxShadow: 'inset 0 -1px 0 0 transparent',
            borderRadius: '16px',
            marginBottom: '16px',
            marginRight: '16px',
            overflowX: 'auto',
        }}>
            {children}
        </Box>
    </Box>
}
export default DrawerLayout
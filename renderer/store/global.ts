import { createSlice } from '@reduxjs/toolkit'
import { ROUTE_KEY } from '../components/GlobalDrawer'
type TGlobalState = {
    activeRouteKey: ROUTE_KEY
}

export const globalSlice = createSlice({
    name: 'global',
    initialState: {
        activeRouteKey: 'home'
    } as TGlobalState,
    reducers: {
        setState: (state, { payload }) => {
            state = { ...state, ...payload }
            return state
        },
    }
})

// Action creators are generated for each case reducer function
// export const { setState } = counterSlice.actions

export default globalSlice.reducer
import { createSlice } from '@reduxjs/toolkit'

type TCfgConfigState = {
    cfgData: any[],
    apexRoot: string,
    steamCommand: string,
    originCommand: string
}

export const cfgConfigSlice = createSlice({
    name: 'cfgConfig',
    initialState: {
        cfgData: [],
        apexRoot: '',
        steamCommand: '',
        originCommand: ''
    } as TCfgConfigState,
    reducers: {
        setState: (state, { payload }) => {
            state = { ...state, ...payload }
            return state
        },
    }
})

// Action creators are generated for each case reducer function
// export const { setState } = counterSlice.actions

export default cfgConfigSlice.reducer
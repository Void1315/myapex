import { createSlice } from '@reduxjs/toolkit'

type THomeState = {
    cfgData: any[],
    apexRoot: string
}

export const homeSlice = createSlice({
    name: 'home',
    initialState: {
        cfgData: [],
        apexRoot: ''
    } as THomeState,
    reducers: {
        setState: (state, { payload }) => {
            state = {...state, ...payload }
            return state
        },
    }
})

// Action creators are generated for each case reducer function
// export const { setState } = counterSlice.actions

export default homeSlice.reducer
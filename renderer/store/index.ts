import cfgConfigSliceReducer from './cfgConfig'
import globalSliceReducer from './global'
import { configureStore } from '@reduxjs/toolkit'
const store = configureStore({
    reducer: {
        cfgConfig: cfgConfigSliceReducer,
        global: globalSliceReducer
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
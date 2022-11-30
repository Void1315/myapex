import homeSliceReducer from './home'
import { configureStore } from '@reduxjs/toolkit'
const store = configureStore({
    reducer: {
        home: homeSliceReducer
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
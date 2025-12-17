import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import orgReducer from './slices/organisationSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    org: orgReducer
    // Add more reducers here as needed
  },
})

// TypeScript types (if you migrate to TypeScript later)
// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch


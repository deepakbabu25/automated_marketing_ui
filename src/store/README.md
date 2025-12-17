# Redux Store Setup

This project uses Redux Toolkit for state management.

## Structure

- `store/index.js` - Main store configuration
- `store/slices/` - Redux slices (feature-based state management)
- `store/hooks.js` - Typed hooks for using Redux

## Usage Examples

### Using Redux in Components

```javascript
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setCredentials, logout, selectIsAuthenticated } from '../store/slices/authSlice'

function MyComponent() {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  
  const handleLogin = () => {
    dispatch(setCredentials({
      user: { id: 1, name: 'John Doe' },
      token: 'your-token-here'
    }))
  }
  
  const handleLogout = () => {
    dispatch(logout())
  }
  
  return (
    <div>
      {isAuthenticated ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  )
}
```

### Creating a New Slice

Create a new file in `store/slices/`:

```javascript
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // your initial state
}

const mySlice = createSlice({
  name: 'myFeature',
  initialState,
  reducers: {
    // your reducers
  },
})

export const { action1, action2 } = mySlice.actions
export default mySlice.reducer
```

Then add it to `store/index.js`:

```javascript
import myReducer from './slices/mySlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    myFeature: myReducer,
  },
})
```


import {createStore, applyMiddleware, combineReducers} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import {composeWithDevTools} from 'remote-redux-devtools';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';

// Place your Reducers
// import { userReducer } from '@store/user';
import {userLoginReducer} from './userLogin';
// import { userRolesReducer } from '@store/userRoles';
// import { userPermissionsReducer } from '@store/userPermissions';
// import { currentFactoryReducer } from '@store/currentFactory';

// Add Reducers to Root Reducer
const rootReducer = combineReducers({
  //   user: userReducer,
  userLogin: userLoginReducer,
  //   userRoles :userRolesReducer,
  //   userPermissions :userPermissionsReducer,
  //   currentFactory : currentFactoryReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['loadingReducer'],
  debug: false,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [];

// Prevent using logger on production build
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
}

// Redux Thunk as Middleware
middleware.push(thunkMiddleware);

let useMiddleware;
if (process.env.NODE_ENV !== 'production') {
  // useMiddleware = composeWithDevTools(applyMiddleware(...middleware));
  useMiddleware = applyMiddleware(...middleware);
} else {
  useMiddleware = applyMiddleware(...middleware);
}

const store = createStore(persistedReducer, useMiddleware);
const persistor = persistStore(store);

export default () => ({persistor, store});

import { applyMiddleware, createStore, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

// import monitorReducersEnhancer from './utils/redux_config/monitorReducers';
// import loggerMiddleware from './utils/redux_config/logger';
import rootReducer from './reducers';

import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const persistConfig = {
    key: 'root',
    storage: storage,
    // blacklist: ['_persist', 'contactStore'], //黑名单 不保留
    whitelist: ['contactStore'], //白名单  只保留
    stateReconciler: autoMergeLevel2 // 查看 'Merge Process' 部分的具体情况
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
// export default function configureStore(preloadedState) {}


// const middlewares = [loggerMiddleware, thunkMiddleware, ]
// 打包的时候
const middlewares = [ thunkMiddleware, ]
const middlewareEnhancer = applyMiddleware( ...middlewares )


// const enhancers = [middlewareEnhancer, monitorReducersEnhancer, composeEnhancers]

// 打包的时候
const enhancers = [middlewareEnhancer, composeEnhancers]

const composedEnhancers = composeWithDevTools(...enhancers)
const myPersistReducer = persistReducer(persistConfig, rootReducer)
const store = createStore(myPersistReducer, composedEnhancers)
export const persistor = persistStore(store)
export default store

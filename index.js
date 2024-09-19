/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import store from './src/Redux/Store';

// const AppRedux = () => (
//     <Provider store={store}>
//         <App />
//     </Provider>
// )

AppRegistry.registerComponent(appName, () => App);

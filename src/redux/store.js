import {createStore,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composewithDevTools} from 'redux-devtools-extension';
import reducer from './reducer';
export default createStore(reducer,composewithDevTools(applyMiddleware(thunk)));
 
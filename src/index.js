import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from './components/SF/helpers';
import './index.css';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(
	<Provider>
		<App/>
	</Provider>
   , document.getElementById('root')
);

serviceWorker.register();

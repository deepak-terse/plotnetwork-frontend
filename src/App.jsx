import { Route, BrowserRouter, Switch } from 'react-router-dom';
import './App.scss';

//Components
import Home from './containers/Home';
import Login from './containers/Login';

import { AppRoutes } from './Routes';
import "./utils/i18n";

function App() {
	return (
		// Configuring all routes with its respective Components
		<BrowserRouter>
			<AppRoutes/>
		</BrowserRouter>
	);
}

export default App;
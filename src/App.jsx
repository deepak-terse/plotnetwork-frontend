import { Route, BrowserRouter, Switch } from 'react-router-dom';
import './App.scss';

//Components
import Home from './containers/Home';
import Login from './containers/Login';

import "./utils/i18n";

function App() {
	return (
		// Configuring all routes with its respective Components
		<BrowserRouter>
			<Switch>
				{/* <Route exact path="/" component={Home} /> */}
				<Route path="/login" component={Login} />
				<Route path="/" component={Home} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import Home from './containers/Home';
import Login from './containers/Login';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

ReactDOM.render(
	<BrowserRouter>
		<Switch>
			<Route exact path="/login" component={Login} />
			<Route path="/" component={Home} />
		</Switch>
	</BrowserRouter>,
	document.getElementById('root')
);


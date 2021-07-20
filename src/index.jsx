import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import Home from './containers/Home';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
	<BrowserRouter>
		<Home />
	</BrowserRouter>,
	document.getElementById('root')
);


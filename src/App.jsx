import React, { useState } from 'react';
import './App.scss';
import { AppRoutes } from './Routes';
import "./utils/i18n";

function App() {
	const isUserAuthenticated = localStorage.getItem("loggedInUser") ? true : false;

	return (
		<AppRoutes isUserAuthenticated = {isUserAuthenticated}/>
	);
}

export default App;
import React, { useState } from 'react';
import './App.scss';
import { AppRoutes } from './Routes';
import "./utils/i18n";
import {gSheetInit} from './utils/gsheet_utils'

function App() {
	const isUserAuthenticated = localStorage.getItem("loggedInUser") ? true : false;

	gSheetInit().then(() => {
		console.log("Success");
	}).catch(() => {
		console.log("Error");
	})
	return (
		<AppRoutes isUserAuthenticated = {isUserAuthenticated}/>
	);
}

export default App;
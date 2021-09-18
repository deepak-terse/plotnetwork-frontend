import React, { Suspense, lazy } from 'react';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';

import Spinner from './components/Spinner';

//Components
const Dashboard = lazy(() => import('./containers/Dashboard'));
const Leads = lazy(() => import('./containers/Leads'));
const Brokers = lazy(() => import('./containers/Brokers'));
const SalesTeam = lazy(() => import('./containers/SalesTeam'));
const Login = lazy(() => import('./containers/Login'));
const Home = lazy(() => import('./containers/Home'));
const Settings = lazy(() => import('./containers/Settings'));

const Error404 = lazy(() => import('./components/Error404'));
const Error500 = lazy(() => import('./components/Error500'));

export const AppRoutes = (props) => {
	return (
		<BrowserRouter>
			<Suspense fallback={<Spinner/>}>
				<Switch>
					<Route path="/login" component={Login} />
					<Route path="/404" component={ Error404 } />
					<Route path="/500" component={ Error500 } />
					<Route path="/">
						{props.isUserAuthenticated ? <Home/> : <Redirect to="/login" />}
					</Route>
				</Switch>
			</Suspense>
		</BrowserRouter>
		
	);
}

export const HomeRoutes = (props) => {
	const partner = localStorage.getItem('partner');
	const userType = JSON.parse(localStorage.getItem('loggedInUser')).userType;

	return (
		<Switch>
			{
				userType === "admin" ?
				<>
					<Route path={"/" + partner + "/dashboard"} component={ Dashboard } />
					<Route path={"/" + partner + "/salesteam"} component={ SalesTeam } />
					<Route path={"/" + partner + "/leads"} component={ Leads } />
					<Route path={"/" + partner + "/brokers"} component={ Brokers } />
					<Route path={"/" + partner + "/settings"} component={ Settings } />
					<Redirect to={"/" + partner + "/dashboard"} />
				</> : 
				<>
					<Route path={"/" + partner + "/leads"} component={ Leads } />
					<Route path={"/" + partner + "/brokers"} component={ Brokers } />
					<Redirect to={"/" + partner + "/leads"} />
				</>
			}
			

			
		</Switch>
	);
}

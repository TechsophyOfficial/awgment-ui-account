import React from 'react';
import { Route, Redirect, BrowserRouter } from 'react-router-dom';
import { USERS, GROUPS } from './constants/routes';
import Layout from './layout/Layout';
import Users from './components/users/Users';
import Groups from './components/groups/Groups';

const PrivateRoute = ({ component: Component, ...restProps }): React.ReactElement => {
    return (
        <Route
            {...restProps}
            render={(props): React.ReactElement => (
                <Layout>
                    <Component {...props} />
                </Layout>
            )}
        />
    );
};
const getBase = (currentLocation: string) => {
    console.log('currentLocation', currentLocation);
    const container = `${process.env.REACT_APP_MFE_CONTAINER_BASENAME}`;
    console.log('container env', container);
    if (container) {
        const url = currentLocation.includes(container) ? container : process.env.PUBLIC_URL;
        console.log('selected url', url);
        return url;
    }
    return process.env.PUBLIC_URL;
};
const Navigator = ({ history }: any): React.ReactElement => {
    // const { keycloak, initialized } = useKeycloak();
    // if (initialized && keycloak.authenticated) {
    const basename = getBase(window.location.href);
    return (
        <>
            <BrowserRouter basename={basename}>
                <PrivateRoute exact path={'/'} component={null}>
                    <Redirect to={GROUPS} />
                </PrivateRoute>
                <PrivateRoute path={USERS} component={Users} />
                <PrivateRoute path={GROUPS} component={Groups} />
            </BrowserRouter>
        </>
    );
    // }
    // return <div>Loading ... </div>;
};

export default Navigator;

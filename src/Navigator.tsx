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
const getBase = (currentLocation: string, config: any) => {
    const container = `${config.mfeContainerBasename}`;
    if (container) {
        const url = currentLocation.includes(container) ? container : config.publicAccountsUrl;
        return url;
    }
    return config.publicAccountsUrl;
};
const Navigator = ({ history, config }: any): React.ReactElement => {
    // const { keycloak, initialized } = useKeycloak();
    // if (initialized && keycloak.authenticated) {
    const basename = getBase(window.location.href, config);
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

import React from 'react';
// !--------- KEYCLOAK IMPORT -------------
import { useKeycloak } from '@react-keycloak/web';
import App from './App';

const AppWrapper = ({ history }): React.ReactElement => {
    const { keycloak } = useKeycloak();
    return <>{keycloak.authenticated && <App history={history} />}</>;
};

export default AppWrapper;

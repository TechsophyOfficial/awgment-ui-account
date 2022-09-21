import React from 'react';
import { createBrowserHistory } from 'history';

// !--------- KEYCLOAK IMPORT -------------
import { ReactKeycloakProvider } from '@react-keycloak/web';
// import keycloak from './keycloak';
import AppWrapper from './AppWrapper';
import Keycloak from 'keycloak-js';

const defaultHistory = createBrowserHistory();

const KeycloakWrapper = ({ history = defaultHistory, config }) => {
    // !--------- REMOVE KEYCLOAK CODE -------------

    const keycloak = new Keycloak({
        url: `${config.keyCloakUrl}auth/`,
        realm: `${config.keyCloakRealm}`,
        clientId: `${config.keyCloakClientId}`,
    });

    const setTokens = () => {
        const { token, refreshToken, idTokenParsed } = keycloak;
        if (token && refreshToken && idTokenParsed) {
            sessionStorage.setItem('react-token', token);
            localStorage.setItem('token', token);
            localStorage.setItem('currentUser', idTokenParsed.preferred_username); // For case inbox filter api
        }
    };

    const refreshAccessToken = () => {
        keycloak
            .updateToken(50)
            .success((refreshed) => {
                if (refreshed) {
                    setTokens();
                }
            })
            .error(() => {
                sessionStorage.clear();
                keycloak.logout();
            });
    };

    const handleEvent = (event) => {
        if (event === 'onAuthSuccess') {
            setTokens();
        }

        if (event === 'onTokenExpired') {
            refreshAccessToken();
        }

        if (event === 'onAuthLogout') {
            sessionStorage.clear();
        }
    };
    // !----------------------------------------------

    return (
        <ReactKeycloakProvider
            initOptions={{
                onLoad: 'login-required',
                checkLoginIframe: false,
            }}
            authClient={keycloak}
            onEvent={handleEvent}>
            <AppWrapper history={history} config={config} />
        </ReactKeycloakProvider>
    );
};

export default KeycloakWrapper;

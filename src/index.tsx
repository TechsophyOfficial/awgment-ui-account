import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import KeycloakWrapper from './KeycloakWrapper.jsx';
import { MfeDataProps } from './contexts/mfeDataContext copy/mfeData-context';
import { Co2Sharp } from '@mui/icons-material';
declare const window: any;

window.renderAccountsMFE = (containerId: any, history, userTableData: MfeDataProps) => {
    fetch('../accounts/config.json')
        .then(async (r) => r.json())
        .then((config) => {
            ReactDOM.render(
                <App config={config} userTableData={userTableData} history={history} />,
                document.getElementById(containerId),
            );
        });
    // ReactDOM.render(<App history={history} userTableData={userTableData} />, document.getElementById(containerId));
    serviceWorker.unregister();
};

window.unmountAccountsMFE = (containerId) => {
    ReactDOM.unmountComponentAtNode(document.getElementById(containerId) as HTMLElement);
};

if (!document.getElementById('AccountsMFE-container')) {
    fetch('../accounts/config.json')
        .then(async (r) => r.json())
        .then((config) => {
            ReactDOM.render(<KeycloakWrapper config={config} />, document.getElementById('root'));
        });
    // ReactDOM.render(<KeycloakWrapper />, document.getElementById('root'));
    serviceWorker.unregister();
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import KeycloakWrapper from './KeycloakWrapper';
import { MfeDataProps } from './contexts/mfeDataContext copy/mfeData-context';
declare const window: any;

window.renderAccountsMFE = (containerId: any, history, userTableData: MfeDataProps) => {
    ReactDOM.render(<App history={history} userTableData={userTableData} />, document.getElementById(containerId));
    serviceWorker.unregister();
};

window.unmountAccountsMFE = (containerId) => {
    ReactDOM.unmountComponentAtNode(document.getElementById(containerId) as HTMLElement);
};

if (!document.getElementById('AccountsMFE-container')) {
    ReactDOM.render(<KeycloakWrapper />, document.getElementById('root'));
    serviceWorker.unregister();
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

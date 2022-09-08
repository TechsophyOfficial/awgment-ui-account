import React from 'react';
import Navigator from './Navigator';
import ContextProvider from './ContextProvider';
import ThemeProvider from './contexts/themeContext/ThemeState';
import { MfeDataProps } from './contexts/mfeDataContext copy/mfeData-context';
import MfeDataState from './contexts/mfeDataContext copy/MfeDataState';
import { StyledEngineProvider } from '@mui/material';
import AppConfig from './appConfig.js';

interface AppProps {
    history: any;
    userTableData?: MfeDataProps;
    config: any;
}

const App: React.FC<AppProps> = ({ history, userTableData, config }): React.ReactElement => {
    return (
        <MfeDataState>
            <StyledEngineProvider injectFirst>
                <ThemeProvider>
                    <AppConfig.Provider value={config}>
                        <ContextProvider>
                            <Navigator history={history} config={config} />
                        </ContextProvider>
                    </AppConfig.Provider>
                </ThemeProvider>
            </StyledEngineProvider>
        </MfeDataState>
    );
};

export default App;

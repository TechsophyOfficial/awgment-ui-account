import React from 'react';
import Navigator from './Navigator';
import ContextProvider from './ContextProvider';
import ThemeProvider from './contexts/themeContext/ThemeState';
import { MfeDataProps } from './contexts/mfeDataContext copy/mfeData-context';
import MfeDataState from './contexts/mfeDataContext copy/MfeDataState';
import { StyledEngineProvider } from '@mui/material';

interface AppProps {
    history: any;
    userTableData?: MfeDataProps;
}

const App: React.FC<AppProps> = ({ history, userTableData }): React.ReactElement => {
    return (
        <MfeDataState>
            <StyledEngineProvider injectFirst>
                <ThemeProvider>
                    <ContextProvider>
                        <Navigator history={history} />
                    </ContextProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        </MfeDataState>
    );
};

export default App;

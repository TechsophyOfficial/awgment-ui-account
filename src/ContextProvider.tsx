import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import ConfirmationState from './contexts/confirmationContext/ConfirmationState';
import GroupState from './contexts/groupContext/GroupState';
import MfeDataContext, { MfeDataProps } from './contexts/mfeDataContext copy/mfeData-context';
import NotificationState from './contexts/notificationContext/NotificationState';
import SpinnerState from './contexts/spinnerContext/SpinnerState';
import ThemeContext from './contexts/themeContext/theme-context';
import UserState from './contexts/userContext/UserState';
import { getSelectedTheme, ThemeProps } from './services/ThemeService';
import Appconfig from './appConfig';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

const ContextProvider: React.FC<{ userTableData?: MfeDataProps }> = ({ children, userTableData }) => {
    const { theme, updateTheme } = useContext(ThemeContext);
    const { updateMfeData } = useContext(MfeDataContext);
    const appData = useContext<any>(Appconfig);
    userTableData && updateMfeData(userTableData);

    useEffect(() => {
        const setTheme = async () => {
            const selectedThemeRes = await getSelectedTheme(appData?.apiGatewayUrl);
            if (selectedThemeRes.success) {
                const selectedTheme = selectedThemeRes.data as ThemeProps;
                updateTheme(selectedTheme);
            }
        };
        setTheme();
        // eslint-disable-next-line
    }, []);
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <SpinnerState>
                    <ConfirmationState>
                        <NotificationState>
                            <UserState>
                                <GroupState>{children}</GroupState>
                            </UserState>
                        </NotificationState>
                    </ConfirmationState>
                </SpinnerState>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default ContextProvider;

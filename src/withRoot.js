import React from 'react';
import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import {
    MuiThemeProvider,
    createMuiTheme,
    createGenerateClassName,
    jssPreset,
} from 'material-ui/styles';
import grey from 'material-ui/colors/grey';
import CssBaseline from 'material-ui/CssBaseline';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            light: '#484848',
            main: '#212121',
            dark: '#000000',
            contrastText: '#ffffff',
        },
        secondary: {
            light: '#ffffff',
            main: '#fafafa',
            dark: '#c7c7c7',
            contrastText: '#000000',
        },
    }
});

const jss = create(jssPreset());

const generateClassName = createGenerateClassName();

function withRoot(Component) {
    function WithRoot(props) {
        return (
            <JssProvider jss={jss} generateClassName={generateClassName}>
                {/* MuiThemeProvider makes the theme available down the React tree
          thanks to React context. */}
                <MuiThemeProvider theme={theme}>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />
                    <Component {...props} />
                </MuiThemeProvider>
            </JssProvider>
        );
    }

    return WithRoot;
}

export default withRoot;
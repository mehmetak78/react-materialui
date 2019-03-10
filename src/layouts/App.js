import React, {Component, Fragment} from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';

import TopMenu from "./TopMenu";
import LeftMenu from "./LeftMenu";
import MiddlePage from "./MiddlePage"

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import '../styles/App.css';

import {BrowserRouter} from "react-router-dom";
import Landing from '../pageComponents/Landing';

class App extends Component {
    state = {
        menuOpened: true,
        userLoggedIn: false,
        themeSettings: {
            appTheme: "default",
            appFontSize:12,
            appPrimary: {
                main: '#2e7d32',
            },
            appSecondary: {
                main: '#388e3c',
            },
        }
    };

    toggleDrawer = () => {
        this.setState(prevState => ({ menuOpened: !prevState.menuOpened }));
    };

    handleLogIn = () => {
        this.setState({userLoggedIn: true})
    };

    handleLogOut = () => {
        this.setState({userLoggedIn: false});
    };

    handleToggleTheme = (theme) => {
        this.setState(prevSettings => ({themeSettings: {...prevSettings.themeSettings,appTheme: theme}}));
    };


    getTheme = () => {
        const {appTheme, appFontSize, appPrimary, appSecondary} = this.state.themeSettings;
        switch(appTheme) {
            case  "dark":
                case "light":  return createMuiTheme({
                palette: {
                    type: appTheme, // Switching the dark mode on is a single property value change.
                    primary: appPrimary,
                    secondary: appSecondary
                },
                typography: {
                    useNextVariants: true,
                    fontSize: appFontSize,
                    subtitle1: {
                        fontSize: appFontSize,
                        color: "red",
                        fontStyle: 'italic',
                        fontFamily: ["sans-serif",].join(','),
                    },
                    button: {
                        fontStyle: 'italic',
                        fontSize: appFontSize,
                    },
                }
            });

            default : return createMuiTheme({
                typography: {
                    useNextVariants: true
                }
            });
        }
    };


    render() {
        const { menuOpened, userLoggedIn } = this.state;
        return (
            <BrowserRouter>
                <CssBaseline>
                    <MuiThemeProvider theme={this.getTheme()}>
                        <div className={"App"}>
                            {userLoggedIn ?
                                <Fragment>
                                    <TopMenu toggleDrawer={this.toggleDrawer} handleLogOut={this.handleLogOut} handleToggleTheme={this.handleToggleTheme}/>
                                    <LeftMenu menuOpened={menuOpened}/>
                                    <MiddlePage/>
                                </Fragment>
                                :
                                <Fragment>
                                    <Landing handleLogIn={this.handleLogIn}/>
                                </Fragment>
                            }
                        </div>
                    </MuiThemeProvider>
                </CssBaseline>
            </BrowserRouter>
        );
    }
}

export default App;

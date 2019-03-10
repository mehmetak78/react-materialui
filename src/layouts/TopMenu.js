
/*
    Menu Data : Coming From topMenuData
    Menu Item Id :
        Each menu item has ".path" data which are used as unique identifier
        Each subMenu item's ".path" must start with the parent item's ".path".
    Icons :
        import all icons included in the menu data
        map from string to these imported components in "const menuIcons" in this file.
    Actions :
        implement actions in this.handleMenuClick
        ".path" is used for identifying the item clicked.
 */



import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import { withRouter } from 'react-router';

import {AppBar, Toolbar, IconButton, InputBase, Badge,
    MenuItem, Menu} from '@material-ui/core';

import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

import MoreIcon from '@material-ui/icons/MoreVert';

import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SettingsIcon from '@material-ui/icons/Settings';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';

import topMenuData from "../data/topMenuData";

const menuIcons = {
    "MailIcon": MailIcon,
    "NotificationsIcon": NotificationsIcon,
    "AccountCircleIcon": AccountCircleIcon,
    "SettingsIcon": SettingsIcon,
    "FaceIcon": FaceIcon,
    "DoneIcon": DoneIcon
};

const styles = theme => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },

    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },

    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 200,
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    subMenuTitle: {
        margin:5
    }
});

class TopMenu extends React.Component {
    state = {
        anchorEl: null,
        isMobileMenuOpen: null,
        mobileMenuOpen: false,
        badgetContent: {},
        menusOpen: {},
        showSubMenuItemsIcon: {}
    };



    componentWillMount = () => {
        const {history} = this.props;
        history.push("/Dashboard");
        this.initTopBarMenu();
    };

    initTopBarMenu = () => {
        let tmpBadgetContent = {};
        let tmpMenusOpen = {};
        let tmpShowSubMenuItemsIcon = {};
        topMenuData.forEach(item => {
            tmpBadgetContent[item.path] = "";
            tmpMenusOpen[item.path] = false;
            if (item.subMenu) {
                item.subMenu.forEach(subItem => {
                    tmpShowSubMenuItemsIcon[subItem.path] = subItem.showIcon;
                })
            }


        });
        this.setState({badgetContent:tmpBadgetContent, menusOpen:tmpMenusOpen, showSubMenuItemsIcon:tmpShowSubMenuItemsIcon});
    };

    handleMenuOpen = (path,e) => {
        e.preventDefault();
        this.setState({ anchorEl: e.currentTarget });
        this.setState(prevState => (
            {
                menusOpen: {...prevState.menusOpen, [path]: true  }
            }));
    };

    handleMenuClose = () => {
        this.setState({ anchorEl: null, mobileMoreAnchorEl: null, isMobileMenuOpen:false });
        let tmpMenusOpen = {};
        topMenuData.forEach(item => {
            tmpMenusOpen[item.path] = false;
        });
        this.setState({menusOpen:tmpMenusOpen});
    };

    handleMobileMenuOpen = event => {
        this.setState({ anchorEl: event.currentTarget, isMobileMenuOpen:true });
    };

    handleDefaultClicked = (path, e) => {
        e.preventDefault();
        let messageCount = 1;

        if (this.state.badgetContent[path] !== "") {
            messageCount = parseInt(this.state.badgetContent[path])+1;
        }
        this.setState(prevState => (
            {
                badgetContent: {...prevState.badgetContent, [path]: messageCount.toString()  }
            }));
    };

    setStateShowSubMenuItemsIcon = (path) => {
        const parentPath = path.substring(0,path.lastIndexOf("/"));
        let tmpShowSubMenuIcons = {};
        topMenuData.forEach(item => {
            if (item.path.startsWith(parentPath)) {
                    item.subMenu.forEach(subItem => {
                        if (item.multiSelect) {
                            if (subItem.path === path) {
                                tmpShowSubMenuIcons[subItem.path] = !this.state.showSubMenuItemsIcon[subItem.path];
                            }
                        }
                        else {

                            tmpShowSubMenuIcons[subItem.path] = subItem.path === path;
                        }
                    });

            }
        });
        this.setState(prevState=> (
            {
                showSubMenuItemsIcon:{...prevState.showSubMenuItemsIcon, ...tmpShowSubMenuIcons}
            }

        ));
    };



    handleMenuClick = (item, e) => {
        e.preventDefault();
        const {handleToggleTheme, handleLogOut} = this.props;

        const {path} = item;
        if (item.subMenu) {
            this.handleMenuOpen(path, e);
        }
        else {
            switch (item.path) {
                case "/profileMenu/myAccount":
                    break;
                case "/Debug/ShowState":
                    this.setStateShowSubMenuItemsIcon(item.path);
                    console.log(this.state);
                    break;
                case "/profileMenu/logOut":
                    handleLogOut();
                    break;
                case "/settingsMenu/default":
                    this.setStateShowSubMenuItemsIcon(item.path);
                    handleToggleTheme("default");
                    break;
                case "/settingsMenu/light":
                    this.setStateShowSubMenuItemsIcon(item.path);
                    handleToggleTheme("light");
                    break;
                case "/settingsMenu/dark":
                    this.setStateShowSubMenuItemsIcon(item.path);
                    handleToggleTheme("dark");
                    break;
                default:
                    this.handleDefaultClicked(path, e);
                    break;
            }
            this.handleMenuClose();
        }
    };

    renderSubMenu = (item) => {
        const { anchorEl } = this.state;
        const { classes } = this.props;

        const menuOpen = this.state.menusOpen[item.path];

        return (
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                transformOrigin={{vertical: 'top', horizontal: 'center'}}
                open={menuOpen}
                onClose={this.handleMenuClose}
            >
                {item.subMenu.map((subItem, index) => (
                    <MenuItem title={subItem.path} key={index} onClick={(e)=> this.handleMenuClick(subItem,e)}>
                        {this.state.showSubMenuItemsIcon[subItem.path]?subItem.icon?React.createElement(menuIcons[subItem.icon]):"":""}
                        <p className={classes.subMenuTitle}>{subItem.title}</p>
                    </MenuItem>))
                }
                </Menu>

        )
    };

    renderMobileMenu = () => {
        const {  anchorEl, isMobileMenuOpen } = this.state;

        //const isMobileMenuOpen = Boolean(mobileMenuOpen);
        return (
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                open={isMobileMenuOpen}
                onClose={this.handleMenuClose}
            >

                {topMenuData.map(item => (
                    <MenuItem key={item.path} onClick={(e)=> this.handleMenuClick(item,e)}>
                        <IconButton color="inherit" >
                            <Badge badgeContent={this.state.badgetContent[item.path]} color="secondary">
                                {React.createElement(menuIcons[item.icon])}
                            </Badge>
                        </IconButton>
                        <p>{item.title}</p>
                    </MenuItem>
                ))}
            </Menu>
        )
    };

    render() {
        const { classes, toggleDrawer } = this.props;

        return (
            <div className={classes.root}>
                <AppBar position="absolute" className={classNames(classes.appBar)}>
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer" onClick={toggleDrawer}>
                            <MenuIcon />
                        </IconButton>

                       {/* <IconMehmet />*/}

                        <div className={classes.grow} />
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                            />
                        </div>

                        <div className={classes.sectionDesktop}>
                            {topMenuData.map(item => (
                                <Fragment key={item.path}>
                                    <IconButton color="inherit" onClick={(e)=> this.handleMenuClick(item,e)}>
                                        <Badge badgeContent={this.state.badgetContent[item.path]} color="secondary">
                                            {React.createElement(menuIcons[item.icon])}
                                        </Badge>
                                    </IconButton>
                                    {item.subMenu? this.renderSubMenu(item): ""}
                                </Fragment>
                            ))}

                        </div>

                        <div className={classes.sectionMobile}>
                            <IconButton  onClick={this.handleMobileMenuOpen} color="inherit">
                                <MoreIcon />
                            </IconButton>
                            {this.renderMobileMenu()}
                        </div>


                    </Toolbar>
                </AppBar>


            </div>
        );
    }
}

TopMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(TopMenu));
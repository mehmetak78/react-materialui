
/*
    Menu Data : Coming From leftMenuData
    Menu Item Id :
        Each menu item has ".path" data which are used as unique identifier
        Each subMenu item's ".path" must start with the parent item's ".path".
    Icons :
        import all icons included in the menu data
        map from string to these imported components in "const menuIcons" in this file.
    Actions :
        implement actions in "MiddlePage.js" by routing according to the item's "path"
 */




import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {List, ListItem, ListItemText, Collapse, Drawer} from '@material-ui/core';


import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';



import { NavLink } from "react-router-dom";

import leftMenuData from "../data/leftMenuData";
import classNames from "classnames";


import DashboardIcon from "@material-ui/icons/Dashboard";
import DraftsIcon from "@material-ui/icons/Drafts";
import PeopleIcon from "@material-ui/icons/People";
import LayersIcon from "@material-ui/icons/Layers";
import BarChartIcon from "@material-ui/icons/BarChart";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";


const menuIcons = {
    "DashboardIcon": DashboardIcon,
    "DraftsIcon": DraftsIcon,
    "PeopleIcon": PeopleIcon,
    "LayersIcon": LayersIcon,
    "BarChartIcon": BarChartIcon,
    "ShoppingCartIcon": ShoppingCartIcon,
    "LibraryBooksIcon": LibraryBooksIcon
};

const styles = theme => ({
    navlink: {
        textDecoration: "none"
    },
    appBarSpacer: theme.mixins.toolbar,
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: theme.spacing.unit * 30,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing.unit * 7,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 7,
        },
    },
});

class LeftMenu extends React.Component {

    state = {
        collapsed:
            {
            },
    };
    leftMenuCollapsed = {};

    componentWillMount = () => {
        this.initLeftMenu(leftMenuData);
    };

    nestedStyle = (depth) => {
        depth = depth ? depth*15 : 15;
        return {
            paddingLeft: `${depth}px`
        }
    };

    initLeftMenu = () => {
        this.initCollapsedRcrsv(leftMenuData);
        console.log(this.leftMenuCollapsed);
        this.setState(
            {
                collapsed:
                    {
                        ...this.leftMenuCollapsed
                    }
            }
        );
    };

    initCollapsedRcrsv = (menuItems) => {
        menuItems.forEach(item => {
            if (Array.isArray(item.subMenu)) {
                this.leftMenuCollapsed = {...this.leftMenuCollapsed,[item.path]:false};
                this.initCollapsedRcrsv(item.subMenu);
            }
        })
    };

    handleClick = (item,e) => {
         e.preventDefault();

         this.setState((prevState) => (
            {collapsed: {...prevState.collapsed,[item.path]:!prevState.collapsed[item.path]}})
         );
    };

    renderMenuItem = (item, depth) => {
        const {classes, menuOpened} = this.props;

        let path = item.path;
        let prevCollapsed = true;
        let collapsed = this.state.collapsed[path];

        depth = depth * menuOpened;

        Object.keys(this.state.collapsed).forEach(key => {
            if (item.path.startsWith(key+"/")) {
                prevCollapsed = prevCollapsed && this.state.collapsed[key]
            }
        });

        if (item.subMenu) {
            return (
                <Collapse in={prevCollapsed} timeout="auto" unmountOnExit key={item.path} >
                    <NavLink to={"#"} className={classes.navlink} onClick={(e) => this.handleClick(item,e)} >
                        <ListItem button style={this.nestedStyle(depth)}>
                            {React.createElement(menuIcons[item.icon],{color:"primary"})}
                            <ListItemText  inset primary={item.title}/>
                            {collapsed ? <ExpandLess color={"primary"}/> : <ExpandMore color={"primary"}/>}
                        </ListItem>
                    </NavLink>
                </Collapse>
            )
        }
        else {
            return (
                <Collapse in={prevCollapsed} timeout="auto" unmountOnExit key={item.path}>
                    <NavLink to={item.path} className={classes.navlink}>
                        <ListItem button style={this.nestedStyle(depth)}>
                            {React.createElement(menuIcons[item.icon],{color:"primary"})}
                            <ListItemText inset primary={item.title}/>
                        </ListItem>
                    </NavLink>
                </Collapse>
            )
        }
    };

    renderMenuRcrsv = (menuItems, depth) => {
        menuItems.forEach(item => {
            if (Array.isArray(item.subMenu)) {
                this.leftMenuData.push(
                    this.renderMenuItem(item, depth)
                );

                this.renderMenuRcrsv(item.subMenu, depth + 1);
            }
            else {
                this.leftMenuData.push(
                    this.renderMenuItem(item, depth)
                );
            }
        })
    };

    renderMenu = (menuItems) => {
        this.leftMenuData= [];
        this.renderMenuRcrsv(menuItems, 1);
        return this.leftMenuData;
    };

    render() {

        const { classes, menuOpened } = this.props;
        return (
            <Drawer
                variant="permanent"
                classes={{
                    paper: classNames(classes.drawerPaper, !menuOpened && classes.drawerPaperClose),
                }}
                open={menuOpened}
            >
                <List component="nav">
                    <div className={classes.appBarSpacer} />
                    {this.renderMenu(leftMenuData)}
                </List>
            </Drawer>
        );
    }
}

LeftMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LeftMenu);
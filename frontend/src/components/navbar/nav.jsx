import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, Drawer, AppBar, Toolbar, List, CssBaseline, Typography, Divider, IconButton, ListItem, ListItemIcon, ListItemText, Badge, Link } from '@material-ui/core';
import { Menu as MenuIcon, ChevronRight as ChevronRightIcon, ChevronLeft as ChevronLeftIcon, Home as HomeIcon, AmpStories as NewsIcon, Book as BlogIcon, AccountCircle as ProfileIcon, Notifications as NotificationsIcon, Dashboard as CraftIcon, Chat as ChatIcon } from '@material-ui/icons';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    menuIcon: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'],{
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        background: 'linear-gradient(to right, #4776E6, #8E54E9)',
        transition: theme.transitions.create(['width', 'margin'],{
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    menuButton: {
        marginRight: 36
    },
    hide: {
        display: 'none',
    },
    drawer: {
        background: 'linear-gradient(to bottom, #4776E6, #8E54E9)',
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap'
    },
    drawerOpen: {
        background: 'linear-gradient(to bottom, #4776E6, #8E54E9)',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerClose: {
        background: 'linear-gradient(to bottom, #4776E6, #8E54E9)',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(7) + 1
        }
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    }
}));

export default function Nav(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    }
    const handleDrawerClose = () => {
        setOpen(false);
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open
                })}
            >
                <Toolbar>
                    <IconButton
                        color="transparent"
                        aria-label="open menu"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuIcon, {
                            [classes.hide]: open
                        })}
                    >
                        <MenuIcon style={{ color: 'white' }} />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        {props.title}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open
                    })
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon style={{ color: 'white' }} /> : <ChevronLeftIcon style={{ color: 'white' }} />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {['Home','News','Blog','Profile'].map((text,index) => (
                        <Link href={"/" + text.toLowerCase()} underline="none">
                            <ListItem button key={text}>
                                <ListItemIcon>
                                    { index === 0 && <HomeIcon style={{ color: 'white' }} /> }
                                    { index === 1 && <NewsIcon style={{ color: 'white' }} /> }
                                    { index === 2 && <BlogIcon style={{ color: 'white' }} /> }
                                    { index === 3 && <ProfileIcon style={{ color: 'white' }} /> }
                                </ListItemIcon>
                                <ListItemText primary={text} style={{ color: 'white' }} />
                            </ListItem>
                        </Link>
                    ))}
                </List>
                <Divider />
                <List>
                    {['Notifications','Crafts','Chat'].map((text,index) => (
                        <Link href={"/" + text.toLowerCase()} underline="none">
                            <ListItem button key={text}>
                                <ListItemIcon style={{ color: 'white' }}>
                                    { index === 0 && <Badge badgeContent={12} color="error"><NotificationsIcon style={{ color: 'white' }} /></Badge> }
                                    { index === 1 && <CraftIcon style={{ color: 'white' }} /> }
                                    { index === 2 && <ChatIcon style={{ color: 'white' }} /> }
                                </ListItemIcon>
                                <ListItemText primary={text} style={{ color: 'white' }} />
                            </ListItem>
                        </Link>
                    ))}
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {props.children}
            </main>
        </div>
    )

}
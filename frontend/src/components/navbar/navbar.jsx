import React from 'react';
import { AppBar, Menu, MenuItem, Toolbar, IconButton, Link, InputBase, makeStyles, fade, Typography } from '@material-ui/core';
import { Menu as MenuIcon, Search as SearchIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        background: 'linear-gradient(to right, #4776e6, #8e54e9)' /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block'
        }
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover':{
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto'
        }
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputRoot: {
        color: 'inherit'
    },
    inputInput: {
        padding: theme.spacing(1,1,1,0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch'
            }
        }
    },
    activeMenu: {
        backgroundColor: '#4776e6',
        boxShadow: theme.shadows[1],
        '&:hover':{
            backgroundColor: '#4776e6'
        }
    }
}));

export default function NavBar(props) {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        // <div className={classes.root}>
            <AppBar position="static" className={classes.root}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="open menu"
                        aria-controls="navmenu"
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="navmenu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem className={ props.title === 'Home' ? classes.activeMenu : '' }><Link href="/" underline="none" color="textSecondary">Home</Link></MenuItem>
                        <MenuItem className={ props.title === 'News' ? classes.activeMenu : '' }><Link href="/news" underline="none" color="textSecondary">News</Link></MenuItem>
                        <MenuItem className={ props.title === 'Blog' ? classes.activeMenu : '' }><Link href="/blog" underline="none" color="textSecondary">Blog</Link></MenuItem>
                        <MenuItem className={ props.title === 'Profile' ? classes.activeMenu : '' }><Link href="/profile" underline="none" color="textSecondary">Profile</Link></MenuItem>
                    </Menu>
                    <Typography className={classes.title} variant="h6" noWrap>
                        {props.title}
                    </Typography>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search..."
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        >

                        </InputBase>
                    </div>
                </Toolbar>
            </AppBar>
        // </div>
    )
}
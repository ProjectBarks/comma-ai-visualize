import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import MaterialAppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    }
};

function AppBar(props) {
    const { classes, selected, modes, onModeChange } = props;

    const menuItems = modes.map((content, index) => {
        return <MenuItem key={index} value={index}>{content}</MenuItem>;
    });

    return (
        <div className={classes.root}>
            <MaterialAppBar position='absolute'>
                <Toolbar>
                    <Typography variant='title' color='inherit' className={classes.flex}>
                        Comma AI Visualizer
                    </Typography>
                    <Select onChange={onModeChange} value={selected}>
                        {menuItems}
                    </Select>
                </Toolbar>
            </MaterialAppBar>
        </div>
    );
}

AppBar.defaultProps  = {
    selected: 0,
    onModeChange: () => null,
};

AppBar.propTypes = {
    modes: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    selected: PropTypes.number,
    onModeChange: PropTypes.func,
};

export default withStyles(styles)(AppBar);

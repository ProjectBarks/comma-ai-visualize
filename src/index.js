import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import AppBar from './components/AppBar';
import SpeedDistributionLayer from './components/SpeedDistributionLayer';
import withRoot from './withRoot';
import MapGL from 'react-map-gl';
import ReactDOM from "react-dom";

const styles = theme => ({});

class App extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
    };

    state = {
        viewport: {
            width: 500,
            height: 500,
            latitude: 39.132994,
            longitude: -96.59936,
            zoom: 4.5,
        }
    };

    componentDidMount() {
        window.addEventListener('resize', this._resize.bind(this));
        this._resize();
    }

    _resize() {
        this._onViewportChange({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    _onViewportChange(viewport) {
        this.setState({
            viewport: {...this.state.viewport, ...viewport}
        });
    }

    render() {
        const {classes} = this.props;
        const {viewport} = this.state;

        return (
            <div className={classes.root}>
                <AppBar modes={['Speed Distributions', 'Live Driving', 'Heatmap', 'Intersections']}/>

                <MapGL
                    {...viewport}
                    mapStyle={'mapbox://styles/mapbox/dark-v9'}
                    mapboxApiAccessToken={'pk.eyJ1IjoicHJvamVjdGJhcmtzIiwiYSI6ImNqZjZhazg2eTFpbHozMmwzamcyZmM5YWIifQ.wT2Y9SYlqu-3x9CBqfzU6Q'}
                    onViewportChange={this._onViewportChange.bind(this)}>
                    <SpeedDistributionLayer viewport={viewport}/>
                </MapGL>
            </div>
        )
    }
}

App = withRoot(withStyles(styles)(App));

ReactDOM.render(<App/>, document.querySelector('#root'));


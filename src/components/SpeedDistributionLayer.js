import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {setParameters} from 'luma.gl';
import DeckGL, { LineLayer } from 'deck.gl';
import fetch from "node-fetch";

function toRGB(hex){
    hex = hex.replace('#','');
    const r = parseInt(hex.substring(0,2), 16);
    const g = parseInt(hex.substring(2,4), 16);
    const b = parseInt(hex.substring(4,6), 16);

    return [r, g, b, 150];
}


export default class SpeedDistributionLayer extends Component {

    static propTypes = {
        viewport: PropTypes.object,
        maxColor: PropTypes.string,
        minColor: PropTypes.string,
    };

    static defaultProps = {
        maxColor: '#ff0002',
        minColor: '#0099ff',
    };

    state = {
        data: []
    };

    componentDidMount() {
        this.getColor = this.getColor.bind(this);

        const fetchPage = page =>
            fetch(`/path?normalize=true&page=${page}`)
                .then(response => response.json())
                .then(json => {
                    if (json.length > 0)
                        fetchPage(page + 1);
                    this.setState({ data: this.state.data.concat(json) })
                })
                .catch(e => console.log(e));
        fetchPage(0);
    }

    getColor(point) {
        const { maxColor, minColor } = this.props;
        const color1 = toRGB(maxColor);
        const color2 = toRGB(minColor);

        return color1.map((hue, index) => (hue + point['speed'] * (color2[index] - hue)));
    }

    render() {
        const { viewport } = this.props;
        const { data } = this.state;

        if (data.length <= 0)
            return null;

        return <DeckGL {...viewport} layers={[
            new LineLayer({
                strokeWidth: 5 + Math.max((viewport.zoom - 8), 0),
                fp64: true,
                getSourcePosition: d => data[d.sourceIndex].target,
                getTargetPosition: d => d.target,
                getColor: this.getColor,
                data,
            })
        ]} />
    }
}

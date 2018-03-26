const express = require('express');
const path = require('path');
const { Client, Query } = require('pg');


const app = express();
const client = new Client();

if (process.env.NODE_ENV !== 'production') {
    const config = require('../webpack.config');
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');

    compiler = webpack({ ...config, mode: 'development' });

    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        stats: { colors: true }
    }));

    app.use(webpackHotMiddleware(compiler, {
        log: console.log
    }));
}

app.use('/', express.static(path.join(__dirname, '../public')));

const handle = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);


const PAGE_STEP_SIZE = 100;

const ALL_POINTS_QUERY = page => `
    SELECT trip_id, 
       index, 
       st_y(coordinate) AS lat, 
       st_x(coordinate) AS lng, 
       speed_mph 
    FROM points
    WHERE trip_id >= ${page * PAGE_STEP_SIZE} AND trip_id < ${(page + 1) * PAGE_STEP_SIZE}
    ORDER BY trip_id ASC, index DESC; 
`;

const PREVIOUS_PAGE_COUNT = page => `
    SELECT count(id)
    FROM points
    WHERE trip_id >= 0 AND trip_id < ${page * PAGE_STEP_SIZE};
`;

const AVERAGE_TRIP_SPEED = `
    SELECT avg(speed_mph) 
    FROM   points 
    GROUP  BY trip_id 
    ORDER  BY trip_id ASC; 
`;

app.get('/path', handle(async (req, res) => {
    const page = req.query['page'] ? parseInt(req.query['page']) : 0;
    let transformSpeed = row => row['speed_mph'];
    if (req.query['normalize']) {
        const speeds = await client.query(AVERAGE_TRIP_SPEED).then(res => res.rows);
        transformSpeed = row => row['speed_mph'] / speeds[row['trip_id'] - 1]['avg'];
    }

    let index = parseInt(await client.query(PREVIOUS_PAGE_COUNT(page)).then(res => res['rows'][0]['count']));
    const points = [];
    const query = Query(ALL_POINTS_QUERY(page));
    client.query(query);
    query
        .on('row', row => {
            points.push({
                target: [Number(row['lng'].toFixed(10)), Number(row['lat'].toFixed(10))],
                sourceIndex: row['index'] !== 0 ? index + 1 : index,
                speed: Number(transformSpeed(row).toFixed(1))
            });
            index++;
        })
        .on('end', () => res.send(JSON.stringify(points)))
        .on('error', e => console.log(e));
}));

app.get('/path', handle(async (req, res) => {
    const page = req.query['page'] ? parseInt(req.query['page']) : 0;
    let transformSpeed = row => row['speed_mph'];
    if (req.query['normalize']) {
        const speeds = await client.query(AVERAGE_TRIP_SPEED).then(res => res.rows);
        transformSpeed = row => row['speed_mph'] / speeds[row['trip_id'] - 1]['avg'];
    }

    const points = [];
    const query = Query(ALL_POINTS_QUERY(page));
    client.query(query);
    if (row['index'] !== 0)
    query
        .on('row', row => {
            points.push({
                target: [Number(row['lng'].toFixed(10)), Number(row['lat'].toFixed(10))],
                sourceIndex: row['index'] !== 0 ? index + 1 : index,
                speed: Number(transformSpeed(row).toFixed(1))
            });
            index++;
        })
        .on('end', () => res.send(JSON.stringify(points)))
        .on('error', e => console.log(e));
}));

client.connect();
app.listen(process.env.PORT || 3000);


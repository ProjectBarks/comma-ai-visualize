/**
 * For this to work please set the following environment variables:
 *    PGUSER=dbuser
 *    PGHOST=database.server.com
 *    PGPASSWORD=secretpassword
 *    PGDATABASE=mydb
 *    PGPORT=3211
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

function readDirectory(directory) {
    return new Promise((resolve, reject) => fs.readdir(directory, (err, files) => {
        if (err)
            reject(err);
        else {
            resolve(files);
        }
    }));
}

function readDataEntry(fileName) {
    const entryPath = path.resolve(__dirname, `data/${fileName}`);

    return new Promise((resolve, reject) => fs.readFile(entryPath, 'utf8', (err, data) => {
        if (err)
            reject(err);
        else
            resolve(JSON.parse(data));
    }));
}

async function transfer() {
    console.log('Importing data!');
    const client = new Client();

    await client.connect();

    await client.query(`
        CREATE TABLE IF NOT EXISTS "trips" (
            "id" serial,
            "start_time" TIMESTAMP NOT NULL,
            PRIMARY KEY ("id")
        );
    `);

    await client.query(`
        CREATE TABLE IF NOT EXISTS "points" (
            "id" serial,
            "trip_id" integer NOT NULL,
            "index" integer NOT NULL,
            "coordinate" geometry(Point, 4326) NOT NULL,
            "speed_mph" real NOT NULL,
            PRIMARY KEY ("id"),
            FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE CASCADE,
            CHECK (index >= 0)
        );
    `);

    async function isTableEmpty(table) {
        return client.query(`SELECT count(*) FROM (SELECT 1 FROM ${table} LIMIT 1) as t`)
            .then(res => res.rows[0]['count'])
            .then(count => count === '0');

    }

    if (!(await isTableEmpty('trips')) || !(await isTableEmpty('points')))
        return console.log('Data exists on table! Exiting early...');

    //list all files
    await readDirectory(path.resolve(__dirname, 'data'))
        //read all files in the data folder
        .then(files => Promise.all(files.map(file => readDataEntry(file)
            .then(async data => {
                const { start_time, coords } = data;
                const { id } = await client.query(`INSERT INTO "trips"("start_time") VALUES(TIMESTAMP \'${start_time}\') RETURNING "id"`)
                    .then(res => res.rows[0]);

                const entries = coords.map(coord => `(${id}, ${coord['index']}, ST_SetSRID(ST_MakePoint(${coord['lng']}, ${coord['lat']}), 4326), ${coord['speed']})`);

                console.log(`Importing... ${start_time}` );
                ///await client.query(pointQuery(id, coord['index'], coord['lng'], coord['lat'], coord['speed']))
                return client.query(`INSERT INTO "points"("trip_id", "index", "coordinate", "speed_mph")
                    VALUES ${entries.join(', ')}
                    RETURNING "id"`
                ).then(() => console.log(`Imported ${start_time}`))
            })
        )));

    console.log('Imported!');
    return client.end()
}

transfer().then(() => process.exit());
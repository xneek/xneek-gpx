#!/usr/bin/env node

const {gpxStringToXneekGpx} = require("../lib/converters/gpx2xneek-gpx");

const fs = require("fs");

const args = process.argv;

const gpxString = fs.readFileSync(args[2]);
const json = gpxStringToXneekGpx(gpxString);

const arg3 = args[3];

if (arg3 && arg3 !== '--format') {
    fs.writeFileSync(where, JSON.stringify(json, null, '  '));
    console.log('DONE')
    console.log(where)
} else {
    process.stdout.write(arg3 === '--format' ? JSON.stringify(json, null, '  ') : JSON.stringify(json));
}

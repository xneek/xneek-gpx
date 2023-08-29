#!/usr/bin/env node

const {xneekGpxToGPX} = require("../lib/converters/xneek-gpx2gpx");
const fs = require("fs");

const args = process.argv;
const jsonString = fs.readFileSync(args[2]);
const xneekGpx = JSON.parse(jsonString);
const xml = xneekGpxToGPX(xneekGpx);

const arg3 = args[3];

if (arg3 && arg3 !== '--format') {
    fs.writeFileSync(arg3, xml);
    console.log('DONE')
    console.log(arg3)
} else {
    process.stdout.write(arg3 === '--format' ? xml : xml.replace(/[\r\n]+/g, '').replace(/>\s+</g, '><'));
}

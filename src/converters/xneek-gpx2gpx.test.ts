import {describe, expect, test} from '@jest/globals';
import {gpxStringToXneekGpx} from "./gpx2xneek-gpx";
import {xneekGpxToGPX} from "./xneek-gpx2gpx";
const fs = require("fs");
const path = require("path");

const samplesFolder = path.join(__dirname, "../", "samples");

const gpxFile = path.join(samplesFolder, "1km.gpx");
const gpxString = fs.readFileSync(gpxFile).toString();

const xneekGpxFile = path.join(samplesFolder, "1km.json");
const xneekGpxRaw = fs.readFileSync(xneekGpxFile);
const xneekGpx = JSON.parse(xneekGpxRaw);



describe('xneek-gpx to gpx (xml)', () => {
    test('Simple gpx', () => {
        const encoded = xneekGpxToGPX(xneekGpx);
        expect(encoded).toEqual(gpxString);
    });
})

import {describe, expect, test} from '@jest/globals';
import {gpxStringToXneekGpx} from "./gpx2xneek-gpx";
const fs = require("fs");
const path = require("path");

const samplesFolder = path.join(__dirname, "../", "samples");

const gpxFile = path.join(samplesFolder, "БЛП23_День4_2023-07-07.gpx");
const gpxString = fs.readFileSync(gpxFile);

const xneekGpxFile = path.join(samplesFolder, "БЛП23_День4_2023-07-07.json");
const xneekGpxRaw = fs.readFileSync(xneekGpxFile);
const xneekGpx = JSON.parse(xneekGpxRaw);



describe('gpx to xneek-gpx', () => {
    test('Simple', () => {
        const encoded = gpxStringToXneekGpx(gpxString);
        expect(encoded).toMatchObject(xneekGpx);
    });
})

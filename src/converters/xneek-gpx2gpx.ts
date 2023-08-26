import {IXneekGpx, IXneekTrackSegment} from "../@types/xneek-gpx";
import {decodeNumbersSequence} from "../xneek-gpx";
const { XMLBuilder } = require("fast-xml-parser");

export const xneekGpxToGPX = (xneekGPXObj?: IXneekGpx): string => {

    const builder = new XMLBuilder({
        arrayNodeName:'trk',
        ignoreAttributes: false,
        attributeNamePrefix: "__",
        format: true
    });

    const metadata: any = {};

    if (xneekGPXObj.metadata.name) { metadata.name = xneekGPXObj.metadata.name; }
    if (xneekGPXObj.metadata.time) { metadata.time = xneekGPXObj.metadata.time; }

    const mapped = {
        "?xml": {
            "__version": "1.0",
            "__encoding": "UTF-8"
        },
        "gpx": {
            "metadata": metadata,
            "trk": {
                "name": xneekGPXObj.trk.name,
                "trkseg": xneekGPXObj.trk.trkseg.filter((trkseg) => trkseg.kind === 'segment').map((trkseg: IXneekTrackSegment) => {
                    let startDate = new Date(trkseg.start);
                    const times = decodeNumbersSequence(trkseg.times);
                    const lat = decodeNumbersSequence(trkseg.lat);
                    const lon = decodeNumbersSequence(trkseg.lon);

                    const ele = trkseg.ele ? decodeNumbersSequence(trkseg.ele) : [];
                    const hr = trkseg.hr ? decodeNumbersSequence(trkseg.hr) : [];
                    const temp = trkseg.temp ? decodeNumbersSequence(trkseg.temp) : [];

                    return {
                        name: trkseg.name,
                        trkpt: times.map((timeOffset, i) => {
                            startDate = new Date(startDate.getTime() + (times[i]*1000));

                            const additional: any = {};

                            if (ele[i]) {
                                additional.ele = ele[i]
                            }

                            if (hr[i]) {
                                if (!additional.extensions) { additional.extensions = { 'gpxtpx:TrackPointExtension': {} } }
                                additional.extensions['gpxtpx:TrackPointExtension']['gpxtpx:hr'] = hr[i];
                            }

                            if (temp[i] && temp[i] !== -270) {
                                if (!additional.extensions) { additional.extensions = { 'gpxtpx:TrackPointExtension': {} } }
                                additional.extensions['gpxtpx:TrackPointExtension']['gpxtpx:atemp'] = temp[i];
                            }

                            return {
                                '__lat': lat[i],
                                '__lon': lon[i],
                                time: startDate && startDate.toISOString(),
                                ...additional
                            }
                        })
                    }
                })
            },
            "__version": "1.1",
            "__creator": "xneek-gpx",
            "__xmlns": "http://www.topografix.com/GPX/1/1",
            "__xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "__xmlns:gte": "http://www.gpstrackeditor.com/xmlschemas/General/1",
            "__xmlns:gpxtpx": "http://www.garmin.com/xmlschemas/TrackPointExtension/v1",
            "__xmlns:gpxx": "http://www.garmin.com/xmlschemas/GpxExtensions/v3",
            "__targetNamespace": "http://www.topografix.com/GPX/1/1",
            "__elementFormDefault": "qualified",
            "__xsi:schemaLocation": "http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd"
        }
    };

    const output = builder.build(mapped);

    return output;

}

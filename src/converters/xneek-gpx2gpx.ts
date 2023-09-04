import {IXneekGpx, IXneekTrackSegment} from "../@types/xneek-gpx";
import {decodeNumbersSequence} from "../xneek-gpx";
import {
    maxPossibleAtemp,
    maxPossibleEle,
    maxPossibleHr,
    minPossibleAtemp,
    minPossibleEle,
    minPossibleHr
} from "./constants";
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

                    console.log(lat.join('_'))

                    const ele = trkseg.ele ? decodeNumbersSequence(trkseg.ele) : [];
                    const hr = trkseg.hr ? decodeNumbersSequence(trkseg.hr) : [];
                    const temp = trkseg.temp ? decodeNumbersSequence(trkseg.temp) : [];

                    return {
                        name: trkseg.name,
                        trkpt: times.map((timeOffset, i) => {
                            startDate = new Date(startDate.getTime() + (times[i]*1000));

                            const additional: any = {};

                            if (ele[i] && ele[i] >= minPossibleEle && ele[i] <= maxPossibleEle) {
                                additional.ele = ele[i]
                            }

                            if (hr[i] && hr[i] >= minPossibleHr && hr[i] <= maxPossibleHr) {
                                if (!additional.extensions) { additional.extensions = { 'ns3:TrackPointExtension': {} } }
                                additional.extensions['ns3:TrackPointExtension']['ns3:hr'] = hr[i];
                            }

                            if (temp[i] && temp[i] >= minPossibleAtemp && temp[i] <= maxPossibleAtemp) {
                                if (!additional.extensions) { additional.extensions = { 'ns3:TrackPointExtension': {} } }
                                additional.extensions['ns3:TrackPointExtension']['ns3:atemp'] = temp[i];
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
            "__creator": xneekGPXObj.metadata.creator ?? "xneek-gpx",
            "__version": "1.1",
            "__xsi:schemaLocation": "http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/11.xsd",
            "__xmlns:ns3": "http://www.garmin.com/xmlschemas/TrackPointExtension/v1",
            "__xmlns": "http://www.topografix.com/GPX/1/1",
            "__xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "__xmlns:ns2": "http://www.garmin.com/xmlschemas/GpxExtensions/v3",
        }
    };

    const output = builder.build(mapped);

    return output;

}

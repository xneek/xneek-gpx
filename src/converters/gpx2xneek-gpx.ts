import {IXneekGpx, IXneekTrackSegment} from "../@types/xneek-gpx";
import {encodeNumbersSequence} from "../xneek-gpx";
import {IParsedGPX} from "../@types/gpx";
const { XMLParser } = require("fast-xml-parser");


export const gpxStringToXneekGpx = (gpxString?: string): IXneekGpx => {

    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix : "",
        isArray: (name: string, jpath: string, isLeafNode: boolean, isAttribute: boolean) => {
            if( ['gpx.trk.trkseg'].indexOf(jpath) !== -1) return true;
        }
    });
    let jObj: IParsedGPX = parser.parse(gpxString);

    //return (JSON.stringify(jObj, null, '  '));

    const metadata: Partial<IXneekGpx['metadata']> = {};

    if (jObj.gpx.metadata.name) { metadata.name = jObj.gpx.metadata.name; }
    if (jObj.gpx.metadata.time) { metadata.time = jObj.gpx.metadata.time; }
    if (jObj.gpx.creator) { metadata.creator = jObj.gpx.creator; }

    return {
        metadata,
        trk: {
            name: jObj.gpx.trk.name,
            trkseg: jObj.gpx.trk.trkseg.map((trkseg, i) => {
                const { trkpt } = trkseg;
                let firstTime = new Date(trkpt[0].time).getTime();

                const p: IXneekTrackSegment = {
                    kind: "segment",
                    start: trkpt[0].time,
                    times: encodeNumbersSequence(trkpt.map(({time}) => {
                        const curTime = new Date(time).getTime();
                        const diff = curTime - firstTime;

                        firstTime = curTime;

                        return diff / 1000;
                    })),
                    lat: encodeNumbersSequence(trkpt.map(({lat}) => +lat)),
                    lon: encodeNumbersSequence(trkpt.map(({lon}) => +lon)),

                };

                if (trkpt.some(({ele}) => !!ele)) {
                    p.ele = encodeNumbersSequence(trkpt.map(({ele}) => +ele ?? 0));
                }
                if (trkpt.some((point) => point?.extensions?.['gpxtpx:TrackPointExtension']?.['gpxtpx:hr'])) {
                    p.hr = encodeNumbersSequence(trkpt.map((point) => +point?.extensions?.['gpxtpx:TrackPointExtension']?.['gpxtpx:hr'] ?? 0));
                }

                if (trkpt.some((point) => point?.extensions?.['gpxtpx:TrackPointExtension']?.['gpxtpx:atemp'])) {
                    p.temp = encodeNumbersSequence(trkpt.map((point) => +point?.extensions?.['gpxtpx:TrackPointExtension']?.['gpxtpx:atemp'] ?? -270));
                }

                return p;
            })

        }
    };
}

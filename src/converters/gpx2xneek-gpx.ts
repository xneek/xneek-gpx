import {IXneekGpx, IXneekTrackSegment} from "../@types/xneek-gpx";
import {encodeNumbersSequence} from "../xneek-gpx";
import {IParsedGPX, IParsedGPXTrkPt} from "../@types/gpx";
import {
    maxPossibleAtemp,
    maxPossibleEle,
    maxPossibleHr,
    minPossibleAtemp,
    minPossibleEle,
    minPossibleHr, skipAtemp,
    skipEle,
    skipHr
} from "./constants";
const { XMLParser } = require("fast-xml-parser");
const pjson = require('../../package.json');


const getFromExtension = (point: IParsedGPXTrkPt, namespace: 'gpxtpx' | 'ns3', key: 'hr' | 'atemp'): number | undefined => {
    if (point?.extensions?.[`gpxtpx:TrackPointExtension`]) {
        return point?.extensions[`gpxtpx:TrackPointExtension`]?.[`gpxtpx:${key}`]
    }

    if (point?.extensions?.[`ns3:TrackPointExtension`]) {
        return point?.extensions[`ns3:TrackPointExtension`]?.[`ns3:${key}`]
    }
}

export const gpxStringToXneekGpx = (gpxString?: string): IXneekGpx => {

    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix : "",
        isArray: (name: string, jpath: string, isLeafNode: boolean, isAttribute: boolean) => {
            if( ['gpx.trk.trkseg'].indexOf(jpath) !== -1) return true;
        }
    });
    let jObj: IParsedGPX = parser.parse(gpxString);

    const metadata: Partial<IXneekGpx['metadata']> = {};

    if (jObj.gpx?.metadata?.name) { metadata.name = jObj.gpx.metadata.name; }
    if (jObj.gpx?.metadata?.time) { metadata.time = jObj.gpx.metadata.time; }
    if (jObj.gpx?.creator) { metadata.creator = jObj.gpx.creator; }
    metadata.xneekGpx = pjson.version;

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
                    p.ele = encodeNumbersSequence(trkpt.map(({ele}) => ele >= minPossibleEle && ele <= maxPossibleEle ? ele : skipEle));
                }


                if (trkpt.some((point) => {
                    return getFromExtension(point, 'gpxtpx', 'hr')
                        || getFromExtension(point, 'ns3', 'hr')
                })) {
                    p.hr = encodeNumbersSequence(trkpt.map((point) =>{
                        const hr = getFromExtension(point, 'gpxtpx', 'hr') ??
                            getFromExtension(point, 'ns3', 'hr');
                        return hr >= minPossibleHr && hr <= maxPossibleHr ? hr : skipHr
                    }));
                }


                if (trkpt.some((point) => {
                    return getFromExtension(point, 'gpxtpx', 'atemp')
                        || getFromExtension(point, 'ns3', 'atemp')
                })) {

                    p.temp = encodeNumbersSequence(trkpt.map((point) => {
                        const atemp = getFromExtension(point, 'gpxtpx', 'atemp') ??
                            getFromExtension(point, 'ns3', 'atemp');
                        return atemp > minPossibleAtemp && atemp <= maxPossibleAtemp ? atemp : skipAtemp;
                    }));
                }

                return p;
            })

        }
    };
}

export interface IParsedGPXTrkPt {
    ele: number;
    time: string;
    lat: string;
    lon: string;
    extensions?: {
        'gpxtpx:TrackPointExtension'?: {
            'gpxtpx:hr'?: number;
            'gpxtpx:atemp'?: number;
        },
        'ns3:TrackPointExtension'?: {
            'ns3:hr'?: number;
            'ns3:atemp'?: number;
        }
    }
}

export interface IParsedGPX {
    gpx: {
        creator: string;
        metadata: { name?: string; time?: string; }
        trk: {
            name: string;
            trkseg: {
                trkpt: IParsedGPXTrkPt[]
            }[]
        }
    },

}

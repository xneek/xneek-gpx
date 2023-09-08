export interface IXneekGpxMetadata {
    name?: string;
    desc?: string;
    author?: {
        name?: string;
        email?: string;
        link?: string;
    };
    creator?: string;
    copyright?: string;
    link?: {
        text?: string;
        type?: string;
        href?: string;
    };
    time?: string;
    keywords?: string;
    bounds?: Array<[number, number]>
    creatorVersion?: string;
    xneekGpx?: string;
}

export interface IXneekTrackSegment {
    kind: 'segment',
    start: string;
    lat: string;
    lon: string;
    times: string;

    ele?: string;
    name?: string;
    cmt?: string;
    desc?: string;
    hr?: string;
    temp?: string;
}

export interface IXneekTrackBreak {
    kind: 'break',
    start: string;
    finish: string;

    name?: string;
    cmt?: string;
    desc?: string;
}

export interface IXneekTrack {
    trkseg:  Array<IXneekTrackSegment | IXneekTrackBreak>
    name?: string
}

export interface IXneekGpx {
    trk: IXneekTrack;
    metadata?: IXneekGpxMetadata;
}

import {describe, expect, test} from '@jest/globals';
import { encodeNumbersSequence, decodeNumbersSequence} from './xneek-gpx';

const samplesLat = [53.14299, 53.14238, 53.14184, 53.14128, 53.14067, 53.14003, 53.13944, 53.13885, 53.13828, 53.13767, 53.13705];
const samplesLon = [45.04254, 45.04368, 45.04473, 45.04585, 45.04701, 45.04818, 45.04928, 45.05042, 45.05149, 45.05259, 45.05374];
const samplesAlt = [100, 200, 300, 400, 500, 600, 500, 400, 300, 200, 100];
const samplesTemp = [-20, -15, 0, 10, 20, 30, 0, 0, -275, 0, 0];

describe('sum module', () => {
  test('Encoded-decoded lat', () => {
    const encoded = encodeNumbersSequence(samplesLat);
    const decoded = decodeNumbersSequence(encoded);
    expect(samplesLat).toStrictEqual(decoded);
  });
  test('Encoded-decoded lon', () => {
    const encoded = encodeNumbersSequence(samplesLon);
    const decoded = decodeNumbersSequence(encoded);
    expect(samplesLon).toStrictEqual(decoded);
  });
  test('Encoded-decoded alt', () => {
    const encoded = encodeNumbersSequence(samplesAlt);
    const decoded = decodeNumbersSequence(encoded);
    expect(samplesAlt).toStrictEqual(decoded);
  });
  test('Encoded-decoded temp', () => {
    const encoded = encodeNumbersSequence(samplesTemp);
    const decoded = decodeNumbersSequence(encoded);
    expect(samplesTemp).toStrictEqual(decoded);
  });
});

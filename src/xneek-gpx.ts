
function round(value:number) {
  return Math.floor(Math.abs(value) + 0.5) * (value >= 0 ? 1 : -1);
}

function encode(_current: number, _previous: number, factor: number) {
  const current = round(_current * factor);
  const previous = round(_previous * factor);
  let coordinate = current - previous;
  coordinate <<= 1;
  if (current - previous < 0) {
    coordinate = ~coordinate;
  }
  let output = '';
  while (coordinate >= 0x20) {
    output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 63);
    coordinate >>= 5;
  }
  output += String.fromCharCode(coordinate + 63);
  return output;
}

export const encodeNumbersSequence = (numbersSequence: number[]) => {
const precision = 5;
  const factor = 10 ** precision;
  let output = encode(numbersSequence[0], 0, factor);

  for (let i = 1; i < numbersSequence.length; i++) {
    const a = numbersSequence[i];
    const b = numbersSequence[i - 1];
    output += encode(a, b, factor);;
  }

  return output;
};

export const decodeNumbersSequence = (encodedNumbersSequenceStr: string) => {
  const numbers = [];
  let index = 0;
  let num = 0;

  while (index < encodedNumbersSequenceStr.length) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encodedNumbersSequenceStr.charAt(index++).charCodeAt(0) - 63; // finds ascii
      // and subtract it by 63
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    num += ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    // shift = 0;
    // result = 0;
    //
    // do {
    //   b = encodedNumbersSequenceStr.charAt(index++).charCodeAt(0) - 63;
    //   result |= (b & 0x1f) << shift;
    //   shift += 5;
    // } while (b >= 0x20);

    try {
      numbers.push(num / 1E5);
    } catch (e) {
      console.error(e);
    }
  }
  return numbers;
};

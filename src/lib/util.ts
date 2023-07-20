export const textToArrayBuffer = (key: String) => {
  const buffer = encodeURIComponent(key.toString());
  const bufView = new Uint8Array(buffer.length);

  for (let i = 0; i < buffer.length; ++i) {
    bufView[i] = buffer.charCodeAt(i);
  }
  return bufView.buffer;
};

export const arrayBufferToBase64String = (buffer: ArrayBuffer) => {
  const byte_array = new Uint8Array(buffer);

  let byte_string = "";
  for (let i = 0; i < byte_array.length; ++i) {
    byte_string += String.fromCharCode(byte_array[i]);
  }

  return byte_string;
};

export const base64StringToArrayBuffer = (str: String) => {
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; ++i) {
    bytes[i] = str.charCodeAt(i);
  }

  return bytes.buffer;
};

export function isEqual(arr1: Uint8Array, arr2: Uint8Array): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((value, index) => value === arr2[index]);
}

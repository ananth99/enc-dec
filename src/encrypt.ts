import { JSEncrypt } from "./lib/JSEncrypt";
import { arrayBufferToBase64String, textToArrayBuffer } from "./lib/util";

type enc_message_object_type = {
  iv: string | false;
  rsa_enc_array: Array<string | false>;
};

export async function encrypt() {
  // fetch public key
  let public_key: string =
    document.querySelector<HTMLTextAreaElement>("#pubkey")?.value!;

  // fetch raw text & encode to ArrayBuffer
  let raw_text: string =
    document.querySelector<HTMLTextAreaElement>("#input")?.value!;
  let enc_message = textToArrayBuffer(raw_text);
  // let enc = new TextEncoder();

  let raw_aes_key = "12345678123456781234567812345678";
  let iv = crypto.getRandomValues(new Uint8Array(16));

  // encrypted message type & init object
  let enc_message_object: enc_message_object_type = {
    iv: "",
    rsa_enc_array: [],
  };

  // encrypt iv using rsa
  // convert iv to base64string before encrypting
  var rsa_encrypt = new JSEncrypt();
  rsa_encrypt.setPublicKey(public_key);
  enc_message_object!["iv"] = rsa_encrypt.encrypt(
    arrayBufferToBase64String(iv)
  );

  // import aes key as CryptoKey to perform aes encryption
  const enc_public_key = await crypto.subtle.importKey(
    "raw",
    textToArrayBuffer(raw_aes_key),
    // enc.encode(raw_aes_key),
    { name: "AES-CBC" },
    false,
    ["encrypt", "decrypt"]
  );

  // encrypt raw_text using aes-cbc and aes key
  let ciphertext = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    enc_public_key,
    enc_message
  );
  // convert ciphertext arraybuffer to base64 string
  let base_64_str: string = arrayBufferToBase64String(ciphertext).toString();
  console.log("Base64 string before:", base_64_str);
  // var to store base64 str split to 100 chars each
  let base_64_str_parts: Array<String>;

  // split aes-encrypted string to 100 char each
  base_64_str_parts = base_64_str.match(/.{100}|.{1,2}/g)!;

  // enc each part using RSA
  base_64_str_parts.forEach((str) => {
    enc_message_object.rsa_enc_array.push(rsa_encrypt.encrypt(str.toString()));
  });

  // set output in localstorage
  localStorage.setItem("output", JSON.stringify(enc_message_object!));
}

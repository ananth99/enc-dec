import { JSEncrypt } from "./lib/JSEncrypt";
import { base64StringToArrayBuffer, textToArrayBuffer } from "./lib/util";

type enc_message_object_type = {
  iv: string | false;
  rsa_enc_array: Array<string | false>;
};

export async function decrypt() {
  let enc = new TextEncoder();

  // use raw_aes_key for final decryption
  let raw_aes_key = "12345678123456781234567812345678";

  // fetch private key from field
  let private_key: string =
    document.querySelector<HTMLTextAreaElement>("#privkey")?.value!;

  // get encrypted message
  let rsa_encrypted_parts: enc_message_object_type = JSON.parse(
    localStorage.getItem("output")!
  );

  // init decryptor
  let decryptor = new JSEncrypt();
  let rsa_decrypted_parts: Array<string | false> = [];

  console.log(rsa_encrypted_parts.iv.toString());
  // decrypt iv first
  decryptor.setPrivateKey(private_key);
  let iv = new Uint8Array(
    base64StringToArrayBuffer(
      decryptor.decrypt(rsa_encrypted_parts.iv.toString()) as string
    )
  );

  console.log("IV after rsa decrypt", iv);
  // rsa decrypt each array item
  try {
    rsa_encrypted_parts.rsa_enc_array.forEach((part) => {
      console.log("enc part", part);
      rsa_decrypted_parts.push(decryptor.decrypt(part.toString()));
    });
  } catch (e: any) {
    console.log(e.message);
  }

  console.log(rsa_decrypted_parts);

  // decrypt each of the encrypted part using aes
  const aes_key = await crypto.subtle.importKey(
    "raw",
    textToArrayBuffer(raw_aes_key),
    // enc.encode(private_key),
    { name: "AES-CBC" },
    true,
    ["encrypt", "decrypt"]
  );

  let joined_rsa_decrypt = new Uint8Array(
    base64StringToArrayBuffer(rsa_decrypted_parts.join(""))
  );
  console.dir(rsa_decrypted_parts.join(""));
  try {
    let raw_text = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv },
      aes_key,
      joined_rsa_decrypt
    );

    localStorage.setItem("raw_text", raw_text.toString());
  } catch (e: any) {
    if (e instanceof DOMException) {
      console.log(e.message);
    }
  }

  document.querySelector<HTMLElement>("#decrypt_output")!.innerText =
    JSON.parse(localStorage.getItem("rsa_decrypt_out")!);
}

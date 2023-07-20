# Encryption Decryption implementation

This app uses the native [`Web Crypto API`](https://github.com/travist/jsencrypt) and the [JSEncrypt library](https://github.com/travist/jsencrypt) for encryption and decryption

## Steps

### Encryption

1. create an IV for AES-CBC. Note: This iv needs to be the same during decryption
2. encode raw text input to ArrayBuffer
3. encrypt IV with RSA using JSEncrypt using `public_key` read from input field
4. encrypt raw text ArrayBuffer using AES and IV and `raw_aes_key`
5. convert encrypted ArrayBuffer to base64 string
6. split base64 string to 100 chars each
7. rsa encrypt each split using `public_key`
8. store encrypted iv & data array in local storage

### Decryption

1. read private key from input field
2. fetch encrypted iv & base64 string data array
3. decrypt iv using `JSEncrypt` and `private_key`
4. decrypt rsa encrypted base64 string data array using `JSEncrypt` & `private_key`
5. join the decrypted base64 string data array
6. AES-CBC decrypting the entire string with same `aes_key` & `iv` used in encryption

### Requirement

- npm/yarn install
- yarn dev/npm run dev
- use public private key pair in repo. To generate your own key pair:

  - This generates a private key
    ```
    openssl genrsa -out rsa_1024_priv.pem 1024
    ```
  - You can then get the public key by executing the following command.

    ```
    openssl rsa -pubout -in rsa_1024_priv.pem -out rsa_1024_pub.pem
    ```

  - Since a format supported by WebCrypto for private keys is PKCS#8, convert the keys to this format and use it:
    ```
    openssl pkcs8 -topk8 -nocrypt -in <path to input-sec1-pem> -out <path to output-pkcs8-pem>
    ```

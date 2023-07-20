import "./style.css";
import { encrypt } from "./encrypt.ts";
import { decrypt } from "./decrypt.ts";

document
  ?.querySelector("#encrypt")
  ?.addEventListener("click", async () => await encrypt());

document
  ?.querySelector("#decrypt")
  ?.addEventListener("click", async () => await decrypt());

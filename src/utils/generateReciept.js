import crypto from "crypto";

export function generateReceiptNumber(objid, start = "REC", end, data) {
  const last4 = objid.toString().slice(-4);
  const basePrefix = `${start}/${last4}/`;

  const match = end?.match(/([a-z]+)(\d{2})$/);
  if (!match) return `${basePrefix}a01`;

  let [_, letters, numStr] = match;
  let num = Number(numStr) + 1;

  if (num <= 99) {
    return `${basePrefix}${letters}${pad2(num)}`;
  }

  letters = incrementLetters(letters);

  if (letters.length > 2) {
    const randomBlock = generateRandomHash(data);
    const randomSuffix = randomSuffixCode();
    return `${start}/${randomBlock}/${randomSuffix}`;
  }

  return `${basePrefix}${letters}01`;
}

function incrementLetters(str) {
  let arr = str.split("");
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] !== "z") {
      arr[i] = String.fromCharCode(arr[i].charCodeAt(0) + 1);
      return arr.join("");
    }
    arr[i] = "a";
  }
  return "a" + arr.join("");
}

function generateRandomHash(id) {
  const raw = `${id}${Date.now()}`;
  return crypto.createHash("sha256").update(raw).digest("hex").slice(0, 5);
}

function randomSuffixCode() {
  const letter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  const num = Math.floor(Math.random() * 99) + 1;
  return `${letter}${pad2(num)}`;
}

const pad2 = (n) => (n < 10 ? "0" + n : String(n));
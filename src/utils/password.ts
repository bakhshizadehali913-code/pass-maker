/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PasswordConfig {
  length: number; // 8 to 20
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean; // exclude i,l,I,1, o,0,O, etc.
  readable: boolean; // easy to speak (creates alternating vowels and consonants)
  customExclusions: string; // user-specified characters to exclude
}

/**
 * Calculates cryptographic entropy in bits: log2(charset_size ^ length) = length * log2(charset_size)
 */
export function calculateEntropy(password: string): number {
  if (!password) return 0;
  
  let charsetSize = 0;
  
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);

  if (hasLower) charsetSize += 26;
  if (hasUpper) charsetSize += 26;
  if (hasDigit) charsetSize += 10;
  if (hasSymbol) charsetSize += 32; // Rough average count of standard symbols
  
  if (charsetSize === 0) charsetSize = 10; // Fallback
  
  return Math.round(password.length * Math.log2(charsetSize));
}

/**
 * Generates humanized label and metric estimation for how long it takes to crack the password.
 */
export function estimateCrackTime(entropy: number): { textId: string; farsiText: string; colorClass: string; rating: string } {
  if (entropy < 30) {
    return {
      textId: "weak",
      farsiText: "کمتر از ۲ ثانیه توسط هکرهای معمولی",
      colorClass: "text-red-500",
      rating: "بسیار ضعیف - آسیب‌پذیر",
    };
  } else if (entropy < 50) {
    return {
      textId: "medium",
      farsiText: "حدود ۱ ساعت توسط کامپیوتر میان‌رده",
      colorClass: "text-amber-500",
      rating: "متوسط - قابل قبول",
    };
  } else if (entropy < 70) {
    return {
      textId: "strong",
      farsiText: "حدود ۱۴ سال توسط ابرکامپیوترها",
      colorClass: "text-emerald-400",
      rating: "قوی - به شدت امن",
    };
  } else {
    return {
      textId: "military",
      farsiText: "بیش از ۸۵ میلیون قرن! کاملاً غیرقابل نفوذ",
      colorClass: "text-cyber-green glow-green",
      rating: "دسترسی روت - درجه امنیتی نظامی",
    };
  }
}

/**
 * Generates a pronounceable word-like password (consonant, vowel, consonant, etc)
 */
function generateReadablePassword(length: number, includeUppercase: boolean, includeNumbers: boolean, excludeSimilar: boolean): string {
  let consonants = "bcdfghjklmnpqrstvwxyz".split("");
  let vowels = "aeiou".split("");
  
  if (excludeSimilar) {
    consonants = consonants.filter(c => !["l"].includes(c));
    vowels = vowels.filter(v => !["o"].includes(v));
  }
  
  let result = "";
  for (let i = 0; i < length; i++) {
    const isEven = i % 2 === 0;
    let char = "";
    if (isEven) {
      char = consonants[Math.floor(Math.random() * consonants.length)];
    } else {
      char = vowels[Math.floor(Math.random() * vowels.length)];
    }
    
    // Capitalize letters randomly if requested
    if (includeUppercase && Math.random() > 0.5) {
      char = char.toUpperCase();
      if (excludeSimilar && ["I"].includes(char)) {
        char = "U"; // replace similar-vulnerable capitalized
      }
    }
    
    result += char;
  }
  
  // Inject exactly a couple of digits if includeNumbers is active, to retain some readability but add strength
  if (includeNumbers && length > 3) {
    const arr = result.split("");
    const digitCount = Math.min(2, Math.floor(length / 4) + 1);
    for (let d = 0; d < digitCount; d++) {
      const idx = Math.floor(Math.random() * (arr.length - 1)) + 1; // avoid index 0
      let num = Math.floor(Math.random() * 10).toString();
      if (excludeSimilar && ["0", "1"].includes(num)) {
        num = "7"; // non-confusing digits
      }
      arr[idx] = num;
    }
    result = arr.join("");
  }
  
  return result;
}

/**
 * Core Password Generation engine.
 */
export function generatePassword(config: PasswordConfig): string {
  const {
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeSimilar,
    readable,
    customExclusions
  } = config;
  
  // 1. If looking for readable/speakable password, use specialized phonetic builder
  if (readable) {
    return generateReadablePassword(length, includeUppercase, includeNumbers, excludeSimilar);
  }

  // 2. Otherwise compile active character sets
  let lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  let uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let numberChars = "0123456789";
  let symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  
  // Exclude similar characters if requested
  if (excludeSimilar) {
    // Exclude: i, l, I, 1, o, 0, O, |, l, L
    lowercaseChars = lowercaseChars.replace(/[ilo]/g, "");
    uppercaseChars = uppercaseChars.replace(/[IO]/g, "");
    numberChars = numberChars.replace(/[01]/g, "");
    symbolChars = symbolChars.replace(/[|]/g, "");
  }
  
  // Apply custom exclusions
  if (customExclusions.trim()) {
    const exclSet = new Set(customExclusions.trim().split(""));
    const filterStr = (s: string) => s.split("").filter(c => !exclSet.has(c)).join("");
    lowercaseChars = filterStr(lowercaseChars);
    uppercaseChars = filterStr(uppercaseChars);
    numberChars = filterStr(numberChars);
    symbolChars = filterStr(symbolChars);
  }

  // Check which categories are enabled
  let allowedPool = "";
  const pools: string[] = [];
  
  if (includeLowercase && lowercaseChars.length > 0) {
    allowedPool += lowercaseChars;
    pools.push(lowercaseChars);
  }
  if (includeUppercase && uppercaseChars.length > 0) {
    allowedPool += uppercaseChars;
    pools.push(uppercaseChars);
  }
  if (includeNumbers && numberChars.length > 0) {
    allowedPool += numberChars;
    pools.push(numberChars);
  }
  if (includeSymbols && symbolChars.length > 0) {
    allowedPool += symbolChars;
    pools.push(symbolChars);
  }

  // If no pools are selected, default to lowercase only
  if (pools.length === 0) {
    allowedPool = lowercaseChars.length > 0 ? lowercaseChars : "abcdefghijklmnopqrstuvwxyz";
    pools.push(allowedPool);
  }

  let password = "";
  
  // Guarantee at least one character from each selected pool to maximize cryptographic validity
  pools.forEach(pool => {
    if (pool.length > 0) {
      password += pool[Math.floor(Math.random() * pool.length)];
    }
  });

  // Complete the rest of the password characters randomly
  const remainingLength = length - password.length;
  for (let i = 0; i < remainingLength; i++) {
    password += allowedPool[Math.floor(Math.random() * allowedPool.length)];
  }

  // Shuffle the password so the guaranteed items are not always at the front
  return password.split("").sort(() => 0.5 - Math.random()).join("");
}

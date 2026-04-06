export const COMMON_PASSWORDS = new Set([
  'password','123456','qwerty','abc123','letmein','monkey','dragon',
  '111111','baseball','iloveyou','trustno1','sunshine','princess','welcome',
  'shadow','master','admin','login','pass','test','hello','temp','qwerty123',
  'password1','Password1','P@ssw0rd','admin123','root','toor','changeme',
  'password123','1234567','12345678','123456789','1234567890','0987654321',
  'qwertyuiop','asdfghjkl','zxcvbnm','football','superman','batman',
  'starwars','minecraft','pokemon','google','linkedin','facebook','twitter',
  'instagram','youtube','netflix','amazon','apple','microsoft','windows',
]);

export function generatePassword(length = 16) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

export function calcEntropy(pw) {
  if (!pw.length) return 0;
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 32;
  return Math.round(pw.length * Math.log2(pool));
}

export function detectPatterns(pw) {
  if (!pw.length) return [];
  const found = [];
  const lower = pw.toLowerCase();
  if (COMMON_PASSWORDS.has(lower) || COMMON_PASSWORDS.has(pw))
    found.push({ label: 'known common password', danger: true });
  if (/(.)\1{2,}/.test(pw))
    found.push({ label: 'repeated characters', danger: true });
  if (/^[a-zA-Z]+$/.test(pw))
    found.push({ label: 'letters only', danger: true });
  if (/^[0-9]+$/.test(pw))
    found.push({ label: 'digits only', danger: true });
  if (/012|123|234|345|456|567|678|789|890|987|876|765|654|543|432|321|210/.test(pw))
    found.push({ label: 'sequential digits', danger: true });
  if (/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(pw))
    found.push({ label: 'sequential letters', danger: true });
  if (/qwert|asdf|zxcv|yuiop|hjkl|bnm/i.test(pw))
    found.push({ label: 'keyboard pattern', danger: true });
  if (/[0-9]{4}$/.test(pw) && pw.length > 4)
    found.push({ label: 'year-style suffix', danger: false });
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw))
    found.push({ label: 'special characters ✓', danger: false });
  if (pw.length >= 16)
    found.push({ label: 'passphrase length ✓', danger: false });
  if (!found.length)
    found.push({ label: 'no obvious patterns', danger: false });
  return found;
}

export function formatCrackTime(entropy, ratePerSec) {
  if (!entropy) return { label: '—', level: 'neutral' };
  const combos = Math.pow(2, entropy);
  const seconds = combos / (2 * ratePerSec);
  let label, level;
  if (seconds < 60) { label = '< 1 minute'; level = 'fast'; }
  else if (seconds < 3600) { label = `${Math.round(seconds / 60)} minutes`; level = 'fast'; }
  else if (seconds < 86400) { label = `${Math.round(seconds / 3600)} hours`; level = seconds < 7200 ? 'fast' : 'medium'; }
  else if (seconds < 2592000) { label = `${Math.round(seconds / 86400)} days`; level = 'medium'; }
  else if (seconds < 31536000) { label = `${Math.round(seconds / 2592000)} months`; level = 'medium'; }
  else if (seconds < 3153600000) { label = `${Math.round(seconds / 31536000)} years`; level = 'slow'; }
  else { label = 'centuries+'; level = 'slow'; }
  return { label, level };
}

export function scorePassword(pw) {
  if (!pw.length) return { score: 0, label: '', color: '', pct: 0 };
  const isCommon = COMMON_PASSWORDS.has(pw.toLowerCase()) || COMMON_PASSWORDS.has(pw);
  const len = pw.length;
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasDigit = /[0-9]/.test(pw);
  const hasSym = /[^a-zA-Z0-9]/.test(pw);

  let score = 0;
  if (len >= 8) score++;
  if (len >= 12) score++;
  if (len >= 16) score++;
  if (hasUpper) score++;
  if (hasLower) score++;
  if (hasDigit) score++;
  if (hasSym) score++;
  if (isCommon) score = Math.min(score, 1);

  let label, color;
  if (isCommon) { label = 'Compromised'; color = '#e84848'; }
  else if (score >= 6) { label = 'Strong'; color = '#1dba8a'; }
  else if (score >= 4) { label = 'Moderate'; color = '#f0a030'; }
  else if (score >= 2) { label = 'Weak'; color = '#e05a38'; }
  else { label = 'Very weak'; color = '#e84848'; }

  const pct = Math.min(100, Math.round((score / 7) * 100));
  return { score, label, color, pct };
}

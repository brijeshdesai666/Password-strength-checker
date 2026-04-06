# 🔐 Password Strength Checker

A cybersecurity-focused password analyzer built with **React + Vite**. Evaluates passwords using real cryptographic principles — entropy calculation, pattern detection, and estimated crack times.

**Live Demo**: [Deploy on Vercel](#deploy-to-vercel)

Built by [@BrijeshDesai](https://linkedin.com/in/brijesh-desai-cybersec) · SOC Analyst · NativeDefence

---

## Features

- **Entropy calculation** — Shannon entropy in bits based on character pool
- **6 criteria checks** — length, uppercase, lowercase, digits, symbols, 12+ chars
- **Pattern detection** — common passwords, keyboard walks, sequential chars, repeated chars
- **Crack time estimation** — 3 attack scenarios (online throttled, bcrypt offline, MD5/GPU)
- **50+ common passwords** database
- **Zero data transmission** — 100% client-side, no passwords leave your browser

## Tech Stack

- React 18
- Vite 5
- CSS Modules
- No external runtime dependencies

## Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/password-strength-checker
cd password-strength-checker
npm install
npm run dev
```

## Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Select your repo
4. Framework preset: **Vite**
5. Click Deploy

That's it — Vercel auto-detects Vite config.

## Concepts Covered (MITRE ATT&CK)

| Technique | ID | Defense |
|---|---|---|
| Brute Force | T1110 | Strong entropy, bcrypt hashing |
| Credential Stuffing | T1110.004 | Common password detection |
| Valid Accounts | T1078 | Password policy enforcement |

## License

MIT — free to use, modify, and share.

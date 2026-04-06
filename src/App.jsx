import { useState, useCallback } from 'react'
import { calcEntropy, detectPatterns, formatCrackTime, scorePassword, generatePassword } from './utils'
import styles from './App.module.css'

const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const CopyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
  </svg>
)

const WandIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
)

const CheckIcon = ({ pass }) => (
  <div className={`${styles.checkIcon} ${pass ? styles.checkPass : styles.checkFail}`}>
    {pass ? (
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ) : (
      <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
        <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    )}
  </div>
)

function CrackRow({ label, rate, entropy }) {
  const result = formatCrackTime(entropy, rate)
  return (
    <div className={styles.crackRow}>
      <span className={styles.crackLabel}>{label}</span>
      <span className={`${styles.crackTime} ${styles['crack_' + result.level]}`}>
        {result.label}
      </span>
    </div>
  )
}

export default function App() {
  const [pw, setPw] = useState('')
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (pw) {
      navigator.clipboard.writeText(pw)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleGenerate = () => {
    setPw(generatePassword(16))
    setVisible(true)
  }

  const entropy = calcEntropy(pw)
  const patterns = detectPatterns(pw)
  const { label: scoreLabel, color, pct } = scorePassword(pw)

  const len = pw.length
  const hasUpper = /[A-Z]/.test(pw)
  const hasLower = /[a-z]/.test(pw)
  const hasDigit = /[0-9]/.test(pw)
  const hasSym = /[^a-zA-Z0-9]/.test(pw)
  const is12 = len >= 12

  const getSuggestion = useCallback(() => {
    if (!len) return 'Type or paste a password to analyze its strength, entropy, and vulnerability patterns.'
    const isCommon = patterns.some(p => p.label === 'known common password')
    if (isCommon) return '⚠ This is a known compromised password. It will be cracked instantly by dictionary attacks. Choose something completely different.'
    if (pct <= 20) return 'Add uppercase letters, digits, and symbols. Even a small amount of variety drastically expands the keyspace.'
    if (!is12) return `Increase length to 12+ characters. Length is the single biggest factor — ${len} chars gives ${entropy} bits; 16 chars would give ~${Math.round(16 * Math.log2(94))} bits.`
    if (!hasSym) return 'Adding a special character (!@#$%^&*) multiplies the possible keyspace by ~3×, making brute force significantly harder.'
    if (pct >= 85) return `Strong password — ${entropy} bits of entropy. Practically immune to brute force when stored with bcrypt or Argon2.`
    return 'Consider pushing length beyond 12 characters. A longer passphrase is often easier to remember and harder to crack.'
  }, [pw, patterns, pct, entropy, len, is12, hasSym])

  return (
    <div className={styles.page}>
      <div className={styles.noise} aria-hidden="true" />

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logoArea}>
            <span className={styles.logoIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </span>
            <span className={styles.logoText}>CipherCheck</span>
          </div>
          <span className={styles.badge}>by #BrijeshDesai</span>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>

          {/* Hero full-width */}
          <div className={styles.hero}>
            <h1 className={styles.heroTitle}>Password <span className={styles.heroAccent}>Strength</span> Analyzer</h1>
            <p className={styles.heroSub}>Entropy calculation · Pattern detection · Real crack-time estimation · No data stored</p>
          </div>

          {/* Two-column layout */}
          <div className={styles.twoCol}>

            {/* Left column */}
            <div className={styles.leftCol}>

              {/* Input */}
              <div className={styles.inputCard}>
                <label className={styles.inputLabel}>Enter password</label>
                <div className={styles.inputRow}>
                  <input
                    type={visible ? 'text' : 'password'}
                    value={pw}
                    onChange={e => setPw(e.target.value)}
                    className={styles.input}
                    placeholder="Type or paste your password..."
                    autoComplete="off"
                    spellCheck="false"
                  />
                  <button className={styles.iconBtn} onClick={handleGenerate} title="Generate strong password">
                    <WandIcon />
                  </button>
                  <button className={styles.iconBtn} onClick={handleCopy} title="Copy to clipboard">
                    {copied ? <CheckIcon pass={true} /> : <CopyIcon />}
                  </button>
                  <button className={styles.iconBtn} onClick={() => setVisible(v => !v)} title="Toggle visibility">
                    {visible ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>

                {/* Strength bar */}
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>

                <div className={styles.scoreRow}>
                  <span className={styles.scoreLabel} style={{ color: len ? color : 'var(--text3)' }}>
                    {len ? scoreLabel : '— type to analyze'}
                  </span>
                  <span className={styles.entropyBadge}>
                    {len ? `${entropy} bits entropy` : 'entropy: —'}
                  </span>
                </div>
              </div>

              {/* Criteria checks */}
              <div className={styles.section}>
                <p className={styles.sectionTitle}>Criteria checks</p>
                <div className={styles.checksGrid}>
                  {[
                    { id: 'len', pass: len >= 8, label: 'Min 8 characters', sub: len ? `${len} chars` : '0 chars' },
                    { id: 'upper', pass: hasUpper, label: 'Uppercase letter', sub: hasUpper ? `${(pw.match(/[A-Z]/g)||[]).length} found` : 'none found' },
                    { id: 'lower', pass: hasLower, label: 'Lowercase letter', sub: hasLower ? `${(pw.match(/[a-z]/g)||[]).length} found` : 'none found' },
                    { id: 'digit', pass: hasDigit, label: 'Digit (0–9)', sub: hasDigit ? `${(pw.match(/[0-9]/g)||[]).length} found` : 'none found' },
                    { id: 'sym', pass: hasSym, label: 'Special character', sub: hasSym ? (pw.match(/[^a-zA-Z0-9]/g)||[]).join(' ') : 'none found' },
                    { id: 'long', pass: is12, label: '12+ chars (recommended)', sub: is12 ? `${len} ✓` : `${len} / 12` },
                  ].map(c => (
                    <div key={c.id} className={`${styles.checkCard} ${c.pass ? styles.checkCardPass : ''}`}>
                      <CheckIcon pass={c.pass} />
                      <div>
                        <span className={styles.checkCardLabel}>{c.label}</span>
                        <span className={styles.checkCardSub}>{c.sub}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestion */}
              <div className={styles.suggestion}>
                <div className={styles.suggestionIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <p className={styles.suggestionText}>{getSuggestion()}</p>
              </div>

            </div>{/* /leftCol */}

            {/* Right column */}
            <div className={styles.rightCol}>

              {/* Pattern detection */}
              <div className={styles.section}>
                <p className={styles.sectionTitle}>Detected patterns</p>
                <div className={styles.patternList}>
                  {!len
                    ? <span className={styles.dimText}>no input yet</span>
                    : patterns.map((p, i) => (
                        <span key={i} className={`${styles.pill} ${p.danger ? styles.pillWarn : styles.pillOk}`}>
                          {p.label}
                        </span>
                      ))
                  }
                </div>
              </div>

              {/* Crack times */}
              <div className={styles.section}>
                <p className={styles.sectionTitle}>Estimated crack time</p>
                <div className={styles.crackCard}>
                  <CrackRow label="Online attack (throttled, 100/hr)" rate={100 / 3600} entropy={len ? entropy : 0} />
                  <CrackRow label="Offline slow hash (bcrypt ~10k/s)" rate={1e4} entropy={len ? entropy : 0} />
                  <CrackRow label="Offline fast hash (MD5/GPU ~10B/s)" rate={1e10} entropy={len ? entropy : 0} />
                </div>
              </div>

              {/* Education strip */}
              <div className={styles.section}>
                <p className={styles.sectionTitle}>How it works</p>
                <div className={styles.eduGrid}>
                  {[
                    { icon: '⊕', title: 'Entropy', body: 'Measures unpredictability in bits. Each bit doubles the search space. 72+ bits = strong.' },
                    { icon: '⊘', title: 'Dictionary attacks', body: 'Attackers try known passwords first. Even complex-looking common passwords fall instantly.' },
                    { icon: '⊛', title: 'Hash algorithms', body: 'bcrypt/Argon2 are designed to be slow. MD5/SHA1 are fast — millions of guesses per second on GPUs.' },
                  ].map((e, i) => (
                    <div key={i} className={styles.eduCard}>
                      <span className={styles.eduIcon}>{e.icon}</span>
                      <strong className={styles.eduTitle}>{e.title}</strong>
                      <p className={styles.eduBody}>{e.body}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>{/* /rightCol */}

          </div>{/* /twoCol */}

        </div>
      </main>

      <footer className={styles.footer}>
        <span>Built by <a href="https://linkedin.com/in/brijesh-desai-cybersec" target="_blank" rel="noopener noreferrer">#BrijeshDesai</a> · SOC Analyst · NativeDefence</span>
        <span className={styles.footerRight}>No passwords are stored or transmitted</span>
      </footer>
    </div>
  )
}

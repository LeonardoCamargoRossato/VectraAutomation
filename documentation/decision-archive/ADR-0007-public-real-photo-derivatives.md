# ADR-0007 — V6.2 public real photo derivatives

Status: implemented on candidate branch; CI and deployment pending.

V6.1 only exposed six published external references; the real dataset required manual import into IndexedDB. The owner explicitly requested publication of 56 privacy-protected derivative pairs, with source ZIP and higher-resolution private assets remaining outside Git. RealPhotoCatalog.json is the single inventory for these 112 assets; its paths, dimensions, hashes and Git object IDs are verified by the existing quality gate. Real and external collections remain separate; public cards use viewport-gated WebP and open PNG only on demand. The private import workflow remains optional and has an independent counter. No changes to PR #8 or geometry are included.

Asset commit: d19bc09822f8bab2d65bc77d5363a51791c77af9. Validation: 14 final assets checked locally for SHA-256, dimensions, format and EXIF; all 112 Git tree entries match catalog blob SHA and byte size. CI/browser evidence and deployment must be checked before release.

# Security Policy

## Reporting

Report security issues privately to the maintainers. Do not open public issues for exploitable vulnerabilities.

## Baseline controls

Mada.AI treats retrieved web/document content as untrusted evidence.

Required protections include:

- SSRF blocking for localhost/private networks
- redirect revalidation
- response size/time limits
- prompt-injection trust boundary (content cannot rewrite system policy)
- tenant/workspace authorization on every read/write boundary
- no logging of raw BYOK credentials

## Supported versions

Security fixes target the main development branch until the first stable release.

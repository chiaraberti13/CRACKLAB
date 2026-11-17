# Security Policy

## Supported versions

Security fixes target the latest revision on the default branch unless a release is explicitly documented as supported.

## Scope

The client-side React application, the estimation model and its datasets, state/privacy logic, the build pipeline,
the deployment configuration and the dependency supply chain.

## Reporting

Do not open a public issue for an unpatched vulnerability. Use GitHub private vulnerability reporting / Security
Advisories when available. Include the affected commit/version, impact, a minimal reproducible proof, environment
assumptions and possible mitigations. Remove any unrelated sensitive data — and never include a real password.

## Responsible testing

Test only systems, data and networks you own or are explicitly authorized to assess. No denial of service,
destructive actions, persistence, social engineering or unauthorized interception.

## Security requirements

Keep secrets outside source control; validate untrusted input; preserve the privacy boundary (no network access
and no persistence of the sample); never weaken the CSP or the deployment headers. Do not introduce a cracker
capability: third-party hash input, wordlist cracking or active exploitation are out of scope by design.

## Disclosure

Allow reasonable remediation time and coordinate publication of exploit-enabling details.

## Private reporting process

Use **Report a vulnerability** in the repository Security tab if private reporting is available. Otherwise use a verified private contact published by the repository owner. If no private contact is available, open a public issue asking only for a private contact, without vulnerability details. Do not publish exploit details, credentials, personal data or sensitive logs in public issues.

Include the affected revision, environment, impact and minimal synthetic reproduction. Coordinate disclosure with the maintainer. Acknowledgement and remediation depend on availability and severity; no fixed response deadline is guaranteed.

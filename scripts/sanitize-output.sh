#!/bin/bash
# Output sanitizer - reads stdin and outputs sanitized text
# Designed to be piped: some_command | sanitize-output.sh

# Get username for path sanitization
USER_NAME="${USER:-${USERNAME:-user}}"

# Use perl for more reliable regex if available, otherwise sed
if command -v perl &>/dev/null; then
    perl -pe '
        # Username in paths and standalone - do this FIRST
        s|/Users/'"$USER_NAME"'|/home/user|g;
        s|/home/'"$USER_NAME"'|/home/user|g;
        s|\b'"$USER_NAME"'\b|user|g;

        # IPv4 addresses (preserve localhost)
        s/\b(?!127\.0\.0\.1)(?!0\.0\.0\.0)(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/[IP_REDACTED]/g;

        # MAC addresses
        s/\b(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}\b/[MAC_REDACTED]/g;

        # Email addresses
        s/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/[EMAIL_REDACTED]/g;

        # AWS Access Key ID
        s/AKIA[0-9A-Z]{16}/[AWS_KEY_REDACTED]/g;

        # AWS Secret Access Key (40 char base64-like string after = or :)
        s/(AWS_SECRET_ACCESS_KEY|aws_secret_access_key)\s*[=:]\s*[A-Za-z0-9\/+=]{40}/$1=[AWS_SECRET_REDACTED]/gi;

        # Generic secret keys that look like AWS secrets
        s/\b[A-Za-z0-9\/+=]{40}\b/[SECRET_KEY_REDACTED]/g if /SECRET|KEY|CREDENTIAL/i;

        # Private key blocks (PEM format)
        s/-----BEGIN[^-]+PRIVATE KEY-----[\s\S]*?-----END[^-]+PRIVATE KEY-----/[PRIVATE_KEY_REDACTED]/g;

        # JWT tokens
        s/eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_.-]*/[JWT_REDACTED]/g;

        # Bearer tokens
        s/Bearer\s+[A-Za-z0-9_.-]+/Bearer [TOKEN_REDACTED]/gi;

        # SSH public keys
        s/ssh-(?:rsa|ed25519|ecdsa)\s+[A-Za-z0-9+\/=]+/[SSH_KEY_REDACTED]/g;

        # Password/secret fields
        s/(password|passwd|pwd|secret|token|api_key|apikey)\s*[=:]\s*\S+/$1=[REDACTED]/gi;

        # Connection strings
        s/(mysql|postgres|mongodb|redis|amqp):\/\/\S+/$1:\/\/[CONNECTION_REDACTED]/gi;

        # SSN
        s/\b\d{3}-\d{2}-\d{4}\b/[SSN_REDACTED]/g;

        # Credit card like patterns
        s/\b(?:\d{4}[- ]?){3}\d{4}\b/[CARD_REDACTED]/g;

        # Phone numbers
        s/\b(?:\+1[- ]?)?(?:\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}\b/[PHONE_REDACTED]/g;

        # API key patterns (sk-, pk-, etc.)
        s/\b(sk|pk|api)[-_][A-Za-z0-9]{20,}/[API_KEY_REDACTED]/gi;
    '
else
    # Fallback to sed (less reliable for complex patterns)
    sed -E \
        -e "s|/Users/$USER_NAME|/home/user|g" \
        -e "s|/home/$USER_NAME|/home/user|g" \
        -e "s|\b$USER_NAME\b|user|g" \
        -e 's/([0-9]{1,3}\.){3}[0-9]{1,3}/[IP_REDACTED]/g' \
        -e 's/([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}/[MAC_REDACTED]/g' \
        -e 's/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/[EMAIL_REDACTED]/g' \
        -e 's/AKIA[0-9A-Z]{16}/[AWS_KEY_REDACTED]/g' \
        -e 's/(AWS_SECRET_ACCESS_KEY|aws_secret_access_key)[=:][A-Za-z0-9\/+=]{40}/\1=[AWS_SECRET_REDACTED]/gi' \
        -e 's/(password|passwd|secret|token|api_key)[=:][^ 	]+/\1=[REDACTED]/gi' \
        -e 's/(sk|pk|api)[-_][A-Za-z0-9]{20,}/[API_KEY_REDACTED]/gi'
fi

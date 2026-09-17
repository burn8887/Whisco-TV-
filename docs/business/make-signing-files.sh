#!/bin/bash
# Whisco TV build 6 — make the signing files EAS needs.
# Run from anywhere:  bash make-signing-files.sh
# It asks for a password ONCE, visibly, and never uses openssl's hidden prompt.
set -e
cd ~/whisco-mobile 2>/dev/null || { echo "ERROR: ~/whisco-mobile not found."; exit 1; }

for f in ~/dist_key.pem ~/dist_cert.pem ~/whisco_appstore.mobileprovision; do
  [ -f "$f" ] || { echo "ERROR: $f is missing. Copy the three files into 'Linux files' first."; exit 1; }
done
echo "All three source files found. Good."

mkdir -p credentials
read -p "Choose a password for the signing file (it SHOWS as you type): " P12PW
[ -n "$P12PW" ] || { echo "ERROR: empty password — run it again and type something."; exit 1; }
echo "Captured ${#P12PW} characters."

echo "Building credentials/dist.p12 ..."
if openssl pkcs12 -export -legacy -inkey ~/dist_key.pem -in ~/dist_cert.pem \
     -out credentials/dist.p12 -passout pass:"$P12PW" \
     -name "Apple Distribution: Ali Albaharna (X2UPN4792Y)" 2>/dev/null; then
  echo "  built with the legacy format (what EAS reads)."
else
  openssl pkcs12 -export -inkey ~/dist_key.pem -in ~/dist_cert.pem \
     -out credentials/dist.p12 -passout pass:"$P12PW" \
     -name "Apple Distribution: Ali Albaharna (X2UPN4792Y)"
  echo "  built with the modern format (legacy not supported here)."
fi

cp ~/whisco_appstore.mobileprovision credentials/
cat > credentials.json <<JSON
{
  "ios": {
    "provisioningProfilePath": "credentials/whisco_appstore.mobileprovision",
    "distributionCertificate": { "path": "credentials/dist.p12", "password": "$P12PW" }
  }
}
JSON

echo
echo "Checking the file opens (expect a certificate, not an error):"
openssl pkcs12 -legacy -in credentials/dist.p12 -nokeys -passin pass:"$P12PW" 2>/dev/null | grep -E "subject=|BEGIN CERTIFICATE" | head -2 \
  || openssl pkcs12 -in credentials/dist.p12 -nokeys -passin pass:"$P12PW" 2>/dev/null | grep -E "subject=|BEGIN CERTIFICATE" | head -2 \
  || { echo "ERROR: the file did not open — tell me before going further."; exit 1; }

unset P12PW
echo
echo "Done. credentials/dist.p12 and credentials.json are in ~/whisco-mobile (both gitignored)."
echo "Nothing above is a secret except anything you typed — clear your screen before pasting output."

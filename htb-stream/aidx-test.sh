#!/usr/bin/env bash

URL="http://10.129.247.123:8081/feeds/aidx"

test_payload() {
    printf '\n=== %s ===\n' "$1"

    curl -sS "$URL" \
        -H "Content-Type: application/xml" \
        --data-binary "$2"

    echo
}

test_payload "Only opening tags" \
'<IATA_AIDX_FlightLegNotifRQ><Originator><FlightLeg><LegIdentifier>'

test_payload "XML comment" \
'<!-- IATA_AIDX_FlightLegNotifRQ Originator FlightLeg LegIdentifier -->'

test_payload "Names as attributes" \
'<test IATA_AIDX_FlightLegNotifRQ="1" Originator="1" FlightLeg="1" LegIdentifier="1"/>'

test_payload "Valid XML, wrong root" \
'<test><IATA_AIDX_FlightLegNotifRQ/><Originator/><FlightLeg/><LegIdentifier/></test>'

test_payload "Valid XML, correct elements" \
'<IATA_AIDX_FlightLegNotifRQ><Originator/><FlightLeg><LegIdentifier/></FlightLeg></IATA_AIDX_FlightLegNotifRQ>'

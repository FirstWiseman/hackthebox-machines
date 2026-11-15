package main

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/gob"
	"net/url"
	"testing"
)

func TestExactMatch(t *testing.T) {
	qr := "ThAAHSpnb2IuVmVyaWZ5VGlja2V0QXV0aGVudGljaXR5fwMBARhWZXJpZnlUaWNrZXRBdXRoZW50aWNpdHkB%2F4AAAQEBBERhdGEBCgAAAP%2B0%2F4D%2FsAH%2FrHsiUE5SIjoiSDlSNU1QIiwiVG9rZW4iOiIxNWZlNDU2N2I1N2IzYjdhMWYyZDMyN2FhOThlNjkyOSIsIlNlYXQiOiIxQSIsIlBhc3NlbmdlciI6IkpvaG5hIFN0b25lcyIsIk5vdGlmeUNtZCI6ImNoZWNrLWluLW5vdGlmeSAtLXBuciBIOVI1TVAgLS1lbWFpbCBqb2huYS5zdG9uZXNAZ21haWwuY29tIn0AEgVeG9UiPnxKpAQsvsfvOwViZQbQdfZPzouhB1LhXgE%3D"
	dec, _ := url.QueryUnescape(qr)
	raw, _ := base64.StdEncoding.DecodeString(dec)
	origGob := raw[:len(raw)-32]
	origSig := raw[len(raw)-32:]

	orig := `{"PNR":"H9R5MP","Token":"15fe4567b57b3b7a1f2d327aa98e6929","Seat":"1A","Passenger":"Johna Stones","NotifyCmd":"check-in-notify --pnr H9R5MP --email johna.stones@gmail.com"}`
	var iface interface{} = &VerifyTicketAuthenticity{Data: []byte(orig)}
	var buf bytes.Buffer
	gob.NewEncoder(&buf).Encode(&iface)
	mine := buf.Bytes()

	t.Logf("gob bytes identical: %v (orig=%d mine=%d)", bytes.Equal(origGob, mine), len(origGob), len(mine))
	m := hmac.New(sha256.New, []byte(key)); m.Write(mine)
	t.Logf("sig matches original: %v", hmac.Equal(m.Sum(nil), origSig))
	if !bytes.Equal(origGob, mine) { t.Fatal("bytes differ") }
	if !hmac.Equal(m.Sum(nil), origSig) { t.Fatal("sig differs") }
}

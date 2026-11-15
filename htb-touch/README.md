# DoS (Denial of Service)
## Cause
### Command that caused DoS
```
nomore403 -f ~/nomore403/payloads -u http://10.129.187.243:8443/api
```

Web-Service https-alt (8443) is not reachable anymore, after Command Execution

## Proof
### Before
```
\# nmap -Pn 10.129.187.243
Starting Nmap 7.992 ( https://nmap.org ) at 2026-10-28 22:07 +0100
Nmap scan report for 10.129.187.243
Host is up (0.10s latency).
Not shown: 997 filtered tcp ports (no-response)
PORT     STATE SERVICE
135/tcp  open  msrpc
3389/tcp open  ms-wbt-server
8443/tcp open  https-alt
```

### After
```
\# nmap -Pn 10.129.187.243
Starting Nmap 7.992 ( https://nmap.org ) at 2026-10-28 22:55 +0100
Nmap scan report for 10.129.187.243
Host is up (0.092s latency).
Not shown: 997 filtered tcp ports (no-response)
PORT     STATE SERVICE
135/tcp  open  msrpc
3389/tcp open  ms-wbt-server
5985/tcp open  wsman
```

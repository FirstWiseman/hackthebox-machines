# FFUF Report

  Command line : `ffuf -u https://cohort.htb/api/validate -X POST -H Content-Type: application/json -d {&#34;url&#34;:&#34;http://2130706433:5000/FUZZ&#34;,&#34;format&#34;:&#34;json&#34;} -w /home/wiseman/hacking/seclists/Discovery/Web-Content/big.txt -mc all -fs 192,58 -o ffuf-port-5000.md -of md`
  Time: 2026-11-11T21:17:42&#43;01:00

  | FUZZ | URL | Redirectlocation | Position | Status Code | Content Length | Content Words | Content Lines | Content Type | Duration | ResultFile | ScraperData | Ffufhash
  | :- | :-- | :--------------- | :---- | :------- | :---------- | :------------- | :------------ | :--------- | :----------- | :------------ | :-------- |
  | health | https://cohort.htb/api/validate |  | 8823 | 200 | 166 | 14 | 1 | application/json | 141.920962ms |  |  | 588242277
  
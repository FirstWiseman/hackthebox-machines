# FFUF Report

  Command line : `ffuf -u https://cohort.htb/api/validate -X POST -H Content-Type: application/json -d {&#34;url&#34;:&#34;http://2130706433:FUZZ/&#34;,&#34;format&#34;:&#34;json&#34;} -w /home/wiseman/hacking/seclists/Discovery/Infrastructure/common-http-ports.txt -mc all -fs 86 -o ffuf-api-validate.md -of md`
  Time: 2026-11-11T21:40:47&#43;01:00

  | FUZZ | URL | Redirectlocation | Position | Status Code | Content Length | Content Words | Content Lines | Content Type | Duration | ResultFile | ScraperData | Ffufhash
  | :- | :-- | :--------------- | :---- | :------- | :---------- | :------------- | :------------ | :--------- | :----------- | :------------ | :-------- |
  | 8888 | https://cohort.htb/api/validate |  | 35 | 200 | 1515 | 298 | 1 | application/json | 273.095251ms |  |  | 7a01b23
  | 80 | https://cohort.htb/api/validate |  | 2 | 200 | 1077 | 71 | 1 | application/json | 319.311502ms |  |  | 7a01b2
  | 443 | https://cohort.htb/api/validate |  | 4 | 200 | 412 | 35 | 1 | application/json | 1.168945549s |  |  | 7a01b4
  | 5000 | https://cohort.htb/api/validate |  | 23 | 200 | 192 | 20 | 1 | application/json | 1.179421496s |  |  | 7a01b17
  
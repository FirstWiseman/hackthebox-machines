# FFUF Report

  Command line : `ffuf -w /home/wiseman/hacking/seclists/Discovery/Web-Content/common.txt -u http://api.htb-airport.htb/FUZZ -mc 200 -o ffuf-api-domain.md -of md`
  Time: 2026-10-14T20:09:55&#43;02:00

  | FUZZ | URL | Redirectlocation | Position | Status Code | Content Length | Content Words | Content Lines | Content Type | Duration | ResultFile | ScraperData | Ffufhash
  | :- | :-- | :--------------- | :---- | :------- | :---------- | :------------- | :------------ | :--------- | :----------- | :------------ | :-------- |
  | health | http://api.htb-airport.htb/health |  | 2075 | 200 | 15 | 1 | 1 | application/json | 71.225829ms |  |  | 1b01581b
  | status | http://api.htb-airport.htb/status |  | 3986 | 200 | 361 | 9 | 1 | application/json | 150.871564ms |  |  | 1b015f92
  
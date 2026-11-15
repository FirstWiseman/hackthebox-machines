# FFUF Report

  Command line : `ffuf -w /home/wiseman/hacking/seclists/Discovery/Web-Content/raft-large-directories.txt -u http://10.129.80.147:8081/FUZZ -mc 200 -o ffuf-main.md -of md`
  Time: 2026-10-14T20:14:08&#43;02:00

  | FUZZ | URL | Redirectlocation | Position | Status Code | Content Length | Content Words | Content Lines | Content Type | Duration | ResultFile | ScraperData | Ffufhash
  | :- | :-- | :--------------- | :---- | :------- | :---------- | :------------- | :------------ | :--------- | :----------- | :------------ | :-------- |
  | docs | http://10.129.80.147:8081/docs |  | 77 | 200 | 1021 | 159 | 32 | text/html; charset=utf-8 | 79.32677ms |  |  | e768e4d
  | health | http://10.129.80.147:8081/health |  | 974 | 200 | 86 | 3 | 1 | application/json | 70.076857ms |  |  | e768e3ce
  
# FFUF Report

  Command line : `ffuf -w /home/wiseman/hacking/seclists/Discovery/Web-Content/raft-large-directories.txt -u http://db.htb-airport.htb/FUZZ -mc 200 -o ffuf-db-domain.md -of md`
  Time: 2026-10-14T20:21:11&#43;02:00

  | FUZZ | URL | Redirectlocation | Position | Status Code | Content Length | Content Words | Content Lines | Content Type | Duration | ResultFile | ScraperData | Ffufhash
  | :- | :-- | :--------------- | :---- | :------- | :---------- | :------------- | :------------ | :--------- | :----------- | :------------ | :-------- |
  | docs | http://db.htb-airport.htb/docs |  | 77 | 200 | 111914 | 28629 | 1791 | text/html; charset=UTF-8 | 180.177376ms |  |  | 0ee424d
  | player | http://db.htb-airport.htb/player |  | 548 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 927.494414ms |  |  | 0ee42224
  | schemas | http://db.htb-airport.htb/schemas |  | 783 | 200 | 94245 | 24298 | 2250 | text/html; charset=UTF-8 | 512.425751ms |  |  | 0ee4230f
  | dashboard | http://db.htb-airport.htb/dashboard |  | 912 | 200 | 63020 | 15129 | 1839 | text/html; charset=UTF-8 | 250.202343ms |  |  | 0ee42390
  | play | http://db.htb-airport.htb/play |  | 976 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 615.646143ms |  |  | 0ee423d0
  | players | http://db.htb-airport.htb/players |  | 1225 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 627.756697ms |  |  | 0ee424c9
  | ping | http://db.htb-airport.htb/ping |  | 2840 | 200 | 4 | 1 | 2 | text/html; charset=UTF-8 | 514.644688ms |  |  | 0ee42b18
  | playlist | http://db.htb-airport.htb/playlist |  | 3007 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 1.89870874s |  |  | 0ee42bbf
  | playground | http://db.htb-airport.htb/playground |  | 3863 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 495.066201ms |  |  | 0ee42f17
  | playlists | http://db.htb-airport.htb/playlists |  | 4655 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 320.36416ms |  |  | 0ee42122f
  | binary | http://db.htb-airport.htb/binary |  | 5619 | 200 | 10442 | 3628 | 301 | text/html; charset=UTF-8 | 89.288358ms |  |  | 0ee4215f3
  | schema | http://db.htb-airport.htb/schema |  | 9441 | 200 | 94245 | 24298 | 2250 | text/html; charset=UTF-8 | 437.76271ms |  |  | 0ee4224e1
  | docs2 | http://db.htb-airport.htb/docs2 |  | 10216 | 200 | 111914 | 28629 | 1791 | text/html; charset=UTF-8 | 542.9686ms |  |  | 0ee4227e8
  | playgame | http://db.htb-airport.htb/playgame |  | 10646 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 981.822655ms |  |  | 0ee422996
  | playdata | http://db.htb-airport.htb/playdata |  | 14839 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 484.1343ms |  |  | 0ee4239f7
  | playpen | http://db.htb-airport.htb/playpen |  | 18704 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 860.2466ms |  |  | 0ee424910
  | playnow | http://db.htb-airport.htb/playnow |  | 18703 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 864.476364ms |  |  | 0ee42490f
  | schematics | http://db.htb-airport.htb/schematics |  | 19048 | 200 | 94245 | 24298 | 2250 | text/html; charset=UTF-8 | 630.172972ms |  |  | 0ee424a68
  | play-bet-and-win | http://db.htb-airport.htb/play-bet-and-win |  | 20096 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 612.670236ms |  |  | 0ee424e80
  | dashboards | http://db.htb-airport.htb/dashboards |  | 23485 | 200 | 63020 | 15129 | 1839 | text/html; charset=UTF-8 | 509.291337ms |  |  | 0ee425bbd
  | docstore | http://db.htb-airport.htb/docstore |  | 23691 | 200 | 111914 | 28629 | 1791 | text/html; charset=UTF-8 | 614.087724ms |  |  | 0ee425c8b
  | docsearch | http://db.htb-airport.htb/docsearch |  | 23690 | 200 | 111914 | 28629 | 1791 | text/html; charset=UTF-8 | 615.757137ms |  |  | 0ee425c8a
  | play-bingo | http://db.htb-airport.htb/play-bingo |  | 26810 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 677.665571ms |  |  | 0ee4268ba
  | playafornells | http://db.htb-airport.htb/playafornells |  | 26817 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 679.797572ms |  |  | 0ee4268c1
  | playaflamenca | http://db.htb-airport.htb/playaflamenca |  | 26816 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 683.644507ms |  |  | 0ee4268c0
  | playadenbossa | http://db.htb-airport.htb/playadenbossa |  | 26815 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 1.294057719s |  |  | 0ee4268bf
  | playasanjuan | http://db.htb-airport.htb/playasanjuan |  | 26818 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 1.24324215s |  |  | 0ee4268c2
  | player2 | http://db.htb-airport.htb/player2 |  | 26819 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 1.413625277s |  |  | 0ee4268c3
  | playaaro | http://db.htb-airport.htb/playaaro |  | 26814 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 1.434885759s |  |  | 0ee4268be
  | playaamericas | http://db.htb-airport.htb/playaamericas |  | 26813 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 1.422976228s |  |  | 0ee4268bd
  | player-week | http://db.htb-airport.htb/player-week |  | 38248 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 1.009902315s |  |  | 0ee429568
  | dashboard2 | http://db.htb-airport.htb/dashboard2 |  | 41424 | 200 | 63020 | 15129 | 1839 | text/html; charset=UTF-8 | 250.946982ms |  |  | 0ee42a1d0
  | playVodMovieFlow | http://db.htb-airport.htb/playVodMovieFlow |  | 41946 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 299.918786ms |  |  | 0ee42a3da
  | docs3 | http://db.htb-airport.htb/docs3 |  | 42059 | 200 | 111914 | 28629 | 1791 | text/html; charset=UTF-8 | 196.211886ms |  |  | 0ee42a44b
  | docs4 | http://db.htb-airport.htb/docs4 |  | 42060 | 200 | 111914 | 28629 | 1791 | text/html; charset=UTF-8 | 208.103679ms |  |  | 0ee42a44c
  | docs_pdfs | http://db.htb-airport.htb/docs_pdfs |  | 42061 | 200 | 111914 | 28629 | 1791 | text/html; charset=UTF-8 | 482.154032ms |  |  | 0ee42a44d
  | play3 | http://db.htb-airport.htb/play3 |  | 44441 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 1.097166141s |  |  | 0ee42ad99
  | play2rss | http://db.htb-airport.htb/play2rss |  | 51717 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 608.659675ms |  |  | 0ee42ca05
  | playacodolar | http://db.htb-airport.htb/playacodolar |  | 51722 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 1.374789721s |  |  | 0ee42ca0a
  | playa | http://db.htb-airport.htb/playa |  | 51719 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 1.384943987s |  |  | 0ee42ca07
  | playahonda | http://db.htb-airport.htb/playahonda |  | 51725 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 1.397222677s |  |  | 0ee42ca0d
  | playaromantica | http://db.htb-airport.htb/playaromantica |  | 51728 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 1.4928563s |  |  | 0ee42ca10
  | playablanca | http://db.htb-airport.htb/playablanca |  | 51721 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 1.706344773s |  |  | 0ee42ca09
  | playacura | http://db.htb-airport.htb/playacura |  | 51723 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 1.722424004s |  |  | 0ee42ca0b
  | playaarena | http://db.htb-airport.htb/playaarena |  | 51720 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 1.686003119s |  |  | 0ee42ca08
  | playaduque | http://db.htb-airport.htb/playaduque |  | 51724 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 1.928391941s |  |  | 0ee42ca0c
  | playaparaiso | http://db.htb-airport.htb/playaparaiso |  | 51727 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 1.892743399s |  |  | 0ee42ca0f
  | playanaufragos | http://db.htb-airport.htb/playanaufragos |  | 51726 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 2.033929798s |  |  | 0ee42ca0e
  | play2rsz | http://db.htb-airport.htb/play2rsz |  | 51718 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 2.012905582s |  |  | 0ee42ca06
  | playflamenca | http://db.htb-airport.htb/playflamenca |  | 51731 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 1.919280654s |  |  | 0ee42ca13
  | playbook | http://db.htb-airport.htb/playbook |  | 51729 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 1.926705508s |  |  | 0ee42ca11
  | play-game | http://db.htb-airport.htb/play-game |  | 51716 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 1.944397261s |  |  | 0ee42ca04
  | play-for-real | http://db.htb-airport.htb/play-for-real |  | 51715 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 1.952738184s |  |  | 0ee42ca03
  | playgames | http://db.htb-airport.htb/playgames |  | 51732 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 2.085613478s |  |  | 0ee42ca14
  | plays | http://db.htb-airport.htb/plays |  | 51733 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 1.696980776s |  |  | 0ee42ca15
  | player-data | http://db.htb-airport.htb/player-data |  | 62005 | 200 | 936747 | 219446 | 17263 | text/html; charset=UTF-8 | 892.799634ms |  |  | 0ee42f235
  
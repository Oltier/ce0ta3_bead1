# ce0ta3 Alkalmazások fejlesztése 1. beadandó feladat



## Követelményanalízis

### Funkcionális elvárások
    
+ Felhasználóként szeretnék felvenni új tennivalót, hogy a családtagok minél hamarabb megcsinálhassák azokat.
+ Csak regisztrált családtagok láthassák a feladatokat.
+ Legyen lehetőség regisztrációra.
+ Legyen lehetőség bejelentkezésre, akár Google+ felhasználóval is.
+ Lehessen módosítani a tennivalók szerkesztésére.
+ Legyen lehetőség törölni tennivalót.

### Nem funkcionális elvárások

+ Felhasználóbarát, ergonomikus elrendezés és kinézet.
+ Gyors működés.
+ Biztonságos működés: jelszavak titkosított tárolás.
+ 99%+os rendelkezésre állás
 
### Szerepkörök

+ Gyerek: Látja a teendőket, tud törölni és szerkeszteni.
+ Felnőtt: Megegyezik a gyerekével. Fejlesztési lehetőség: csak a felnőttek tudjanak szerkeszteni és törölni.

![Használati eset diagram](docs/images/use-case.png)

![Új feladat felvitele folyamat diagram](docs/images/uj-feladat-hozzaadasa.png)

## Tervezés

### Oldaltérkép

Publikus:
+ Főoldal
+ Login
+ Regisztráció

Felhasználó:
+ Főoldal
+ Login/Logout
+ Feladatok listája
    + Új feladat
    + Feladat szerkesztése

### Végpontok

+ GET /: főoldal
+ GET /login: bejelentkező oldal
+ POST /login: bejelentkezési adatok felküldése
+ GET /login/signup: regisztációs oldal
+ POST /login/sugnup: regisztációs adatok felküldése
+ GET /todos/list: feladatlista oldal
+ GET /todos/new: új feladat oldal
+ POST /todos/new: új feladat felvitele
+ GET /todos/delete/:id: feladat törlése
+ GET /todos/edit/:id: feladat szerkesztése
+ POST /todos/edit:id: feladat szerkesztésének felküldése
 
### Oldalvázlatok

**Regisztrációs oldal**

![Regisztrációs oldal vázlata](docs/images/Regisztráció.jpg)

**Bejelentkezés oldal**

![Bejelentkezés oldal vázlata](docs/images/Bejelentkezés.jpg)

**Feladatok listaoldal**

![Feladatok listaoldal vázlata](docs/images/Todo_list.jpg)

**Új feladat létrehozása és módosítása oldal**

![Új feladat létrehozása és módosítása oldal vázlata](docs/images/Új_feladat.jpg)

### Designtervek

![Feladatok listaoldal design számítógépen](docs/images/Desktop.PNG)

![Új feladat design számítógépen](docs/images/desktop_új_feladat.PNG)

![Bejelentkezés okostelefonon (LG G3)](docs/images/phone.jpg)

A design megvalósítása Bootstrap segítségével történt a reszponzív felület elérésének érdekében. A weboldal többi oldalára is hasonló elrendezések érvényesek.

## Adatmodell

![Adatmodell diagramja](docs/images/adatmodell.png)

## Adatbázisterv

![Adatbázis diagramja](docs/images/database.png)
 
## Állapotdiagram

![Feladatok állapotdiagramja](docs/images/status.png)

## Implementáció

### Fejlesztői környezet

Cloud9 IDE egy ingyenes, integrált online fejlesztői környezet. Több száz programozási nyelvet támogat pl.: PHP, JavaScript, Node.js. A fejlesztők egy online virtuális linux gépen dolgozhatnak, ugyanazon a projecten akár egyszerre többen is. Az elkészült kódot azonnal lehet futtatni, rendelkezik böngészőtámogatással.

A virtuális gép adatai:

+ 1 CPU mag
+ 512 MB memória
+ 1 GB HDD

### Könyvtárstruktúrában lévő mappák funkiójának bemutatása

+ Root: Tartalmazza a telepítésekhez szükséges bower.json és package.json fájlokat, valamint a futtatható server.js fájlt.
+ bower_components: Kliens oldali függőségek ide töltődnek le.
+ config: Tartalmazza az waterline.js (sails.js) ORM konfigurációs fájlát.
+ controllers: Az egyes oldalak funkcióit implementáló fájlokat (végpontokat) tartalmazza, valamint egy felhasználó regisztrációs tesztet.
+ docs: Tartalmazza a dokumentációhoz tartozó képeket.
+ models: Az applikáció modelljei, melyekkel dolgozunk majd az oldalon.
+ node_modules: Tartalmazza a Node.js működését kiegészítő packageket. (middlewarek)
+ viewmodels: Tartalmazza a feladatok dekorációját elősegítő fájlt.
+ views: Tartalmazza a megjelenítendő oldalakat leíró handlebars fájlokat.

## Tesztelés

A tesztelés **mocha** keretrendszerrel és **chai.js** (egységtesztekhez), valamint **zombie.js** (funkcionális tesztekhez) ellenőrző könyvtárakkal lett megvalósítva.

### Futtatható tesztek

+ Funkcionális tesztek: mocha controllers/index.test.js
+ Egységtesztek: mocha models/member.test.js

### member.test.js

+ Megpróbál a megadott felhasználói adatok alapján új felhasználót létrehozni.
  - Hibás regisztrációs adatok esetén hibaüzenetet vár.
+ Megpróbál megtalálni egy felhasználót.
+ Helyes megadott jelszó esetén igazat vár.
+ Hibás megadott jelszó esetén hamisat vár.

### index.test.js

+ Nem regisztrált felhasználó a főoldalra kerül először, ahol látnia kell az üdvözlő szöveget.
+ Nem regisztrált felhasználó megpróbál új feladatot hozzáadni:
  - Ekkor átirányításra kerül a bejelentkezési oldalra.
+ Az átirányítási oldalon megpróbál bejelentkezni.
  - Hibás bejelentkezési adatok esetén visszakerül a bejelentkező oldalra hibaüzenettel.
  - A megfelelő bejelentkezési adatok esetén bejelentkezik és látja az eddig hozzáadott feladatok listáját.
+ Átmegy az új feladat felvétele oldalra.
+ Megpróbált új feladatot hozzáadni.
  - Üres mező esetén hibaüzenettel visszakerül ugyanarra az oldalra.
  - Kitöltött mezők esetén a feladatot elmentjük és a felhasználó visszakerül a lista oldalra, ahol látja az újonnan létrehozott feladat adatait.

## Felhasználói dokumentáció

### A futtatáshoz ajánlott hardver-, szoftver konfiguráció

Hardver szinten az ajánlott követelmény megegyezik a fejlesztői környezet specifikációival.

A weboldal bármilyen HTML5-t támogató böngészőben megjeleníthető és használható.

### Telepítés

A teljes weboldal megtalálható a http://bead1-ce0ta3.herokuapp.com/ webdoldalon.

Ha mégis saját gépen szeretné futtatni az alkalmazást, akkor a GIT Repository jobb oldalán található Download ZIP gombra kattintva a teljes project letölthető tömörítve.

### A program használata

A http://bead1-ce0ta3.herokuapp.com/ weboldalra navigálva láthatunk egy üdvözlő szöveget.

A képernyő jobb-felső sarkában található **Bejelentkezés** gombra kattintva elérhető a bejelentkezési felület.

Itt több választásunk is van:

+ Bejelentkezhetünk Google+ fiókkal, ekkor nincs szükség regisztrációra. (FIGYELEM: Ez az opció csak ezen az online felületen működik. Saját gépre letöltve a projectet, nem fog működni.)
+ Bejelentkezhetünk már meglévő felhasználói nevünkkel és jelszavunkkal (ha már van).
+ A Regisztráció gombra kattintva regisztrálhatunk az oldalra.

A regisztrációs oldalon minden mező kötelezően kitöltendő. Kitöltés után az **ELKÜLD** gombra kattintva végleges a regisztráció.

Későbbiekben az itt megadott adatokkal tudunk majd bejelentkezni. Most, át lettünk irányítva a feladatok listájának oldalára.

Itt láthatjuk az eddig felvitt feladatokat kategóriánként *új, kész, elmaradt* csoportosítva.

Az új feladat felvitele gombra kattintva vehetünk fel új teendőt.

Minden mező kitöltése kötelező, a **MENTÉS** gombra kattintva elmenthetjük a teendőt.

Ekkor visszatérünk ismét a feladatok oldalára és láthatjuk a frissen felvett teendőt. A teendő jobb oldalán található két gomb **SZERKESZT** és **TÖRLÉS**.

A **SZERKESZT** gombra kattintva a már előbb megismert oldalra kerülünk, ahol szerkeszthetjük a feladat adatait.

A **TÖRÖL** gombra kattintva törölhetjük az adott feladatot.

Ha már nem szeretnénk több dolgot csinálni a honlapon, a jobb felsős sarokban található **KILÉPÉS** gombra kattintva kiléphetünk az oldalról.





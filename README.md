# README zu RYLC-HTML5 #

Beispielcode zum Kapitel 8 "Die fertige Web-App" im Buch [Mobile Web-Apps mit JavaScript](opitz-consulting.com/go_javascriptbuch).

*   Voraussetzungen:
    *   Java Development Kit 1.6 oder neuer.
    *   Apache Maven 3.0.4 oder neuer.
    *   Die aktuelle Version von `JsTestDriver.jar` muss im lokalen Maven-Repository liegen.
        Dazu das Install-Skript `misc/install.sh` für Un*x-Systeme bzw. `misc\install.bat` für Windows ausführen.
*   Bauen der Backend-Komponente:
    *   Das GitHub-Projekt [rylc-backend](https://github.com/mjswa/rylc-backend) klonen
    *   In das Verzeichnis `rylc-backend-jar` wechseln
    *   Das Backend mittels `mvn clean install -Pproduction` bauen
*   Bauen des Projekts inkl. Integrationstests: `mvn clean verify -Pintegration`.
    Dazu muss [Chrome](http://www.google.com/chrome) über den Kommandozeilen-Befehl `chrome` gestartet werden können.
    Alternativ kann man Option `-Dbrowser=<Pfad zu Chrome>` beim Aufruf des mvn-Befehls angeben, beispielsweise wie folgt für OS X:
    
    <pre><code>$  mvn clean install -Pintegration -Dbrowser=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome</code></pre>
     
*   Manuelles Ausführen der Tests via JsTestDriver (für Un*x-Systeme):
    1.   Jetty mittels `mvn jetty:run` starten.
    1.  `jstd-server.sh` ausführen
    1.   Einen Browser über die URL [http://localhost:9876](http://localhost:9876) mit JsTestDriver verbinden.
    1.   Zum Ausführen der Tests `jstd-unit.sh` bzw. `jstd-ui.sh` aufrufen.
*   Manuelles Ausführen der Tests mit Hilfe der Spec Runner:
    1.   Jetty mittels `mvn jetty:run` starten.
    1.   Zum Ausführen von Unit Tests in Chrome den [Unit Spec Runner](http://localhost:8585/rylc-html5/UnitSpecRunner.html) aufrufen.
    1.   Zum Ausführen von UI Tests in Chrome den [UI Spec Runner](http://localhost:8585/rylc-html5/UiSpecRunner.html) aufrufen.
*   Starten und Aufrufen der Web-App
    1.   Jetty starten mittels `mvn jetty:run`.
    1.   [Startseite](http://localhost:8585/rylc-html5) der App aufrufen.
    1.   Mit Benutzername `fred` und Password `pass` anmelden.

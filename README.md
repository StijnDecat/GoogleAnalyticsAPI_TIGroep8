Google Analytics API javascript
===============================
Google Analystics API javascript is een stuk javascript die de Analytics Core Reporting API v3 gebruikt. Het laat toe om gemakkelijk bepaalde gegevens uit de API te halen om ze weer te geven op uw website.

Het is ontwikkeld door Stijn Decat en Jelle De Witte

Overview
========
De code maakt het makkelijker voor iedereen om de Google Analytics API te implementeren en gegevens op te vragen.
De belangrijkste features zijn:
1. Het weergeven van de unieke bezoekers, bezoeken en pageviews van de afgelopen week per dag of in het totaal
2. Het weergeven van een grafiek van de gebruikte browsers per dag
3. Het tekenen van een aangepaste grafiek van de gekozen gegevens

Getting started
===============
Contents
--------
Op de GitHub repository zijn een deel bestanden en mappen terug te vinden.
###Folders
* **example1**: volledig HTML voorbeeld met totalen en grafiek van de grebruikte browsers van de afgelopen 7 dagen

* **example2**: volledig HTML voorbeeld met unieke bezoekers, bezoeken en pageviews in tabel en grafiek vorm van de afgelopen 7 dagen

* **screenshots**: bevat enkele screenshots van de voorbeelden.
###Files
* **analytics_api.html**: standaard html indien u van nul wenst te starten

* **analytics_api.js**: javascript code met alles om de API call te doen en de gegevens te verwerken
* **analytics_api_auth.js**: javascript code met alles om je te authenticeren bij de Google Analytics API

Requirements
------------
U hebt een Google Analytics account nodig en toegang tot de Google Analytics Core Reporting API (zie verder)

Install
-------
### U hebt een bestaande website en wenst de Google Analytics API te gebruiken
Download de 2 *.js bestanden en plaats die in de root van uw website.

Kopieer volgende code in de header van de html waarop u de gegevens wenst te gebruiken:

    <link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/black-tie/jquery-ui.css">
    <script>
    var firstAccountId = 65216651; //formaat: xxxxxxxxxx - verplicht
    var firstWebpropertyId = 'UA-6561656-1'; //formaat: 'UA-xxxxxxxxx-x' - verplicht
    var firstProfileId = 651616198; //formaat: xxxxxxxxxx - verplicht
    var clientId = '659286161654816-lksjdhfqslkjsqdf5qsd6f7qsdf.apps.googleusercontent.com'; //zie handleiding - verplicht
    var apiKey = 'AIzaSyMMdSsqefsSDDFSxGxsx5R_kl70YC3jCDVY'; //zie handleiding - verplicht
    var viewTotals = false;
    </script>
    <script src="http://code.jquery.com/jquery-1.9.1.js"></script>
    <script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
    <script src="analytics_api_auth.js"></script> 
    <script src="analytics_api.js"></script> 
    <script src="https://apis.google.com/js/client.js?onload=handleClientLoad"></script>
    <script src="https://www.google.com/jsapi"></script>
    <script>
    google.load("visualization", "1", {packages:['corechart', 'table']});
    </script>

### U hebt nog geen website en wenst vanaf het begin te starten
Download de 2 *.js bestanden alsook het *.html bestand en plaats die in een dezelfde map.


In de volgende delen zien we hoe je een project aanmaakt en welke gegevens we in de variabelen dienen te steken.

Creëer een nieuw Google API project
-----------------------------------
Ga naar https://cloud.google.com/console en log in met uw Google (Analytics) account.

Creëer een nieuw project.

In het project klik links op *APIs & auth* en zet de *Analytics API* op *ON*.

Ga naar *Credentials* en kies voor "Create new Client ID" in de OAuth 2.0 sectie

Kies voor *Web application*.

Bij *Authorized Javascript Origins* vult u alle adressen in waarvan een mogelijke request naar Google zou kunnen gebeuren.

Wanneer de applicatie lokaal draait in een wamp omgeving dient het eerste *http://localhost* te zijn en bij *Authorized redirect URI* dient u *http://localhost/oauth2callback* in te voeren.

Anders dient u localhost host te veranderen in uw eigen domein.

In deze velden kunnen telkens meerdere webadressen voorkomen.

Daarnaast dient men ook een public API access key te maken. 

Klik op *Create New Key* en kies voor *Browser Key*.

Bij *Accept Requests* dien je opnieuw de URL's op te geven of kan men gebruikmaken van het *.

Kopieer nu de *Client ID* en *API key* naar de respectievelijke *clientId* en *apiKey* velden in de code hierboven.

    clientId = '1094354988254-n97tes7viicpmb8jkulhijpk6gm2s6ic.apps.googleusercontent.com'; //zie handleiding - verplicht
    var apiKey = 'AIzaSyBBsFDQSdfqsdfqR_kl65sdf3jCDVY'; //zie handleiding - verplicht

Google Analytics *account | webproperty | profile id*
-----------------------------------------------------
Google analytics werkt volgend drie niveaus, namelijk:
1. Account
2. Web property
3. Profile ID
###Account
Standaard heb je een Google Account. Om Google Analytics te gebruiken dien je een Analytics account aan te maken. Het is dit account die we zullen nodig hebben in het script
###Web properties
Een Web property definieërt de verschillende websites waarop je Google Analytics toepast.
###Profiles
Een profiel is een speciale weergave van gegevens die je kan maken voor bijvoorbeeld de sales afdeling je bedrijf.

Het zal ook dat profiel zijn dat we zullen gebruiken in het script.

###U hebt maar 1 account, web property en profiel, m.a.w. u hebt maar 1 website waarop u Google Analytics toepast
Dan is het heel simpel. U laat de velden in de code *firstAccountId, firstWebpropertyId en firstProfileId* leeg (zoals hieronder). Het script zal automatisch de correcte gegevens gebruiken.

    var firstAccountId = 0; 
    var firstWebpropertyId = ''; 
    var firstProfileId = 0; 

###U hebt meerdere accounts, webproperty's en profielen, m.a.w. u hebt meer dan 1 website waarop u Google Analytics toepast
Meld u aan bij Google Analytics en ga naar de admin/beheerder interface (rechts boven)

Hier vind u in 3 kolommen respectievelijk Account, Property en Profiel.

Selecteer het betreffende Account, Property en Profiel en bekijk van elk zijn settings (eerste optie).

Hierin vindt u telkens op de eerste lijn een ID.

Plak deze ID in de overeenstemmende velden van de code.

    var firstAccountId = 4767868976; 
    var firstWebpropertyId = 'UA-78697867896-1'; 
    var firstProfileId = 7896789789; 
	
Uitvoer van de resultaten
-------------------------
De uitvoer van de resultaten wordt in een `div` geplaatst. Er zijn 3 verschillende soorten:

* `<div id="table_div"></div>` -- Geeft een tabel terug
* `<div id="chart_div"></div>` -- Geeft een grafiek met alle tabelgegevens terug
* `<div id="chartBrowsers_div"></div>` -- Geeft een grafiek met gebruikte browsers terug

Indien een eigen hoogte en breedte gewenst is kun je volgend attribuut toevoegen aan de *div*

	style="width:200px; height:150px"
	
Een div ziet er dan zo uit:

	<div id="table_div" style="width:200px; height:150px"></div>

Het script is nu geïnstalleerd op in de website en kan gebruikt worden. Verder zien we bijkomende opties en opmaak

Features en opties
==================
In het script zijn verschillende opties opgenomen.

De eerste optie laat u toe om alle totalen van de afgelopen 7 dagen te bekijken. Indien deze optie op `true` staat krijg je zoiets te zien:

    Vieuws: 25
	Visitors: 24
	Unique visitors: 8
Indien op false krijg je een weergave dag per dag in een tabel 

    Day        Mo  Tu  We  Th  Fr  Sa  Su
	Visitors   2   5   6   1   0   8   2
	...
	
Zoals reeds eerder vermeld kunt u kiezen welke `div` u waar wilt zetten. 

Er is tevens geen verplichting om ze allemaal te gebruiken. U kan er gerust 1 of 2 of alle 3 gebruiken.

Opmaak
======
De opmaak van alles kan via een eigen *.css* gebeuren. Hiervoor is echter een basiskennis HTML en CSS vereist alsook het werken met de browser developper tools.

Voor de gevorderde gebruikers:

Alles werd gemaakt met Google Graphs API. U kunt de code zelf bekijken en aanpassen waar nodig.


Eerste gebruik
==============
De allereerste keer dat de code gebruikt zal worden zal je je moeten authenticeren bij Google.

Dit is een verplichte stap bij het gebruik van de Google API voor Analytics.

Indien alles correct geïnstalleerd is krijg je een button met *Authorize* erop.

Klik hierop en login met uw Google account die u hebt gebruikt om toegang tot de API te krijgen.

De volgende keren dat u met uw webbrowser de pagina bezoekt zou dit niet meer mogen voorkomen.


Examples
========
Op de GitHub repository staan nog 2 volledige voorbeelden waarbij het is geïntegreerd in een webpagina.

Example 1 is een voorbeeld waarbij alle totalen worden weergegeven alsook een grafiek van de gebruikte browsers

Example 2 is een voorbeeld waarbij de ganse tabel dag per dag wordt weergegeven alsook in grafiekvorm

De code toegelicht
==================
##analytics_api.html
Dit is de basis html lay-out zoals hierboven reeds beschreven werd voor het opgeven van de parameters en het weergeven van de resultaten

	<!DOCTYPE>
	<html>
	<head>
	<title>Analytics API voorbeeld</title>
	<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/black-tie/jquery-ui.css">
	<script>
	//Vul hieronder het gewenste account, web property en profiel in. (zie handleiding) 
	//Laat leeg indien u niet weet wat het is of u maar 1 website hebt met analytics
	var firstAccountId = 7542842; //formaat: xxxxxxxxxx - verplicht
	var firstWebpropertyId = 'UA-8782892-1'; //formaat: 'UA-xxxxxxxxx-x' - verplicht
	var firstProfileId = 892892892; //formaat: xxxxxxxxxx - verplicht
	var clientId = '8928928792-qsdfqsdf65qsd61qsdf64sqddf564.apps.googleusercontent.com'; //zie handleiding - verplicht
	var apiKey = 'AIzasqdfqsdf65sqd6f45sddfx5R_kl70YC3jCDVY'; //zie handleiding - verplicht
	var viewTotals = false;
	</script>
	<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
	<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
	<script src="analytics_api_auth.js"></script> 
	<script src="analytics_api.js"></script> 
	<script src="https://apis.google.com/js/client.js?onload=handleClientLoad"></script>
	<script src="https://www.google.com/jsapi"></script>
	<script>
	google.load("visualization", "1", {packages:['corechart', 'table']});
	</script>
	</head>
	<body>
	<div id="chart_div" style="width: 500px; height: 400px;"></div>
	<div id="chartBrowser_div" style="width: 500px; height: 400px;"></div>
	<div id="table_div" style="width: 500px; height:250px;"></div>

	</body>
	</html>

##analytics_api_auth.js
Dit script zorgt voor de authenticatie bij Google. Het grootste deel hiervan komt officieel van Google mits enkele kleine eigen modificaties zoals het tonen van de *authorize* button.

	var scopes = 'https://www.googleapis.com/auth/analytics.readonly';

	function handleClientLoad() {
	  // 1. Set the API Key
	  gapi.client.setApiKey(apiKey);

	  // 2. Call the function that checks if the user is Authenticated. This is defined in the next section
	  window.setTimeout(checkAuth,1);
	}

	function checkAuth() {
	  // Call the Google Accounts Service to determine the current user's auth status.
	  // Pass the response to the handleAuthResult callback function
	  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
	}

	function handleAuthResult(authResult) {
	  if (authResult) {
		// The user has authorized access
		// Load the Analytics Client. This function is defined in the next section.
		loadAnalyticsClient();
	  } else {
		// User has not Authenticated and Authorized
		handleUnAuthorized();
	  }
	}

	function loadAnalyticsClient() {
	  // Load the Analytics client and set handleAuthorized as the callback function
	  gapi.client.load('analytics', 'v3', handleAuthorized);
	}

	// Authorized user
	function handleAuthorized() {
	  makeApiCall();
	}

	// Unauthorized user
	function handleUnAuthorized() {
	  var id = "";
	  // Show the 'Authorize Button' and hide the 'Get Visits' button
	  if(document.getElementById('chart_div')){
		id="chart_div";
	  }else{
		  if(document.getElementById('chartBrowser_div')){
			  id="chartBrowser_div";
		  }else{
			  id="table_div";
		  }
	  }
	  document.getElementById(id).innerHTML = '<button id="authorize-button" style="position:absolute">Authorize</button>';
	  var authorizeButton = document.getElementById('authorize-button');
	  
	  // When the 'Authorize' button is clicked, call the handleAuthClick function
	  authorizeButton.onclick = handleAuthClick;
	}

	function handleAuthClick(event) {
	  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
	  return false;
	}

##analytics_api.js
Dit is het schript dat de API calls maakt alsook de resultaten weergeeft.

Gebruikte variabelen in het script:

	var datum = new Date();
	var teller = 1;
	var resultaten = new Array();
	var browsertabel = new Array();
	var progress = 0;
	
Een functie die op verschillende plaatsen in het script aangeroepen wordt om de progressbar te updaten:


	function augmentProgress(){
		if(progress==0){
			$("div#chart_div, div#chartBrowser_div, div#table_div").html("<div id=loading></div>");
			$("div#loading").css("height", "30px");
			$("div#loading").progressbar({value:0});
		}
	progress += 10;
	$("div#loading").progressbar("option","value",progress);
	}
	
Het maken van de API call en aanmaken van de 2-dimensionale tabellen in javascript. Standaard ondersteund javascript dit niet maar met een ommetje lukt het wel. Daarnaast vullen we kopteksten van de tabellen in en vullen we de tabel van de browsers op met 0.

	function makeApiCall() {
	  console.log('Starting Request Process...');
	  queryAccounts();
	  createArrays();
	}
	function createArrays(){
	for(var i=0; i<4; i++){
		resultaten[i] = new Array();
	}
	resultaten[0][0] = "Day"
	resultaten[1][0] = "Visits";
	resultaten[2][0] = "Unique Visitors";
	resultaten[3][0] = "Pageviews";
	
	for(var i=0; i<8; i++){
		browsertabel[i]=new Array();
	}
	browsertabel[0][0] = "Browsers";
	browsertabel[0][1] = "Internet Explorer";
	browsertabel[0][2] = "Chrome";
	browsertabel[0][3] = "Firefox";
	browsertabel[0][4] = "Safari";
	
	for(var i=1; i<8; i++){
		for(var j=0; j<5; j++){
			browsertabel[i][j]= parseInt(0);
		}
	}
    }

Hierna maakt hij de uiteindelijke oplossingen array en begint hij met het opvragen van het eerste Analytics account, het eerste Web Property en het eerste profiel. Deze drie reeds zijn ingevuld springt hij direct naar het volgende blok code. Dit is grotendeels code aangeleverd door Google en bewerkt door ons

	function queryAccounts() {
	  console.log('Querying Accounts.');
	  augmentProgress();
	  // Get a list of all Google Analytics accounts for this user
	  gapi.client.analytics.management.accounts.list().execute(handleAccounts);
	}


	function handleAccounts(results) {
	  if (!results.code) {
		if (results && results.items && results.items.length) {
			if(firstAccountId ==0){
		  // Get the first Google Analytics account
		  firstAccountId = results.items[0].id;
			}
		  // Query for Web Properties
		  queryWebproperties(firstAccountId);
		  augmentProgress();

		} else {
		  console.log('No accounts found for this user.')
		}
	  } else {
		console.log('There was an error querying accounts: ' + results.message);
	  }
	}


	function queryWebproperties(accountId) {
	  console.log('Querying Webproperties.');

	  // Get a list of all the Web Properties for the account
	  gapi.client.analytics.management.webproperties.list({'accountId': accountId}).execute(handleWebproperties);
	}


	function handleWebproperties(results) {
	  if (!results.code) {
		if (results && results.items && results.items.length) {
			if(firstAccountId == 0){
		  // Get the first Google Analytics account - xxxxxxxxxxxx(numbers)
		  firstAccountId = results.items[0].accountId;
			}
			if(firstWebpropertyId == ''){
		  // Get the first Web Property ID -- ua-xxxxxxxxxxx
		  firstWebpropertyId = results.items[0].id;
			}
		  // Query for Views (Profiles) - xxxxxxxxx
		  queryProfiles(firstAccountId, firstWebpropertyId);
		  augmentProgress();

		} else {
		  console.log('No webproperties found for this user.');
		}
	  } else {
		console.log('There was an error querying webproperties: ' + results.message);
	  }
	}


	function queryProfiles(accountId, webpropertyId) {
	  console.log('Querying Views (Profiles).');

	  // Get a list of all Views (Profiles) for the first Web Property of the first Account
	  gapi.client.analytics.management.profiles.list({
		  'accountId': accountId,
		  'webPropertyId': webpropertyId
	  }).execute(handleProfiles);
	}

	//var firstProfileId;
	function handleProfiles(results) {
	  if (!results.code) {
		if (results && results.items && results.items.length) {
			if(firstProfileId == 0){
		  // Get the first View (Profile) ID
		  firstProfileId = results.items[0].id;
			}
		  // Query the Core Reporting API
		  queryCoreReportingApi(firstProfileId);
		  augmentProgress();

		} else {
		  console.log('No views (profiles) found for this user.');
		}
	  } else {
		console.log('There was an error querying views (profiles): ' + results.message);
	  }
	}
	
De uiteindelijke call voor het opvragen van de gegevens van x aantal dagen geleden (begin bij gisteren / 1daysAgo). We vragen hierbij volgende gegevens op:
* Visits
* Unique visitors
* Pageviews
* Gebruikte browser

We sorteren vervolgens op het aantal bezoekers om zo snel de meest gebruikte browser te vinden.

	function queryCoreReportingApi(profileId) {
	  console.log('Querying Core Reporting API.');
		  // Use the Analytics Service Object to query the Core Reporting API
	  gapi.client.analytics.data.ga.get({
		'ids': 'ga:' + profileId,
		'start-date': (teller)+'daysAgo' ,
		'end-date': (teller)+'daysAgo',
		'metrics': 'ga:visits, ga:visitors, ga:pageviews',
		'dimensions': 'ga:browser',
		'sort':'-ga:visits'
	  }).execute(handleCoreReportingResults);
	  augmentProgress();
	}

Hetgeen we van deze query terugkrijgen is het volgende:

	{
		"kind": "analytics#gaData",
		"id": "https://www.googleapis.com/analytics/v3/data/ga?ids=ga:6738748&dimensions=ga:browser&metrics=ga:visits,ga:visitors,ga:pageviews&sort=-ga:visits&start-date=2013-10-29&end-date=2013-10-29",
		"query": {
		"start-date": "2013-10-29",
		"end-date": "2013-10-29",
		"ids": "ga:6738748",
		"dimensions": "ga:browser",
		"metrics": ["ga:visits","ga:visitors","ga:pageviews"],
		"sort": ["-ga:visits"],
		"start-index": 1,
		"max-results": 1000
		},
		"itemsPerPage": 1000,
		"totalResults": 4,
		"selfLink": "https://www.googleapis.com/analytics/v3/data/ga?ids=ga:6738748&dimensions=ga:browser&metrics=ga:visits,ga:visitors,ga:pageviews&sort=-ga:visits&start-date=2013-10-29&end-date=2013-10-29",
		"profileInfo": {
			"profileId": "6738748",
			"accountId": "3445744",
			"webPropertyId": "UA-3445744-1",
			"internalWebPropertyId": "6513718",
			"profileName": "www.temalec.be",
			"tableId": "ga:6738748"
		},
		"containsSampledData": false,
		"columnHeaders": [
			{
				"name": "ga:browser",
				"columnType": "DIMENSION",
				"dataType": "STRING"
			},
			{
				"name": "ga:visits",
				"columnType": "METRIC",
				"dataType": "INTEGER"
			},
			{
				"name": "ga:visitors",
				"columnType": "METRIC",
				"dataType": "INTEGER"
			},
			{
				"name": "ga:pageviews",
				"columnType": "METRIC",
				"dataType": "INTEGER"
			}
		],
		"totalsForAllResults": {
			"ga:visits": "8",
			"ga:visitors": "7",
			"ga:pageviews": "29"
		},
		"rows": [
			[
				"Internet Explorer",
				"4",
				"3",
				"13"
			],
			[
				"Chrome",
				"2",
				"2",
				"7"
			],
			[
				"Firefox",
				"1",
				"1",
				"2"
			],
			[
				"Safari",
				"1",
				"1",
				"7"
			]
		]
	}

Hieruit kunnen we makkelijk alle benodigde gegevens halen om de tabellen op te vullen (zie verder).

Er wordt gecontroleerd of we de gegevens correct hebben kunnen opvragen:

	function handleCoreReportingResults(results) {
	  if (results.error) {
		console.log('There was an error querying core reporting API: ' + results.message);

	  } else {
		processResults(results);
	  }
	}

En de resultaten worden verwerkt. We vullen de tabel per kolom op, met bovenaan de dag en eronder de resultaten. We kijken tevens om de tabel met gebruikte browsers op te vullen.

	function processResults(results) {
		datum.setDate(datum.getDate()-1);
		resultaten[0][8-teller] = datum.toString().substr(0,3);
		resultaten[1][8-teller] = parseInt(results.totalsForAllResults["ga:visits"]);
		resultaten[2][8-teller] = parseInt(results.totalsForAllResults["ga:visitors"]);
		resultaten[3][8-teller] = parseInt(results.totalsForAllResults["ga:pageviews"]);
		
		
		browsertabel[8-teller][0] = datum.toString().substr(0,3);
		if (results.rows && results.rows.length) {
			for(var i=0; i<results.rows.length; i++){
				switch(results.rows[i][0]){
					case "Internet Explorer":
						browsertabel[8-teller][1] = parseInt(results.rows[i][1]);
						break;
					case "Chrome":
						browsertabel[8-teller][2] = parseInt(results.rows[i][1]);
						break;
					case "Mozilla" || "Firefox":
						browsertabel[8-teller][3] = parseInt(results.rows[i][1]);
						break;
					case "Safari":
						browsertabel[8-teller][4] = parseInt(results.rows[i][1]);
						break;
					default:
						break;
				}
			}		
		}
		
		teller++;
		if(teller <= 7){
			queryCoreReportingApi(firstProfileId);
		}else{
			printResults();
		}
	
	}

Daarna beginnen we met het afdrukken van de resultaten. Als eerste verwijderen we onze progressbar die we gebruikt hebben.

Om te kijken welke gegevens de gebruiker wenst, kijken we per onderdeel met een simpele `if` of de benodigde `div` aanwezig is.

Wanneer de gebruiker de totalen wenst (viewTotals = true), maken we eerst een hulptabel, berekenen we de totalen en sturen we die door naar de `drawTable()` functie.

	function printResults(){
		$("div#chart_div, div#chartBrowser_div, div#table_div").html("");
		if(document.getElementById('table_div')){
		  switch(viewTotals){
			  case false:
			  drawTable(resultaten);
				  break;
				  
			  case true:
				  var hulptabel = new Array();
				  for(var i=0; i<4; i++){
					  hulptabel[i] = new Array();
				  }
				  hulptabel[0][0] = "";
				  hulptabel[0][1] = "Totals";
				  for(var i=1; i<resultaten.length; i++){
					  for(var j=0; j<resultaten[i].length; j++){
						  if(j==0){
							  hulp = 0;
							  hulptabel[i][0] = resultaten[i][j];
						  }else{
							  hulp += resultaten[i][j];
						  }
					  }
					  hulptabel[i][1] = parseInt(hulp);
				  }
				  drawTable(hulptabel);
				  break;
		  }
		}
		if(document.getElementById('chartBrowser_div')){
		drawBrowserGraph();
		}
		if(document.getElementById('chart_div')){
		drawGraph();
		}
		
		  
	}

Dit is de functie om de tabel te tekenen met behulp van Google Graphs

	function drawTable(tabel){
		var data = new google.visualization.arrayToDataTable(tabel);
		
		var table = new google.visualization.Table(document.getElementById('table_div'));
		table.draw(data, {showRowNumber: false});
			
		
	}
	
De functie om de browsertabel te maken. Wanneer ja naar de Google Graphs API surft kun je nog tal van andere opties kiezen.

	function drawBrowserGraph(){
		var data = google.visualization.arrayToDataTable(browsertabel);

			var options = {
			  title: 'Browsers',
			  hAxis: {title: 'Visits', titleTextStyle: {color: '#333'}}
			};

			var chart = new google.visualization.ColumnChart(document.getElementById('chartBrowser_div'));
			chart.draw(data, options);

		
	}
	
Als laatste de functie om de gewone grafiek te tekenen. Hiervoor dienen we de tabel eerst om te draaien. Dit is noodzakelijk om te voldoen aan de Google Graphs API.

	function drawGraph(){
		var tabel = new Array();
		for(var i=0; i<=7; i++){
			tabel[i] = new Array();
		}
		
		for(var i=0; i<resultaten.length; i++){
			for(var j=0; j<resultaten[i].length; j++){
				tabel[j][i] = resultaten[i][j];
			}
		}
		
		var data = google.visualization.arrayToDataTable(tabel);

		var options = {
		  title: 'Statistics',
		  hAxis: {title: 'Day',  titleTextStyle: {color: '#333'}},
		  vAxis: {minValue: 0}
		};

		var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
		chart.draw(data, options);
			
	}

Examples and usage of existing templates
========================================

De gebruikte gegevens die reeds in de documenten zit (client ID, API key, webpropertyid, etc...) zijn fictieve data!

U dient eerst alle stappen onder getting started te voltooien vooraleer u aan de slag kunt gaan met de voorbeelden!

Screenshots
===========

Onder de map screenshots vind je enkele screenshots van de *example 1* en *example 2* alsook het basissjabloon van de hoofdmap *analytics_api.html*

Restricties
===========
* De opmaak van de tabellen en grafieken is grotendeels in het bezit van Google. Die maakt het niet mogelijk om op eenvoudige wijze de opmaak van de grafieken aan te passen voor een leek.
* Om de Google Analytics API te gebruiken dien je altijd een eerste keer in te loggen.
* Bij het te klein maken van de ruimte voor de tabel krijgt men scrollbars

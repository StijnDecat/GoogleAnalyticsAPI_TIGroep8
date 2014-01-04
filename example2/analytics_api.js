var datum = new Date();
var teller = 1;
var resultaten = new Array();
var browsertabel = new Array();
var progress = 0;


function augmentProgress(){
	if(progress==0){
		$("div#chart_div, div#chartBrowser_div, div#table_div").html("<div id=loading></div>");
		$("div#loading").css("height", "30px");
		$("div#loading").progressbar({value:0});
	}
	progress += 10;
	$("div#loading").progressbar("option","value",progress);
}

function makeApiCall() {
  console.log('Starting Request Process...');
  queryAccounts();
  createArrays();
}


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


function handleCoreReportingResults(results) {
  if (results.error) {
    console.log('There was an error querying core reporting API: ' + results.message);

  } else {
    processResults(results);
  }
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
		console.log(browsertabel);
	drawBrowserGraph();
	}
	if(document.getElementById('chart_div')){
	drawGraph();
	}
	
	  
}

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

function drawBrowserGraph(){
	var data = google.visualization.arrayToDataTable(browsertabel);

        var options = {
          title: 'Browsers',
          hAxis: {title: 'Visits', titleTextStyle: {color: '#333'}}
        };

        var chart = new google.visualization.ColumnChart(document.getElementById('chartBrowser_div'));
        chart.draw(data, options);

	
}

function drawTable(tabel){
	var data = new google.visualization.arrayToDataTable(tabel);
	
	var table = new google.visualization.Table(document.getElementById('table_div'));
	table.draw(data, {showRowNumber: false});
		
	
}
      
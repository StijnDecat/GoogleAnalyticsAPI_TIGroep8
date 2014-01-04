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



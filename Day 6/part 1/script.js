window.onload = function(){
    var submitButton = document.getElementById("submit")
    submitButton.addEventListener('click', function(event){
            event.preventDefault()
            login()
    })
}

function login(){
    // create a client here: https://developer.whereismytransport.com/clients
    var CLIENT_ID = 'fa72a08f-8a83-4afb-9745-45928d53a33d';
    var CLIENT_SECRET = 'h4nm/NILXKJvtcaJTubJCuZULH1NJwyTAOdha6O/1VU=';
    var payload = {
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'grant_type': 'client_credentials',
    'scope': 'transportapi:all'
    };

var request = new XMLHttpRequest();
request.open('POST', 'https://identity.whereismytransport.com/connect/token', true);
request.addEventListener('load', function () {
  var response = JSON.parse(this.responseText);
  var token = response.access_token;
  window.token = token;
});
request.setRequestHeader('Accept', 'application/json');
var formData = new FormData();

for (var key in payload) {
  formData.append(key, payload[key]);
}

request.send(formData);
}

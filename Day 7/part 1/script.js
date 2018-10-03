window.onload = function(){
  if(hasToken()){
      getAgencies(this.localStorage.getItem('token'))
  }

  var submitButton = this.document.getElementById('submit')
  submitButton.addEventListener('click', function(event){
      event.preventDefault()

      var clientId = getClientId()
      var clientSecret = getClientSecret()
      login(clientId, clientSecret)
  })

  var logoutButton = this.document.getElementById('submit-logout')
  logoutButton.addEventListener('click', function(event){
      event.preventDefault()
      localStorage.removeItem('token')
      localStorage.removeItem('storageDate')
  })

  var agenciesButton = this.document.getElementById('submit-agency')
  agenciesButton.addEventListener('click', function(event){
    event.preventDefault()

    var selectAgenciesDropdown = document.getElementById('agencies-select')
    var selectAgency = selectAgenciesDropdown.options[selectAgenciesDropdown.selectedIndex].value
    var token = getToken()
    getLines(token, selectAgency)
  })
}


function hasToken(){
  //check if token exists in local storage
  var token = localStorage.getItem('token')
  console.log(token)
  if(token){
      //hide the form if the token exists
      var loginForm = document.getElementById('login-form')
      //loginForm.classList.add('is-invisible')
      loginForm.style.display = 'none'
      return true
  }
  else{
      return false
  }
}

function getClientId(){
  var clientId = document.getElementById('client-id')
  return clientId.value
}

function getClientSecret(){
  var clientSecret = document.getElementById('client-secret')
  return clientSecret.value
}

function login(clientId, clientSecret){
  // create a client here: https://developer.whereismytransport.com/clients
  var CLIENT_ID = clientId;
  var CLIENT_SECRET = clientSecret;
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

          localStorage.setItem('token', token)
          localStorage.setItem('storageDate', Date.now().toLocaleString())
  
  });
  request.setRequestHeader('Accept', 'application/json');
  var formData = new FormData();

  for (var key in payload) {
  formData.append(key, payload[key]);
  }
  request.send(formData);
}

function getAgencies(token){
  var request = new XMLHttpRequest();
  request.addEventListener('load', function () {
      var list = JSON.parse(this.responseText);
      addAgenciesToDropDown(list)
  });
  request.open('GET', 'https://platform.whereismytransport.com/api/agencies', true);
  request.setRequestHeader('Accept', 'application/json');
  request.setRequestHeader('Authorization', 'Bearer ' + token);
  request.send();
}

function addAgenciesToDropDown(list){
  var dropdown = document.getElementById('agencies-select')
  dropdown.options.length = 0
  dropdown.options.add(new Option("Select an option", null, true, true))
  
  list.forEach(function(agency){
    dropdown.options.add(new Option(agency.name, agency.id, false, false))
  })
}

function getLines (token, agency) {
  var request = new window.XMLHttpRequest()
  request.addEventListener('load', function () {
    if (this.status === 401) {
      return logout()
    }
    var response = JSON.parse(this.responseText)
    addLinesToDropDown(response)
    show('lines-form')
  })
  request.open('GET', 'https://platform.whereismytransport.com/api/lines?agencies=' + agency, true)
  request.setRequestHeader('Accept', 'application/json')
  request.setRequestHeader('Authorization', 'Bearer ' + token)
  request.send()
}

function addLinesToDropDown (linesList) {
  var linesSelect = document.getElementById('submit-lines')
  linesSelect.options.length = 0
  linesSelect.options.add(new window.Option('Select an option', null, true, true))

  linesSelect.forEach(function (line) {
    linesSelect.options.add(new window.Option(line.name, line.id, false, false))
  })
}


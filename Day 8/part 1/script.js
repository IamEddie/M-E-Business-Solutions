window.onload = function(){
  show('login-form')
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
  //var journeyButton = document.getElementById('submit-journey')
  //journeyButton.addEventListener('click', function(event){
    //event.preventDefault()
    //var start = document.getElementById('start').value
    //var destination = document.getElementById('destination').value

    //alert(start + ',' + destination)
  //})
  loadMap()
}

function loadMap(){
    mapboxgl.accessToken = 'pk.eyJ1IjoiaWFtZWRkaWUiLCJhIjoiY2ptdWJ5azl4MG45NDNrbzI4bWFsZ3Y0dSJ9.5s5MKtabRL3nnlUnpCVNbA';
    window.map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    center: [18.4241, -33.9249], // starting position [lng, lat]
    zoom: 9 // starting zoom
  });

  window.startPin = new mapboxgl.Marker().setLngLat([0, 0]).addTo(window.map)
  window.destinationPin = new mapboxgl.Marker().setLngLat([0, 0]).addTo(window.map)

  window.map.on('click', function (event){
    console.log(event)
    //if//
    if(window.startPoint == true){
      window.destinationPin.setLngLat(event.lngLat)
      window.startPoint = false
      document.getElementById('destination').value = event.lngLat.lng + ',' + event.lngLat.lat
    }else{
      window.startPin.setLngLat(event.lngLat)
      window.startPoint = true
      document.getElementById('start').value = event.lngLat.lng + ',' + event.lngLat.lat
    }
  })

}


function show(formId){
  //var loginForm = document.getElementById('login-form')
  //loginForm.style.display = 'none'
  //document.getElementById('login-form').style.display = 'none'
  document.getElementById('logout-form').style.display = 'none'
  document.getElementById('agencies-form').style.display = 'none'
  document.getElementById('lines-form').style.display = 'none'
  document.getElementById('login-form').style.display = 'none'

  document.getElementById(formId).style.display = 'block'
  if(formId != 'login-form'){
    document.getElementById('logout-form').style.display = 'block'
    document.getElementById('map-form').style.display = 'block'
    document.getElementById('journey-form').style.display = 'block'
  }

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


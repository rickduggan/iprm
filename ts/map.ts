let map: google.maps.Map;
let assetCount = 0;
const overlays: google.maps.Marker[] = [];
// TODO: replace with your own key
const ip2locationKey = '';
const homeURL = 'https://api.ipify.org?format=json';
const dnsURL = 'https://dns.google.com/resolve?name=';
const geoipURL = 'https://api.ip2location.io/?key=' + ip2locationKey + '&ip='

chrome.storage.onChanged.addListener(function (changes) {
  for (const key in changes) {
    geoLocate({ hostname: changes[key].newValue });
  }
});

function getIPAddress(): Promise<string> {
  return fetch(homeURL)
    .then(response => response.json())
    .then(data => data.ip)
    .catch(error => {
      console.error("Error fetching IP address:", error);
      return ''; // Return empty string in case of error
    });
}

function getHomeIP(): void {
  getIPAddress()
    .then(ipAddress => {
      if (!ipAddress) {
        throw new Error('Failed to get IP address');
      }
      return fetch(geoipURL + ipAddress);
    })
    .then(response => response.json())
    .then(data => createMap(data))
    .catch(error => console.error('Error in getHomeIP:', error));
}

function createMap(data: { latitude: number; longitude: number }) {
  const home = new google.maps.LatLng(data.latitude, data.longitude);
  const mapOptions: google.maps.MapOptions = {
    zoom: 2,
    center: home,
    mapTypeId: google.maps.MapTypeId.HYBRID,
  };
  map = new google.maps.Map(document.getElementById('map-canvas')!, mapOptions);
  const marker = new google.maps.Marker({
    position: home,
    map: map,
    title: 'Your Location',
    icon: '../images/icon_blue.png',
  });
}

// TODO: may need cache the result
function geoLocate(data: { hostname: string }) {
  // First, resolve the hostname to an IP address using DNS API
  fetch(dnsURL + data.hostname + '&type=A')
    .then(response => response.json())
    .then(dnsData => {
      if (!dnsData.Answer || dnsData.Answer.length === 0) {
        throw new Error('No DNS answers found for hostname');
      }

      // Iterate through the Answer array to find the first valid IP address
      let ipAddress = null;
      for (const answer of dnsData.Answer) {
        if (answer.data && validateIpAddress(answer.data)) {  // Assuming validateIpAddress checks if it's a valid IP
          ipAddress = answer.data;
          break; // Exit loop once a valid IP is found
        }
      }

      if (!ipAddress) {
        throw new Error('Failed to resolve hostname to valid IP');
      }

      // Now use the resolved IP address in geoipURL
      return fetch(geoipURL + ipAddress);
    })
    .then(response => response.json())
    .then(info => {
      info.hostname = data.hostname; // Attach hostname for reference
      updateMap(info);
    })
    .catch(error => console.error('Error in geoLocate:', error));
}

// Assuming a simple IP address validation function
function validateIpAddress(ip : string) {
  const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipPattern.test(ip);
}


function updateMap(data: { latitude: number; longitude: number; hostname: string; ip: string }) {
  if (map) {
    const location = new google.maps.LatLng(data.latitude, data.longitude);
    const marker = new google.maps.Marker({
      position: location,
      map: map,
      animation: google.maps.Animation.DROP,
      title: data.hostname + ' / ' + data.ip,
    });
    overlays.push(marker);
    const chromeCounter = document.getElementById('chrome_counter')!;
    chromeCounter.innerHTML = 'server requests: ' + ++assetCount + ' / clear';
  }
}

window.addEventListener('load', function () {
  const chromeCounter = document.createElement('div');
  chromeCounter.id = 'chrome_counter';
  chromeCounter.className = 'chrome_counter_right';
  chromeCounter.innerHTML = 'server requests: ' + assetCount + ' / clear';
  document.body.appendChild(chromeCounter);

  chromeCounter.addEventListener('click', function () {
    // remove all markers
    while (overlays.length > 0) {
      overlays.pop()!.setMap(null);
    }
    const chromeCounter = document.getElementById('chrome_counter')!;
    chromeCounter.innerHTML = 'server requests: ' + (assetCount = 0) + ' / clear';
  });

  getHomeIP();
});

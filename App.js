// Initialize the Cesium viewer
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: Cesium.Terrain.fromWorldTerrain({
    requestWaterMask: true,
    requestVertexNormals: true,
  }),
});

// Set lighting to true
viewer.scene.globe.enableLighting = true;

// Adjust time so scene is lit by sun
viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2023-01-01T00:00:00");

// Setup alternative terrain providers
const ellipsoidProvider = new Cesium.EllipsoidTerrainProvider();

// Function to look at Mount Everest
function lookAtMtEverest() {
  const target = new Cesium.Cartesian3(
    300770.50872389384,
    5634912.131394585,
    2978152.2865545116,
  );
  const offset = new Cesium.Cartesian3(
    6344.974098678562,
    -793.3419798081741,
    2499.9508860763162,
  );
  viewer.camera.lookAt(target, offset);
  viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
}

// Function to look at different locations
function lookAtLocation(longitude, latitude, height = 10000) {
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-45),
      roll: 0.0,
    },
  });
}

// Add event handlers for terrain and imagery changes
viewer.terrainProvider = viewer.terrainProvider;

// Listen for terrain provider changes
viewer.scene.terrainProviderChanged.addEventListener(function() {
  console.log('Terrain provider changed');
});

// Listen for imagery provider changes
viewer.scene.imageryLayers.layerAdded.addEventListener(function(layer) {
  console.log('Imagery layer added:', layer);
});

viewer.scene.imageryLayers.layerRemoved.addEventListener(function(layer) {
  console.log('Imagery layer removed:', layer);
});

// Add some sample locations for navigation
const locations = {
  everest: { longitude: 86.925145, latitude: 27.988257, name: "Mount Everest" },
  grandCanyon: { longitude: -112.113, latitude: 36.055, name: "Grand Canyon" },
  tokyo: { longitude: 139.6917, latitude: 35.6895, name: "Tokyo" },
  paris: { longitude: 2.3522, latitude: 48.8566, name: "Paris" },
  nyc: { longitude: -74.006, latitude: 40.7128, name: "New York City" }
};

// Create navigation buttons
const toolbar = document.getElementById('toolbar');
if (toolbar) {
  const locationSelect = document.createElement('select');
  locationSelect.style.margin = '10px';
  locationSelect.style.padding = '5px';
  locationSelect.innerHTML = `
    <option value="">Select Location</option>
    <option value="everest">Mount Everest</option>
    <option value="grandCanyon">Grand Canyon</option>
    <option value="tokyo">Tokyo</option>
    <option value="paris">Paris</option>
    <option value="nyc">New York City</option>
  `;
  
  locationSelect.addEventListener('change', function() {
    const selectedLocation = this.value;
    if (selectedLocation && locations[selectedLocation]) {
      const loc = locations[selectedLocation];
      lookAtLocation(loc.longitude, loc.latitude);
      console.log(`Navigated to ${loc.name}`);
    }
  });
  
  toolbar.appendChild(locationSelect);
}

// Look at Mount Everest by default
lookAtMtEverest();

// Hide loading overlay once everything is loaded
document.getElementById('loadingOverlay').style.display = 'none';

// Add click handler for terrain/imagery selections
viewer.cesiumWidget.screenSpaceEventHandler.setInputAction(function onLeftClick(event) {
  const pickedObject = viewer.scene.pick(event.position);
  if (Cesium.defined(pickedObject)) {
    console.log('Clicked on:', pickedObject);
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

console.log('Cesium viewer initialized successfully!');
console.log('Use the dropdown to navigate to different locations');
console.log('Use the panels on the right to change imagery and terrain');

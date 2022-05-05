// Source data GeoJSON
const DATA_URL =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/geojson/vancouver-blocks.json'; 

/*const COLOR_SCALE = deck.scaleThreshold()
  .domain([-0.6, -0.45, -0.3, -0.15, 0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1.05, 1.2])
  .range([
    [65, 182, 196],
    [127, 205, 187],
    [199, 233, 180],
    [237, 248, 177],
    // zero
    [255, 255, 204],
    [255, 237, 160],
    [254, 217, 118],
    [254, 178, 76],
    [253, 141, 60],
    [252, 78, 42],
    [227, 26, 28],
    [189, 0, 38],
    [128, 0, 38]
  ]);*/

const INITIAL_VIEW_STATE = {
  latitude: 49.254,
  longitude: -123.13,
  zoom: 11,
  maxZoom: 16,
  pitch: 45,
  bearing: 0
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json';

/*const ambientLight = new deck.AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const dirLight = new deck.SunLight({
  timestamp: Date.UTC(2019, 7, 1, 22),
  color: [255, 255, 255],
  intensity: 1.0,
  _shadow: true
});*/

const landCover = [[[-123.0, 49.196], [-123.0, 49.324], [-123.306, 49.324], [-123.306, 49.196]]];

/*function getTooltip({object}) {
  return (
    object && {
      html: `\
  <div><b>Average Property Value</b></div>
  <div>${object.properties.valuePerParcel} / parcel</div>
  <div>${object.properties.valuePerSqm} / m<sup>2</sup></div>
  <div><b>Growth</b></div>
  <div>${Math.round(object.properties.growth * 100)}%</div>
  `
    }
  );
}*/


const ambientLight = new deck.AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight = new deck.PointLight({
  color: [255, 255, 255],
  intensity: 2.0,
  position: [-74.05, 40.7, 8000]
});

const lightingEffect = new deck.LightingEffect({ ambientLight, pointLight });

const material = {
  ambient: 0.1,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [60, 64, 70]
};

const theme = {
  buildingColor: [74, 80, 87],
  trailColor0: [253, 128, 93],
  trailColor1: [23, 184, 190],
  material,
  effects: [lightingEffect]
};

const layers = [
  // only needed when using shadows - a plane for shadows to drop on
  new deck.PolygonLayer({
    id: 'ground',
    data: landCover,
    stroked: false,
    getPolygon: f => f,
    getFillColor: [0, 0, 0, 0]
  }),
  new deck.GeoJsonLayer({
    id: 'geojson',
    DATA_URL,
    opacity: 0.8,
    stroked: false,
    filled: true,
    extruded: true,
    wireframe: true,
    getElevation: f => Math.sqrt(f.properties.valuePerSqm) * 10,
    getFillColor: f => COLOR_SCALE(f.properties.growth),
    getLineColor: [255, 255, 255],
    pickable: true
  })
];

// Create Deck.GL map
const deckgl = new deck.DeckGL({
  container: 'map',
  mapStyle: 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json',
  initialViewState: {
    longitude: -74,
    latitude: 40.73,
    zoom: 12,
    pitch: 45,
    bearing: 0
  },
  controller: true,
  layers: layers,
  effects: theme.effects
});

/*function Farm_dashboard({data = DATA_URL, mapStyle = MAP_STYLE}) {
  const [effects] = useState(() => {
    const lightingEffect = new LightingEffect({ambientLight, dirLight});
    lightingEffect.shadowColor = [0, 0, 0, 0.5];
    return [lightingEffect];
  });

  const layers = [
    // only needed when using shadows - a plane for shadows to drop on
    new PolygonLayer({
      id: 'ground',
      data: landCover,
      stroked: false,
      getPolygon: f => f,
      getFillColor: [0, 0, 0, 0]
    }),
    new GeoJsonLayer({
      id: 'geojson',
      data,
      opacity: 0.8,
      stroked: false,
      filled: true,
      extruded: true,
      wireframe: true,
      getElevation: f => Math.sqrt(f.properties.valuePerSqm) * 10,
      getFillColor: f => COLOR_SCALE(f.properties.growth),
      getLineColor: [255, 255, 255],
      pickable: true
    })
  ];

  return (
    <DeckGL
      layers={layers}
      effects={effects}
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      getTooltip={getTooltip}
    >
      <StaticMap reuseMaps mapStyle={mapStyle} preventStyleDiffing={true} />
    </DeckGL>
  );
}

function renderToDOM(container) {
  render(<Farm_dashboard />, container);
}*/
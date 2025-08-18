import { showEvent } from './ui.js';

let map = null;

export function initializeMap(gameState) {
    if (gameState.mapInitialized) return;

    mapboxgl.accessToken = 'pk.eyJ1Ijoid2VzdGlua3JvcGYiLCJhIjoiY21laGt2bzZrMDlwaTJqb2pxY3g4a2s0YiJ9.iYlZ5W7jH9CzXM3neA3G3A';
    
    const bounds = [
        [-77.885, 40.785], // Southwest coordinates
        [-77.845, 40.815]  // Northeast coordinates
    ];

    map = new mapboxgl.Map({
        container: 'map-container',
        style: 'mapbox://styles/mapbox/streets-v12', 
        center: [-77.863, 40.800],
        zoom: 15.8,
        pitch: 60, 
        bearing: -35,
        maxBounds: bounds 
    });

    map.on('load', () => {
        // --- HIDE ALL DEFAULT LABELS ---
        const layers = map.getStyle().layers;
        for (const layer of layers) {
            if (layer.type === 'symbol' && layer.layout) {
                map.setLayoutProperty(layer.id, 'visibility', 'none');
            }
        }

        // --- VISUAL MASK FOR CAMPUS ---
        const campusMask = {
            'type': 'Feature',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [
                    [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]],
                    [
                        [bounds[0][0], bounds[0][1]], [bounds[1][0], bounds[0][1]], 
                        [bounds[1][0], bounds[1][1]], [bounds[0][0], bounds[1][1]], 
                        [bounds[0][0], bounds[0][1]]
                    ]
                ]
            }
        };
        map.addSource('campus-mask', { 'type': 'geojson', 'data': campusMask });
        map.addLayer({
            'id': 'campus-mask-layer', 'type': 'fill', 'source': 'campus-mask', 'layout': {},
            'paint': { 'fill-color': '#1a1d21', 'fill-opacity': 0.85 }
        });

        // --- COLORED 3D BUILDINGS ---
        map.addLayer({
            'id': '3d-buildings', 'source': 'composite', 'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'], 'type': 'fill-extrusion', 'minzoom': 15,
            'paint': {
                'fill-extrusion-color': '#c4b39d',
                'fill-extrusion-height': ['get', 'height'],
                'fill-extrusion-base': ['get', 'min_height'],
                'fill-extrusion-opacity': 0.9
            }
        });

        // --- NEW CUSTOM HTML MARKER FOR PEGULA ICE ARENA ---
        
        // 1. Create a custom HTML element for the label
        const arenaLabel = document.createElement('div');
        arenaLabel.className = 'map-label';
        arenaLabel.innerHTML = '<span><i class="fa-solid fa-hockey-puck"></i> Pegula Ice Arena</span>';

        // 2. Create the Mapbox marker using the custom element
        const arenaMarker = new mapboxgl.Marker(arenaLabel)
            .setLngLat([-77.8704, 40.8038]) // The precise coordinates you provided
            .addTo(map);

        // 3. Add a click event listener to the custom HTML element
        arenaLabel.addEventListener('click', () => {
            showEvent('event_extra_practice');
        });
    });

    gameState.mapInitialized = true;
}
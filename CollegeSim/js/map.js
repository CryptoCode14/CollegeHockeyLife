import { showEvent } from './ui/index.js';

let map = null;

// GeoJSON source for all interactive locations on the map
const locationsSource = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-77.8704, 40.8038] },
            properties: {
                name: 'Pegula Ice Arena',
                event: 'event_extra_practice',
                icon: 'hockey-puck',
                description: 'Home of Penn State Hockey'
            }
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-77.8692, 40.7981] },
            properties: {
                name: 'Pattee Library',
                event: 'event_library_study',
                icon: 'book',
                description: 'Main campus library'
            }
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-77.8675, 40.8010] },
            properties: {
                name: 'East Halls',
                event: 'event_dorm_room',
                icon: 'bed',
                description: 'Freshman dormitories'
            }
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-77.8660, 40.7990] },
            properties: {
                name: 'Business Building',
                event: 'event_class_econ',
                icon: 'landmark',
                description: 'Home of the Business School'
            }
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-77.8630, 40.7970] },
            properties: {
                name: 'HUB-Robeson Center',
                event: 'event_student_center',
                icon: 'utensils',
                description: 'Student center and dining'
            }
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-77.8710, 40.8000] },
            properties: {
                name: 'Recreation Center',
                event: 'event_gym_workout',
                icon: 'dumbbell',
                description: 'Campus fitness center'
            }
        }
    ]
};

// Initialize the map with interactive locations
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
        center: [-77.865, 40.800],
        zoom: 15.5,
        pitch: 60, 
        bearing: -35,
        maxBounds: bounds 
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('load', () => {
        // --- HIDE ALL DEFAULT LABELS ---
        map.getStyle().layers.forEach(layer => {
            if (layer.type === 'symbol' && layer.layout) {
                map.setLayoutProperty(layer.id, 'visibility', 'none');
            }
        });
        
        // Add campus mask to darken areas outside the campus
        const campusMask = { 
            'type': 'Feature', 
            'geometry': { 
                'type': 'Polygon', 
                'coordinates': [
                    [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]], 
                    [[bounds[0][0], bounds[0][1]], [bounds[1][0], bounds[0][1]], [bounds[1][0], bounds[1][1]], [bounds[0][0], bounds[1][1]], [bounds[0][0], bounds[0][1]]]
                ] 
            } 
        };
        
        map.addSource('campus-mask', { 'type': 'geojson', 'data': campusMask });
        
        map.addLayer({ 
            'id': 'campus-mask-layer', 
            'type': 'fill', 
            'source': 'campus-mask', 
            'layout': {}, 
            'paint': { 
                'fill-color': '#1a1d21', 
                'fill-opacity': 0.85 
            } 
        });
        
        // Add 3D buildings
        map.addLayer({ 
            'id': '3d-buildings', 
            'source': 'composite', 
            'source-layer': 'building', 
            'filter': ['==', 'extrude', 'true'], 
            'type': 'fill-extrusion', 
            'minzoom': 15, 
            'paint': { 
                'fill-extrusion-color': '#c4b39d', 
                'fill-extrusion-height': ['get', 'height'], 
                'fill-extrusion-base': ['get', 'min_height'], 
                'fill-extrusion-opacity': 0.9 
            } 
        });

        // Add game locations to the map
        map.addSource('game-locations', {
            type: 'geojson',
            data: locationsSource
        });

        // Add location markers
        map.addLayer({
            id: 'location-markers',
            type: 'circle',
            source: 'game-locations',
            paint: {
                'circle-radius': 8,
                'circle-color': '#00aaff', /* Same as --highlight-blue */
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'
            }
        });

        // Add location labels
        map.addLayer({
            id: 'location-labels',
            type: 'symbol',
            source: 'game-locations',
            layout: {
                'text-field': ['get', 'name'],
                'text-font': ['Poppins SemiBold', 'Arial Unicode MS Bold'],
                'text-size': 14,
                'text-anchor': 'top',
                'text-offset': [0, 1],
                'text-allow-overlap': false,
                'text-padding': 20,
            },
            paint: {
                'text-color': '#ffffff',
                'text-halo-color': '#1a1d21',
                'text-halo-width': 2,
                'text-halo-blur': 1,
            }
        });

        // Set up click events for locations
        map.on('click', 'location-markers', (e) => {
            const properties = e.features[0].properties;
            const coordinates = e.features[0].geometry.coordinates.slice();
            
            // Create popup content
            const popupContent = `
                <div class="map-popup">
                    <h3>${properties.name}</h3>
                    <p>${properties.description}</p>
                    <button class="map-popup-button" data-event="${properties.event}">Visit</button>
                </div>
            `;
            
            // Create and display popup
            const popup = new mapboxgl.Popup({
                closeButton: true,
                closeOnClick: false,
                className: 'game-map-popup'
            })
            .setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(map);
            
            // Add event listener to the Visit button
            popup.getElement().querySelector('.map-popup-button').addEventListener('click', () => {
                if (properties.event) {
                    showEvent(properties.event);
                    popup.remove();
                }
            });
        });

        // Change cursor on hover
        map.on('mouseenter', 'location-markers', () => { 
            map.getCanvas().style.cursor = 'pointer'; 
        });
        
        map.on('mouseleave', 'location-markers', () => { 
            map.getCanvas().style.cursor = ''; 
        });
        
        // Add player marker
        addPlayerMarker(gameState);

        // New: Day/night cycle
        setInterval(() => {
            const hour = gameState.gameDate.getHours();
            const opacity = (hour > 18 || hour < 6) ? 0.95 : 0.85;
            map.setPaintProperty('campus-mask-layer', 'fill-opacity', opacity);
        }, 1000);
    });

    gameState.mapInitialized = true;
}

// Add a marker for the player's current position
function addPlayerMarker(gameState) {
    if (!map) return;
    
    // Default player position (East Halls)
    const playerPosition = [-77.8675, 40.8010];
    
    // Create a DOM element for the marker
    const el = document.createElement('div');
    el.className = 'player-marker';
    el.innerHTML = '<i class="fa-solid fa-user"></i>';
    
    // Add marker to map
    const marker = new mapboxgl.Marker(el)
        .setLngLat(playerPosition)
        .addTo(map);
    
    // Store marker reference in gameState for future updates
    gameState.playerMarker = marker;
}

// Update player position on the map
export function updatePlayerPosition(coordinates) {
    if (!map || !gameState.playerMarker) return;
    
    // Animate movement to new position
    gameState.playerMarker.setLngLat(coordinates);
    
    // Optional: Pan map to follow player
    map.panTo(coordinates, { duration: 1000 });

    // New: Random encounter en route
    if (Math.random() < 0.2) {
        showEvent('event_random_encounter'); // e.g., bump into prof
    }
}
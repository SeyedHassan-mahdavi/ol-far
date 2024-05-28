// 'use client';
// import React, { createContext, useEffect, useState } from 'react';
// import 'ol/ol.css';
// import Map from 'ol/Map';
// import View from 'ol/View';
// import TileLayer from 'ol/layer/Tile';
// import { Projection, fromLonLat } from 'ol/proj';

// import {
//     Attribution,
//     FullScreen,
//     Rotate,
//     ScaleLine,
//     defaults,
// } from 'ol/control';
// import { OSM, TileWMS } from 'ol/source';


// export const MapBoxContext = createContext(null)

// const MapBox = ({ children }) => {
//     const [theMap, setTheMap] = useState(null);

//     useEffect(() => {
//         const map = new Map({
//             target: 'map',
//             layers: [
//                 new TileLayer({
//                     source: new OSM(),
//                 }),
//                 // new TileLayer({
//                 //     source: new TileWMS({
//                 //         url: "http://10.10.1.20:8080/geoserver/wms",
//                 //         params: {
//                 //             layers: "ne:world",
//                 //             TILED: true,
//                 //         },
//                 //         projection: "EPSG:4326",
//                 //     }),
//                 // }),
//                 // new TileLayer({
//                 //     source: new TileWMS({
//                 //         url: 'http://10.10.1.20:8080/geoserver/wms',
//                 //         params: { 'LAYERS': 'world:world_map', 'TILED': true },
//                 //         serverType: 'geoserver',
//                 //     }),
//                 // }),
//             ],
//             view: new View({
//                 center: [51, 32],
//                 projection: "EPSG:4326",
//                 zoom: 6,
//             }),
//             controls: defaults({ attribution: false }).extend([
//                 new Attribution({
//                     collapsed: true,
//                     collapsible: true,
//                 }),
//                 new FullScreen(),
//                 new ScaleLine(),
//                 new Rotate(),
//             ]),
//         });


//         setTheMap(map);

//         return () => {
//             map.setTarget(null);
//         };
//     }, []);




//     return (
//         <MapBoxContext.Provider value={theMap}>

//             {/* <LayerSwitcher /> */}

//             {/* 1 */}
//             <div id="map" style={{ width: '100%', height: '100vh' }} />
//             {children}
//             {/* 1 */}

//             {/* 2 */}
//             {/* <div id="map" style={{ width: '100%', height: '100vh' }}>
//             {children}
//             </div> */}
//             {/* 2 */}

//         </MapBoxContext.Provider>
//     )
// };

// export default MapBox;


// // "use client"
// // import React, { useEffect, useRef, useState } from 'react';
// // import Map from 'ol/Map';
// // import View from 'ol/View';
// // import TileLayer from 'ol/layer/Tile';
// // import OSM from 'ol/source/OSM';
// // import { fromLonLat } from 'ol/proj';
// // import Feature from 'ol/Feature';
// // import Point from 'ol/geom/Point';
// // import { Vector as VectorLayer } from 'ol/layer';
// // import { Vector as VectorSource } from 'ol/source';
// // import { Style, Icon } from 'ol/style';

// // const MapBox = () => {
// //   const mapRef = useRef(null);
// //   const [map, setMap] = useState(null);

// //   useEffect(() => {
// //     const mapObject = new Map({
// //       target: mapRef.current,
// //       layers: [
// //         new TileLayer({
// //           source: new OSM(),
// //         }),
// //       ],
// //       view: new View({
// //         center: fromLonLat([0, 0]), // Set the initial center coordinates
// //         zoom: 2, // Set the initial zoom level
// //       }),
// //     });

// //     setMap(mapObject);

// //     return () => {
// //       mapObject.dispose(); // Clean up when component unmounts
// //     };
// //   }, []);

// //   // Function to add a single marker to the map
// //   const addMarker = (coordinates, iconUrl) => {
// //     if (map) {
// //       const iconStyle = new Style({
// //         image: new Icon({
// //           src: iconUrl,
// //         }),
// //       });

// //       const marker = new Feature({
// //         geometry: new Point(fromLonLat(coordinates)),
// //       });

// //       marker.setStyle(iconStyle);

// //       const vectorSource = new VectorSource({
// //         features: [marker],
// //       });

// //       const vectorLayer = new VectorLayer({
// //         source: vectorSource,
// //       });

// //       map.addLayer(vectorLayer);
// //     }
// //   };

// //   // Example usage of adding a marker
// //   useEffect(() => {
// //     if (map) {
// //       const markerCoordinates = [52.45, 29.65];
// //       const iconUrl = 'https://map.ir/css/images/marker-default-red.svg'; // Replace 'icon-url' with the actual URL of your icon
// //       addMarker(markerCoordinates, iconUrl);
// //     }
// //   }, [map]);

// //   return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
// // };

// // export default MapBox;





'use client';
import React, { createContext, useEffect, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { Projection, fromLonLat } from 'ol/proj';
import { Extent, boundingExtent } from 'ol/extent';

import {
    Attribution,
    FullScreen,
    Rotate,
    ScaleLine,
    defaults,
} from 'ol/control';
import { OSM, TileWMS } from 'ol/source';

export const MapBoxContext = createContext(null);

const MapBox = ({ children, fitBounds }) => {
    const [theMap, setTheMap] = useState(null);

    useEffect(() => {
        const map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: [51, 32], // Initial center
                projection: 'EPSG:4326', // Using the default Web Mercator projection
                zoom: 6,
            }),
            controls: defaults({ attribution: false }).extend([
                new Attribution({
                    collapsed: true,
                    collapsible: true,
                }),
                new FullScreen(),
                new ScaleLine(),
                new Rotate(),
            ]),
        });

        setTheMap(map);

        if (fitBounds && fitBounds.length === 2) {
            const [min, max] = fitBounds;
            const extent = boundingExtent([
                fromLonLat([min.lng, min.lat]),
                fromLonLat([max.lng, max.lat]),
            ]);
            map.getView().fit(extent, { duration: 1000 });
        }

        return () => {
            map.setTarget(null);
        };
    }, [fitBounds]);

    return (
        <MapBoxContext.Provider value={theMap}>
            <div id="map" style={{ width: '100%', height: '100vh' }} />
            {children}
        </MapBoxContext.Provider>
    );
};

export default MapBox;

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


"use client"
import React, { createContext, useEffect, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorTileLayer from 'ol/layer/VectorTile';
import { fromLonLat, toLonLat } from 'ol/proj';
import { boundingExtent } from 'ol/extent';
import { VectorTile as VectorTileSource } from 'ol/source';
import MVT from 'ol/format/MVT';

import {
    Attribution,
    FullScreen,
    Rotate,
    ScaleLine,
    ZoomSlider,
    defaults as defaultControls,
} from 'ol/control';
import { OSM } from 'ol/source';
import { defaults as defaultInteractions, MouseWheelZoom, DragRotate, PinchZoom, DoubleClickZoom, KeyboardPan, KeyboardZoom } from 'ol/interaction';

export const MapBoxContext = createContext(null);

const mapEvents = {
  onStyleLoad: 'styleload',
  onResize: 'resize',
  onDblClick: 'dblclick',
  onClick: 'click',
  onMouseMove: 'mousemove',
  onMouseOut: 'mouseout',
  onMoveStart: 'movestart',
  onMove: 'move',
  onMoveEnd: 'moveend',
  onMouseUp: 'mouseup',
  onMouseDown: 'mousedown',
  onDragStart: 'dragstart',
  onDrag: 'drag',
  onDragEnd: 'dragend',
  onZoomStart: 'zoomstart',
  onZoom: 'zoom',
  onZoomEnd: 'zoomend',
  onPitch: 'pitch',
  onPitchStart: 'pitchstart',
  onPitchEnd: 'pitchend',
  onWebGlContextLost: 'webglcontextlost',
  onWebGlContextRestored: 'webglcontextrestored',
  onRemove: 'remove',
  onContextMenu: 'contextmenu',
  onRender: 'render',
  onError: 'error',
  onSourceData: 'sourcedata',
  onDataLoading: 'dataloading',
  onStyleDataLoading: 'styledataloading',
  onStyleImageMissing: 'styleimagemissing',
  onTouchCancel: 'touchcancel',
  onData: 'data',
  onSourceDataLoading: 'sourcedataloading',
  onTouchMove: 'touchmove',
  onTouchEnd: 'touchend',
  onTouchStart: 'touchstart',
  onStyleData: 'styledata',
  onBoxZoomStart: 'boxzoomstart',
  onBoxZoomEnd: 'boxzoomend',
  onBoxZoomCancel: 'boxzoomcancel',
  onRotateStart: 'rotatestart',
  onRotate: 'rotate',
  onRotateEnd: 'rotateend'
};

const MapBox = ({ children, fitBounds, center, mapParams, userLocation, setUserCoords, ...events }) => {
    const [theMap, setTheMap] = useState(null);

    useEffect(() => {
        const layers = [
            new TileLayer({
                source: new OSM(),
            })
        ];

        // اضافه کردن لایه برداری در صورت وجود apiUrl در mapParams
        if (mapParams && mapParams.apiUrl) {
            layers.push(
                new VectorTileLayer({
                    source: new VectorTileSource({
                        format: new MVT(),
                        url: mapParams.apiUrl,
                        projection: 'EPSG:3857'
                    }),
                })
            );
        }

        // تنظیم تعاملات نقشه
        let interactions = defaultInteractions({
            mouseWheelZoom: mapParams?.scrollZoom ?? true,
        });

        interactions = interactions.getArray();

        if (mapParams?.scrollZoom === false) {
            // غیرفعال کردن زوم با چرخ ماوس
            interactions = interactions.filter(interaction => !(interaction instanceof MouseWheelZoom));
        }

        if (mapParams?.interactive === false) {
            // غیرفعال کردن تمامی تعاملات
            interactions = [];
        } else {
            // اضافه کردن تعاملات چرخش و زوم با لمس
            if (mapParams?.touchZoomRotate !== false) {
                interactions.push(new DragRotate());
                interactions.push(new PinchZoom());
            }

            // حذف تعامل دو کلیک برای زوم اگر false باشد
            if (mapParams?.doubleClickZoom === false) {
                interactions = interactions.filter(interaction => !(interaction instanceof DoubleClickZoom));
            }

            // اضافه کردن تعاملات صفحه کلید اگر فعال است
            if (mapParams?.keyboard !== false) {
                interactions.push(new KeyboardPan());
                interactions.push(new KeyboardZoom());
            }
        }

        const controls = defaultControls({ attribution: true, zoom: false }).extend([
            new Attribution({
                collapsed: true,
                collapsible: true,
                html: mapParams?.customAttribution, // اضافه کردن customAttribution
            }),
            new FullScreen(),
            new ScaleLine(),
            new Rotate(),
        ]);

        if (mapParams?.zoomSlider !== false) {
            controls.push(new ZoomSlider());
        }

        // تنظیم مقدار اولیه از URL اگر hash فعال است
        let initialCenter = center ? fromLonLat(center, 'EPSG:3857') : fromLonLat([51, 32], 'EPSG:3857');
        let initialZoom = 5;

        if (mapParams?.hash && typeof window !== 'undefined') {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const lon = parseFloat(hashParams.get('lon'));
            const lat = parseFloat(hashParams.get('lat'));
            const zoom = parseFloat(hashParams.get('zoom'));

            if (!isNaN(lon) && !isNaN(lat)) {
                initialCenter = fromLonLat([lon, lat], 'EPSG:3857');
            }
            if (!isNaN(zoom)) {
                initialZoom = zoom;
            }
        }

        const map = new Map({
            target: 'map',
            layers: layers,
            view: new View({
                center: initialCenter,
                projection: 'EPSG:3857',
                zoom: initialZoom,
                maxZoom: mapParams?.maxZoom ?? 20,
                minZoom: mapParams?.minZoom ?? 0,
                multiWorld: mapParams?.multiWorld ?? false, // اضافه کردن multiWorld
            }),
            controls: controls,
            interactions: interactions,
            preserveDrawingBuffer: mapParams?.preserveDrawingBuffer ?? false, // اضافه کردن preserveDrawingBuffer
        });

        // اضافه کردن eventها
        Object.entries(mapEvents).forEach(([eventName, event]) => {
            if (typeof events[eventName] === 'function') {
                map.on(event, (e) => {
                    const coords = toLonLat(e.coordinate);
                    events[eventName](e, coords);
                });
            }
        });

        if (mapParams?.hash && typeof window !== 'undefined') {
            const updateHash = () => {
                const view = map.getView();
                const center = toLonLat(view.getCenter(), 'EPSG:3857');
                const zoom = view.getZoom();
                const hash = `#lon=${center[0]}&lat=${center[1]}&zoom=${zoom}`;
                window.history.replaceState(null, null, hash);
            };

            map.on('moveend', updateHash);
        }

        setTheMap(map);

        // یافتن موقعیت کاربر و تنظیم مرکز نقشه
        if (userLocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userCoords = [position.coords.longitude, position.coords.latitude];
                    console.log('User coordinates:', userCoords); // Debugging output
                    const userCoordsProj = fromLonLat(userCoords, 'EPSG:3857');
                    map.getView().setCenter(userCoordsProj);
                    map.getView().setZoom(8); // تنظیم زوم به مقدار دلخواه
                    setUserCoords(userCoords); // تنظیم مختصات کاربر
                },
                (error) => {
                    if (error.code === error.PERMISSION_DENIED) {
                        alert("دسترسی به موقعیت مکانی شما غیرفعال است. لطفا GPS دستگاه خود را فعال کنید.");
                    } else {
                        console.error("Error getting user location:", error);
                    }
                },
                {
                    enableHighAccuracy: true
                }
            );
        }

        if (fitBounds && fitBounds.length === 2) {
            const [min, max] = fitBounds;
            const extent = boundingExtent([
                fromLonLat([min.lng, min.lat], 'EPSG:3857'),
                fromLonLat([max.lng, max.lat], 'EPSG:3857'),
            ]);
            map.getView().fit(extent, { duration: 1000 });
        }

        return () => {
            map.setTarget(null);
        };
    }, [fitBounds, mapParams, center, userLocation, setUserCoords]);

    useEffect(() => {
        if (theMap) {
            // اضافه کردن eventها
            Object.entries(mapEvents).forEach(([eventName, event]) => {
                if (typeof events[eventName] === 'function') {
                    theMap.on(event, (e) => {
                        const coords = toLonLat(e.coordinate);
                        events[eventName](e, coords);
                    });
                }
            });
        }
    }, [theMap, events]);

    return (
        <MapBoxContext.Provider value={theMap}>
            <div id="map" style={{ width: '100%', height: '100vh' }} />
            {children}
        </MapBoxContext.Provider>
    );
};

export default MapBox;


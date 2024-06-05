// "use client"

// import { useEffect, useState } from 'react';
// import 'ol/ol.css';
// import TileLayer from 'ol/layer/Tile';
// import TileWMS from 'ol/source/TileWMS';
// import { useMap } from './hooks/useMap';
// import Image from 'next/image';
// import VectorLayer from 'ol/layer/Vector';
// import VectorSource from 'ol/source/Vector';
// import { Stroke, Style, Fill } from 'ol/style';
// import GeoJSON from 'ol/format/GeoJSON';
// import geojsonData from '../file.json'; // Import your GeoJSON file



// const LayerSwitcher = () => {
//     const [wmsLayers, setWmsLayers] = useState([]);
//     const [layerSwitcherIsOpen, setLayerSwitcherIsOpen] = useState(false);
//     const map = useMap();

//     useEffect(() => {
//         if (map) {
//             const wmsLayers = [
//                 new TileLayer({
//                     name: 'OSTAN',
//                     source: new TileWMS({
//                         url: 'http://10.10.1.20:8080/geoserver/wms',
//                         params: { 'LAYERS': 'mmap:Ostan', 'TILED': true },
//                         serverType: 'geoserver',
//                     }),
//                 }),
//                 new TileLayer({
//                     name: 'JAHAN',
//                     source: new TileWMS({
//                         url: 'http://10.10.1.20:8080/geoserver/wms',
//                         params: { 'LAYERS': 'ne:world', 'TILED': true },
//                         serverType: 'geoserver',
//                     }),
//                 }),
//                 new TileLayer({
//                     name: 'sea',
//                     source: new TileWMS({
//                         url: 'http://10.10.1.20:8080/geoserver/wms',
//                         params: { 'LAYERS': 'world:sea', 'TILED': true },
//                         serverType: 'geoserver',
//                     }),
//                 }),
//             ];

//             setWmsLayers(wmsLayers);

//             wmsLayers.forEach(layer => {
//                 map.addLayer(layer);
//             });

//             return () => {
//                 wmsLayers.forEach(layer => {
//                     map.removeLayer(layer);
//                 });
//             };
//         }
//     }, [map]);

//     useEffect(() => {
//         if (map) {

//             // Fetch GeoJSON from API or file

//             // fetch('your_geojson_api_or_file_url')
//             // .then(response => response.json())
//             // .then(data => {
//             //     const vectorSourcePoly = new VectorSource({
//             //         features: new GeoJSON().readFeatures(data, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }),
//             //     });

//             const vectorSourcePoly = new VectorSource({
//                 features: new GeoJSON().readFeatures(geojsonData, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }),
//             });

//             const stylePoly = new Style({
//                 stroke: new Stroke({
//                     color: 'blue',
//                     width: 2,
//                 }),
//                 fill: new Fill({
//                     color: 'rgba(0, 0, 255, 0.1)',
//                 }),
//             });

//             const vectorLayer = new VectorLayer({
//                 style: stylePoly,
//                 source: vectorSourcePoly,
//             });

//             map.addLayer(vectorLayer); // Add vector layer to the map

//             return () => {
//                 map.removeLayer(vectorLayer); // Remove vector layer when component unmounts
//             };
//         }
//     }, [map]);


//     const toggleLayerSwitcher = () => {
//         setLayerSwitcherIsOpen(!layerSwitcherIsOpen);
//     };

//     return (

//         <div className="fixed top-20 left-3 z-10 layer-switcher">
//             <div className="w-7 h-7 layer-switcher__icon" onClick={toggleLayerSwitcher}>
//                 <Image priority={true} src="/layers.svg" width={700} height={700} alt="Layers" className="w-full h-full" />
//             </div>
//             {layerSwitcherIsOpen && (
//                 <div className="layer-switcher__content bg-white mt-3 p-3 w-52 rounded-md border-2 border-blue-700">
//                     {wmsLayers.map((lyr, index) => (
//                         <div key={lyr.get('name')} className="flex items-center">
//                             <input
//                                 type="checkbox"
//                                 id={lyr.get('name')}
//                                 defaultChecked={true}
//                                 onClick={(e) => {
//                                     const layer = map.getLayers().getArray().find(l => l.get('name') === lyr.get('name'));
//                                     layer.setVisible(e.target.checked);
//                                 }}
//                                 className="mr-2"
//                             />
//                             <label htmlFor={lyr.get('name')}>{lyr.get('name')}</label>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>

//     );
// };

// export default LayerSwitcher;





"use client"

import { useEffect, useState } from 'react';
import 'ol/ol.css';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import { useMap } from './hooks/useMap';
import Image from 'next/image';
// import GeoJSONLayer from './GeoJSONLayer'; // Import the new GeoJSONLayer component

const LayerSwitcher = () => {
    const [wmsLayers, setWmsLayers] = useState([]);
    const [layerSwitcherIsOpen, setLayerSwitcherIsOpen] = useState(false);
    const map = useMap();

    useEffect(() => {
        if (map) {
            const wmsLayers = [
                new TileLayer({
                    name: 'OSTAN',
                    source: new TileWMS({
                        url: 'http://10.10.1.20:8080/geoserver/wms',
                        params: { 'LAYERS': 'mmap:Ostan', 'TILED': true },
                        serverType: 'geoserver',
                    }),
                }),
                new TileLayer({
                    name: 'JAHAN',
                    source: new TileWMS({
                        url: 'http://172.16.11.21:8080/geoserver/wms',
                        params: { 'LAYERS': 'ne:world', 'TILED': true },
                        serverType: 'geoserver',
                    }),
                }),
                new TileLayer({
                    name: 'sea',
                    source: new TileWMS({
                        url: 'http://10.10.1.20:8080/geoserver/wms',
                        params: { 'LAYERS': 'world:sea', 'TILED': true },
                        serverType: 'geoserver',
                    }),
                }),
            ];

            setWmsLayers(wmsLayers);

            wmsLayers.forEach(layer => {
                map.addLayer(layer);
            });

            return () => {
                wmsLayers.forEach(layer => {
                    map.removeLayer(layer);
                });
            };
        }
    }, [map]);

    const toggleLayerSwitcher = () => {
        setLayerSwitcherIsOpen(!layerSwitcherIsOpen);
    };

    return (
        <div className="fixed top-20 left-3 z-10 layer-switcher">
            <div className="w-7 h-7 layer-switcher__icon" onClick={toggleLayerSwitcher}>
                <Image priority={true} src="/layers.svg" width={700} height={700} alt="Layers" className="w-full h-full" />
            </div>
            {layerSwitcherIsOpen && (
                <div className="layer-switcher__content bg-white mt-3 p-3 w-52 rounded-md border-2 border-blue-700">
                    {wmsLayers.map((lyr, index) => (
                        <div key={lyr.get('name')} className="flex items-center">
                            <input
                                type="checkbox"
                                id={lyr.get('name')}
                                defaultChecked={true}
                                onClick={(e) => {
                                    const layer = map.getLayers().getArray().find(l => l.get('name') === lyr.get('name'));
                                    layer.setVisible(e.target.checked);
                                }}
                                className="mr-2"
                            />
                            <label htmlFor={lyr.get('name')}>{lyr.get('name')}</label>
                        </div>
                    ))}
                </div>
            )}
            {/* <GeoJSONLayer /> Add GeoJSONLayer component here */}
        </div>
    );
};

export default LayerSwitcher;


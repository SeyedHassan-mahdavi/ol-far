// import Image from 'next/image';
// import { useState } from 'react';

// const LayerSwitcher = ({map}) => {
//     const [layerSwitcherIsOpen, setLayerSwitcherIsOpen] = useState(false);

//     const toggleLayerSwitcher = () => {
//         setLayerSwitcherIsOpen(!layerSwitcherIsOpen);
//     };

//     const wmsLayers = [
//         {
//             name: 'Iran Provinces',
//             url: 'http://10.10.1.20:8080/geoserver/wms',
//             params: { 'LAYERS': 'ne:world', 'TILED': true },
//         },
//         {
//             name: 'US State',
//             url: 'http://localhost:8080/geoserver/wms',
//             params: { 'LAYERS': 'topp:states', 'TILED': true },
//         }
//     ];

//     return (
//         <div className="fixed top-20 left-3 z-10 layer-switcher">
//             <div className="w-7 h-7 layer-switcher__icon" onClick={toggleLayerSwitcher}>
//                 <Image src="/layers.svg" width={700} height={700} alt="Layers" className="w-full h-full" />
//             </div>
//             {layerSwitcherIsOpen && (
//                 <div className="layer-switcher__content bg-white mt-3 p-3 w-52 rounded-md border-2 border-blue-700">
//                     {wmsLayers.map((lyr, index) => (
//                         <div key={index} className="flex items-center">
//                             <input
//                                 type="checkbox"
//                                 id={lyr.name}
//                                 defaultChecked={true}
//                                 onClick={(e) => {
//                                     const layer = map.getLayers().getArray().find((l) => l.get('name') === lyr.name);
//                                     layer.setVisible(e.target.checked);
//                                 }}
//                                 className="mr-2"
//                             />
//                             <label htmlFor={lyr.name}>{lyr.name}</label>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default LayerSwitcher;


import { useEffect, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';
import { fromLonLat } from 'ol/proj';

const LayerSwitcher = () => {
    const [map, setMap] = useState(null);
    const [wmsLayers, setWmsLayers] = useState([]);
    const [layerSwitcherIsOpen, setLayerSwitcherIsOpen] = useState(false);

    useEffect(() => {
        const mapInstance = new Map({
            target: null, // set to null to prevent auto creation of a div
            view: new View({
                center: fromLonLat([51, 32]),
                zoom: 6
            }),
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ]
        });

        setMap(mapInstance);

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
                    url: 'http://10.10.1.20:8080/geoserver/wms',
                    params: { 'LAYERS': 'ne:world', 'TILED': true },
                    serverType: 'geoserver',
                }),
            }),
        ];

        setWmsLayers(wmsLayers);

        wmsLayers.forEach(layer => {
            mapInstance.addLayer(layer);
        });

        return () => {
            mapInstance.setTarget(null);
        };
    }, []);

    const toggleLayerSwitcher = () => {
        setLayerSwitcherIsOpen(!layerSwitcherIsOpen);
    };

    return (
        <div>
            <button className="layer-switcher__icon" onClick={toggleLayerSwitcher}>
                Layer Switcher
            </button>
            {layerSwitcherIsOpen &&
                <div className="layer-switcher__content">
                    {wmsLayers.map(lyr => (
                        <div key={lyr.get('name')}>
                            <input
                                type="checkbox"
                                id={lyr.get('name')}
                                defaultChecked
                                onClick={(e) => {
                                    const layer = map.getLayers().getArray().find(l => l.get('name') === lyr.get('name'));
                                    layer.setVisible(e.target.checked);
                                }}
                            />
                            <label htmlFor={lyr.get('name')}>{lyr.get('name')}</label>
                            <br />
                        </div>
                    ))}
                </div>
            }
        </div>
    );
};

export default LayerSwitcher;


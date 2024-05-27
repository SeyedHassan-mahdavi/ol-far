'use client';
import React, { createContext, useEffect, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';

import {
    Attribution,
    FullScreen,
    Rotate,
    ScaleLine,
    ZoomSlider,
    defaults,
} from 'ol/control';
import { OSM, TileWMS } from 'ol/source';


export const MapBoxContext = createContext(null)

const MapBox = ({children}) => {
    const [theMap, setTheMap] = useState();

    useEffect(() => {
        const map = new Map({
            target: 'map',
            layers: [
                // new TileLayer({
                //     source: new OSM(),
                // }),
                // new TileLayer({
                //     source: new TileWMS({
                //         url: "http://10.10.1.20:8080/geoserver/wms",
                //         params: {
                //             layers: "ne:world",
                //             TILED: true,
                //         },
                //         projection: "EPSG:4326",
                //     }),
                // }),
                new TileLayer({
                    source: new TileWMS({
                        url: 'http://10.10.1.20:8080/geoserver/wms',
                        params: { 'LAYERS': 'mmap:wolrd_map', 'TILED': true },
                        serverType: 'geoserver',
                    }),
                }),
                // new TileLayer({
                //     source: new TileWMS({
                //         url: 'http://10.10.1.20:8080/geoserver/wms',
                //         params: { 'LAYERS': 'mmap:iranRoads', 'TILED': true },
                //         serverType: 'geoserver',
                //     }),
                // }),
            ],
            view: new View({
                center: fromLonLat([51, 32]),
                zoom: 5,
            }),
            controls: defaults({ attribution: true,zoom:false }).extend([
                new Attribution({
                    collapsed: true,
                    collapsible: true,
                }),
                new FullScreen(),
                new ScaleLine(),
                new Rotate(),
                new ZoomSlider()
            ]),
        });


        setTheMap(map);

        return () => {
            map.setTarget(null);
        };
    }, []);




    return (
        <MapBoxContext.Provider value={theMap}>

            {/* <LayerSwitcher /> */}

            {/* 1 */}
            <div id="map" style={{ width: '100%', height: '100vh' }} />
            {children}
            {/* 1 */}

            {/* 2 */}
            {/* <div id="map" style={{ width: '100%', height: '100vh' }}>
            {children}
            </div> */}
            {/* 2 */}
           
        </MapBoxContext.Provider>
    )
};

export default MapBox;


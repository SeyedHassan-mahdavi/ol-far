'use client';
import React, { useEffect } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

import {
    Attribution,
    FullScreen,
    Rotate,
    ScaleLine,
    defaults,
} from 'ol/control';
import LayerSwitcher from './LayerSwitcher';

const MapComponent = () => {


    useEffect(() => {
        const map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: fromLonLat([51, 32]),
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





        return () => {
            map.setTarget(null);
        };
    }, []);




    return (
        <>
            <LayerSwitcher map={Map} />

            <div id="map" style={{ width: '100%', height: '100vh' }}></div>
        </>
    )
};

export default MapComponent;

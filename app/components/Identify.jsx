"use client"
import TileLayer from 'ol/layer/Tile';
import { TileWMS } from 'ol/source';
import { useState } from 'react';
import { useEffect } from 'react';
import { useMap } from './hooks/useMap';

const Identify = () => {
    const [identifyIsActive, setIdentifyIsActive] = useState(false);

    const map = useMap();

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
        new TileLayer({
            name: 'sea',
            source: new TileWMS({
                url: 'http://10.10.1.20:8080/geoserver/wms',
                params: { 'LAYERS': 'world:sea', 'TILED': true },
                serverType: 'geoserver',
            }),
        }),
    ];

    const toggleIndentify = () => {
        setIdentifyIsActive(!identifyIsActive);
    };

    const identify = (evt) => {
        const viewResolution = map.getView().getResolution();
        const lyrName = document.querySelector('.identify__select>select').value;
        const wmsLayer = map.getLayers().getArray().find(l => l.get('name') === lyrName);
        const url = wmsLayer.getSource().getFeatureInfoUrl(
            evt.coordinate,
            viewResolution,
            'EPSG:3857',
            { 'INFO_FORMAT': 'text/html' }
        );
        if (url) {
            fetch(url)
                .then((response) => response.text())
                .then((html) => {
                    document.querySelector('.identify__result').innerHTML = html;
                });
        }
    };

    useEffect(() => {
        const identifyToggler = document.querySelector('.identify__icon');
        const identifyContent = document.querySelector('.identify__content');

        identifyToggler.addEventListener('click', toggleIndentify);

        return () => {
            identifyToggler.removeEventListener('click', toggleIndentify);
        };
    }, []);

    useEffect(() => {
        if (identifyIsActive) {
            map.on('click', identify);
        } else {
            map.un('click', identify);
        }
    }, [identifyIsActive]);

    return (
        <div className="identify">
            <div className="identify__icon"></div>
            <div className="identify__content">
                <div className="identify__select">
                    <select>
                        {wmsLayers.map((lyr, index) => (
                            <option key={index}>{lyr.get('name')}</option>
                        ))}
                    </select>
                </div>
                <div className="identify__result"></div>
            </div>
        </div>
    );
};

export default Identify;

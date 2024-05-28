"use client"
import React, { useEffect } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Stroke, Style, Fill } from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON';
import geojsonData from '../file.json'; // Import your GeoJSON file
import { useMap } from './hooks/useMap';

const GeoJSONLayer = () => {
    const map = useMap();

    useEffect(() => {
        if (map) {
            const vectorSourcePoly = new VectorSource({
                features: new GeoJSON().readFeatures(geojsonData, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }),
            });

            const stylePoly = new Style({
                stroke: new Stroke({
                    color: 'blue',
                    width: 2,
                }),
                fill: new Fill({
                    color: 'rgba(0, 0, 255, 0.1)',
                }),
            });

            const vectorLayer = new VectorLayer({
                style: stylePoly,
                source: vectorSourcePoly,
            });

            map.addLayer(vectorLayer); // Add vector layer to the map

            return () => {
                map.removeLayer(vectorLayer); // Remove vector layer when component unmounts
            };
        }
    }, [map]);

    return null;
};

export default GeoJSONLayer;

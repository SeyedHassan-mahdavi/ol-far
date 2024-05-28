"use client"
import React, { useEffect } from 'react';
import { useMap } from './hooks/useMap'; // فرض کنید این hook نقشه را برمی‌گرداند
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import { Point } from 'ol/geom';
import Feature from 'ol/Feature';

const ImageLayer = ({ id, url, coordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      const iconFeature = new Feature({
        geometry: new Point(coordinates),
      });

      const iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: url,
        }),
      });

      iconFeature.setStyle(iconStyle);

      const vectorSource = new VectorSource({
        features: [iconFeature],
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      map.addLayer(vectorLayer);

      return () => {
        map.removeLayer(vectorLayer);
      };
    }
  }, [map, url, coordinates]);

  return null;
};

export default ImageLayer;

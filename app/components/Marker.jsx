'use client';

import React, { useEffect } from 'react';
import { useMap } from './hooks/useMap'; // فرض کنید این hook نقشه را برمی‌گرداند
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import { Point } from 'ol/geom';
import Feature from 'ol/Feature';

const Marker = ({
  coordinates,
  anchor = 'center',
  offset = [0, 0],
  image,
  onClick,
  style,
  className
}) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      const iconFeature = new Feature({
        geometry: new Point(coordinates),
        className: className, // اضافه کردن className به فیچر
      });

      const iconStyle = new Style({
        image: new Icon({
          anchor: getAnchor(anchor),
          src: image,
          offset: offset,
        }),
        ...style, // اعمال استایل به Feature
      });

      iconFeature.setStyle(iconStyle);

      const vectorSource = new VectorSource({
        features: [iconFeature],
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: (feature) => {
          // اعمال استایل فقط به فیچر با className مورد نظر
          if (feature.get('className') === className) {
            return iconStyle;
          }
        },
      });

      map.addLayer(vectorLayer);

      if (onClick) {
        map.on('click', (evt) => {
          map.forEachFeatureAtPixel(evt.pixel, (feature) => {
            if (feature === iconFeature) {
              onClick(evt);
            }
          });
        });
      }

      return () => {
        map.removeLayer(vectorLayer);
      };
    }
  }, [map, coordinates, anchor, offset, image, onClick, style, className]);

  const getAnchor = (anchor) => {
    switch (anchor) {
      case 'bottom':
        return [0.5, 0];
      case 'bottom-left':
        return [0, 0];
      case 'bottom-right':
        return [1, 0];
      case 'center':
        return [0.5, 0.5];
      case 'left':
        return [0, 0.5];
      case 'right':
        return [1, 0.5];
      case 'top':
        return [0.5, 1];
      case 'top-left':
        return [0, 1];
      case 'top-right':
        return [1, 1];
      default:
        return [0.5, 0.5];
    }
  };

  return null;
};

export default Marker;

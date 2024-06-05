"use client"
import { useState } from 'react';
import GeoJSONLayer from "./components/GeoJSONLayer";
import ImageLayer from "./components/ImageLayer.";
import Marker from "./components/Marker";
import MapBox from "./components/MapBox";

export default function Home() {
  const [userCoords, setUserCoords] = useState(null);

  const mapParams = {
    scrollZoom: true,
    maxZoom: 18,
    minZoom: 2,
    zoomSlider: true,
    hash: false,
    preserveDrawingBuffer: true,
    interactive: true,
    customAttribution: 'Data provided by <a href="https://example.com">Example Company</a> &copy; 2024',
    multiWorld: false,
    dragRotate: false,
    touchZoomRotate: true,
    doubleClickZoom: true,
    keyboard: true,
  };

  const handleClick = (evt, coords) => {
    console.log('Map clicked at coordinates:', coords);
  };

  const handleDblClick = (evt, coords) => {
    console.log('Map double clicked at coordinates:', coords);
  };

  const handleMarkerClick = (evt) => {
    console.log('Marker clicked', evt);
  };

  return (
    <MapBox
      mapParams={mapParams}
      userLocation={false}
      setUserCoords={setUserCoords}
      onClick={handleClick}
      onDblClick={handleDblClick}
    >
      <GeoJSONLayer />
      <ImageLayer
        id="point-image-1"
        url="https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/64px-Cat_silhouette.svg.png"
        coordinates={[51, 32]} // Coordinates for the image
      />
      <Marker
        coordinates={[51.42047, 35.729054]}
        anchor="center"
        image="https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/64px-Cat_silhouette.svg.png"
        onClick={handleMarkerClick}
        style={{ border: '15px solid red', color: "red" }}
        className="custom-marker"
      />
      {userCoords && (
        <div>
          <p>مختصات کاربر: {userCoords[0]}, {userCoords[1]}</p>
        </div>
      )}
    </MapBox>
  );
}

'use client';

import Drawing from "./components/Drawing";
import GeoJSONLayer from "./components/GeoJSONLayer";
import Identify from "./components/Identify";
import IdentifyComponent from "./components/Identify";
import ImageLayer from "./components/ImageLayer.";
import LayerSwitcher from "./components/LayerSwitcher";
import MapBox from "./components/MapBox";
import Marker from "./components/Marker";
import MarkerControl from "./components/MarkerControl";


export default function Home() {


  const bounds = [{ lng: 51, lat: 32 }, { lng: 52, lat: 33 }];

  const handleMarkerClick = (evt) => {
    console.log('Marker clicked', evt);
  };

  return (

    <MapBox >
      {/* <GeoJSONLayer /> */}
      {/* <ImageLayer
        id="point-image-1"
        url="https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/64px-Cat_silhouette.svg.png"
        coordinates={[51, 32]} // Coordinates for the image
      /> */}
        <Marker
          coordinates={[51.42047, 35.729054]}
          anchor="center"
          image="https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/64px-Cat_silhouette.svg.png"
          onClick={handleMarkerClick}
          style={{ border: '15px solid red', color:"red" }}
          className="custom-marker"
        />
      {/* <MarkerControl /> */}
      {/* <LayerSwitcher /> */}
      {/* <Drawing /> */}
      {/* <Identify /> */}
    </MapBox>


  );
}

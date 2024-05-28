// // components/MarkerControl.js
// import React from 'react';
// import { Feature } from 'ol';
// import { Point } from 'ol/geom';
// import { Style, Icon } from 'ol/style';
// import { Vector as VectorLayer } from 'ol/layer';
// import { Vector as VectorSource } from 'ol/source';
// import { useMap } from './hooks/useMap';

// const MarkerControl = () => {
//     const map = useMap();

//   const addMarker = () => {
//     const marker = new Feature({
//       geometry: new Point([0, 0]),
//     });

//     marker.setStyle(
//       new Style({
//         image: new Icon({
//           src: 'https://openlayers.org/en/latest/examples/data/icon.png',
//         }),
//       })
//     );

//     const vectorSource = new VectorSource({
//       features: [marker],
//     });

//     const vectorLayer = new VectorLayer({
//       source: vectorSource,
//     });

//     map.addLayer(vectorLayer);
//   };

//   return (
//     <div style={{ position: 'absolute', top: '50px', left: '10px', zIndex: 1 }}>
//       <button onClick={addMarker}>Add Marker</button>
//     </div>
//   );
// };

// export default MarkerControl;
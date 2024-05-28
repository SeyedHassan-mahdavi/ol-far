
// components/Drawing.js
"use client";
import React, { useState } from 'react';
import 'ol/ol.css';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Draw, Modify } from 'ol/interaction';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Image from 'next/image';
import { useMap } from './hooks/useMap';

const Drawing = () => {
    const [drawType, setDrawType] = useState(null);
    const [drawLayer, setDrawLayer] = useState(null);
    const [DrawingIsOpen, setDrawingIsOpen] = useState(false);

    const map = useMap();

    const handleDraw = (type) => {
        if (drawType) {
            map.removeInteraction(drawType);
        }

        const source = new VectorSource();
        const layer = new VectorLayer({
            source: source,
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)',
                }),
                stroke: new Stroke({
                    color: '#ffcc33',
                    width: 2,
                }),
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({
                        color: '#ffcc33',
                    }),
                }),
            }),
        });

        map.addLayer(layer);

        const draw = new Draw({
            source: source,
            type: type,
        });

        map.addInteraction(draw);
        setDrawType(draw);
        setDrawLayer(layer);
    };

    const handleModify = () => {
        const modify = new Modify({ source: drawLayer.getSource() });
        map.addInteraction(modify);
    };

    const handleClear = () => {
        if (drawLayer) {
            drawLayer.getSource().clear();
            setDrawLayer(null); // پاک کردن نوع ویرایش
            map.getInteractions().forEach(interaction => {
                if (interaction instanceof Draw || interaction instanceof Modify) {
                    map.removeInteraction(interaction); // حذف همه تعاملات رسم و ویرایش
                }
            });
        }
    };
    
    

    const toggleDrawing = () => {
        setDrawingIsOpen(!DrawingIsOpen);
    };

    return (
        <div className="fixed top-20 right-3">
            <div className={`w-8 p-2 h-8 cursor-pointer ${DrawingIsOpen ? 'bg-orange-500' : 'bg-blue-800'}`} onClick={toggleDrawing}>
                <Image priority={true} src="/pen.svg" width={700} height={700} alt="Layers" className="w-full h-full" />
            </div>
            {DrawingIsOpen &&
                <div className='flex flex-col space-y-1 mt-2 bg-white p-2 rounded shadow-lg'>
                    <button className="p-1 bg-blue-500 text-white rounded" onClick={() => handleDraw('Point')}>Draw Point</button>
                    <button className="p-1 bg-blue-500 text-white rounded" onClick={() => handleDraw('LineString')}>Draw Line</button>
                    <button className="p-1 bg-blue-500 text-white rounded" onClick={() => handleDraw('Polygon')}>Draw Polygon</button>
                    <button className="p-1 bg-blue-500 text-white rounded" onClick={handleModify}>Modify Feature</button>
                    <button className="p-1 bg-red-500 text-white rounded" onClick={handleClear}>Clear Features</button>
                </div>}
        </div>
    );
};

export default Drawing;


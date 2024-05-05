import { useState } from 'react';

const LayerSwitcher = ({map}) => {
    const [layerSwitcherIsOpen, setLayerSwitcherIsOpen] = useState(false);

    const toggleLayerSwitcher = () => {
        setLayerSwitcherIsOpen(!layerSwitcherIsOpen);
    };

    const wmsLayers = [
        {
            name: 'Iran Provinces',
            url: 'http://10.10.1.20:8080/geoserver/wms',
            params: { 'LAYERS': 'ne:world', 'TILED': true },
        },
        {
            name: 'US State',
            url: 'http://localhost:8080/geoserver/wms',
            params: { 'LAYERS': 'topp:states', 'TILED': true },
        }
    ];

    return (
        <div className="fixed top-20 left-3 z-10 layer-switcher">
            <div className="w-7 h-7 layer-switcher__icon" onClick={toggleLayerSwitcher}>
                <img src="/layers.svg" alt="Layers" className="w-full h-full" />
            </div>
            {layerSwitcherIsOpen && (
                <div className="layer-switcher__content bg-white mt-3 p-3 w-52 rounded-md border-2 border-blue-700">
                    {wmsLayers.map((lyr, index) => (
                        <div key={index} className="flex items-center">
                            <input
                                type="checkbox"
                                id={lyr.name}
                                defaultChecked={true}
                                onClick={(e) => {
                                    const layer = map.getLayers().getArray().find((l) => l.get('name') === lyr.name);
                                    layer.setVisible(e.target.checked);
                                }}
                                className="mr-2"
                            />
                            <label htmlFor={lyr.name}>{lyr.name}</label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LayerSwitcher;

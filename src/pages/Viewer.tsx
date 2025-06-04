import React, { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import MapView from '../components/MapView';
import { Layers, Map, Eye, Settings, ZoomIn, ZoomOut } from 'lucide-react';

type MapType = 'vector' | 'raster';

const Viewer: React.FC = () => {
  const { settings } = useSettings();
  const [mapType, setMapType] = useState<MapType>('vector');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [availableStyles, setAvailableStyles] = useState<string[]>(['default']);
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({});
  const [zoom, setZoom] = useState<number>(settings?.defaultZoom || 10);
  const [layersOpen, setLayersOpen] = useState(false);

  // Mock layer categories (in a real app, these would be fetched from the API)
  const layerCategories = [
    { id: 'roads', name: 'Roads', defaultVisible: true },
    { id: 'buildings', name: 'Buildings', defaultVisible: true },
    { id: 'water', name: 'Water Bodies', defaultVisible: true },
    { id: 'landuse', name: 'Land Use', defaultVisible: true },
    { id: 'places', name: 'Places', defaultVisible: true },
    { id: 'poi', name: 'Points of Interest', defaultVisible: false },
  ];

  useEffect(() => {
    // Initialize visible layers based on default values
    const initialLayers = layerCategories.reduce((acc, layer) => {
      acc[layer.id] = layer.defaultVisible;
      return acc;
    }, {} as Record<string, boolean>);
    setVisibleLayers(initialLayers);

    // In a real app, fetch available styles from the API
    // For now, we'll use mock data
    setAvailableStyles(['default', 'satellite', 'dark', 'light']);
  }, []);

  const toggleLayer = (layerId: string) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      {/* Map Controls */}
      <div className="bg-white p-4 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setMapType('vector')}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                mapType === 'vector'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Layers className="h-4 w-4 mr-1" />
              Vector
            </button>
            <button
              onClick={() => setMapType('raster')}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                mapType === 'raster'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Map className="h-4 w-4 mr-1" />
              Raster
            </button>
          </div>

          {mapType === 'vector' && (
            <div className="flex items-center">
              <label htmlFor="style-select" className="mr-2 text-sm font-medium text-gray-700">
                Style:
              </label>
              <select
                id="style-select"
                value={selectedStyle || 'default'}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="rounded-md border border-gray-300 py-1.5 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {availableStyles.map((style) => (
                  <option key={style} value={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setLayersOpen(!layersOpen)}
              className="px-3 py-2 rounded-md text-sm font-medium flex items-center text-gray-700 hover:bg-gray-100"
            >
              <Eye className="h-4 w-4 mr-1" />
              Layers
            </button>
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => setZoom(Math.max(0, zoom - 1))}
                className="p-1.5 text-gray-700 hover:bg-gray-100"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="px-2 text-sm font-medium text-gray-700">{zoom}</span>
              <button
                onClick={() => setZoom(Math.min(19, zoom + 1))}
                className="p-1.5 text-gray-700 hover:bg-gray-100"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Layers Panel */}
        {layersOpen && (
          <div className="w-64 bg-white p-4 shadow-md overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Layer Visibility</h2>
            <div className="space-y-3">
              {layerCategories.map((layer) => (
                <div key={layer.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`layer-${layer.id}`}
                    checked={visibleLayers[layer.id] || false}
                    onChange={() => toggleLayer(layer.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`layer-${layer.id}`}
                    className="ml-2 block text-sm text-gray-700"
                  >
                    {layer.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map View */}
        <div className="flex-1 relative">
          <MapView 
            style={mapType}
            customStyle={selectedStyle ? `${settings?.tileServerUrl || ''}/styles/${selectedStyle}/style.json` : undefined}
            initialZoom={zoom}
            initialCenter={settings?.defaultCenter}
            onMapClick={(e) => {
              console.log('Map clicked at:', e.lngLat);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Viewer;
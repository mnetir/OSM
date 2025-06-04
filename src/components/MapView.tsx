import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useSettings } from '../hooks/useSettings';

interface MapViewProps {
  style?: 'vector' | 'raster';
  customStyle?: string;
  initialZoom?: number;
  initialCenter?: [number, number];
  interactive?: boolean;
  onMapClick?: (e: maplibregl.MapMouseEvent) => void;
}

const MapView: React.FC<MapViewProps> = ({
  style = 'vector',
  customStyle,
  initialZoom,
  initialCenter,
  interactive = true,
  onMapClick
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const { settings } = useSettings();
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || mapInitialized) return;

    const defaultCenter = settings?.defaultCenter || [51.5, 35.7]; // Default to center of Iran if not specified
    const defaultZoom = settings?.defaultZoom || 10;

    const center = initialCenter || defaultCenter;
    const zoom = initialZoom || defaultZoom;

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: customStyle || (style === 'vector' ? 
        `${settings?.tileServerUrl || ''}/styles/default/style.json` : 
        {
          version: 8,
          sources: {
            'raster-tiles': {
              type: 'raster',
              tiles: [`${settings?.tileServerUrl || ''}/tile/{z}/{x}/{y}.png`],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'raster-tiles-layer',
              type: 'raster',
              source: 'raster-tiles',
              minzoom: 0,
              maxzoom: 19
            }
          ]
        }
      ),
      center: center as [number, number],
      zoom: zoom
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    
    if (onMapClick && map.current) {
      map.current.on('click', onMapClick);
    }

    map.current.on('load', () => {
      setMapInitialized(true);
    });

    return () => {
      if (map.current) {
        if (onMapClick) {
          map.current.off('click', onMapClick);
        }
        map.current.remove();
      }
    };
  }, [settings, customStyle, style, initialCenter, initialZoom, onMapClick, mapInitialized]);

  // Update map when customStyle changes
  useEffect(() => {
    if (mapInitialized && map.current && customStyle) {
      map.current.setStyle(customStyle);
    }
  }, [customStyle, mapInitialized]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full min-h-[400px] rounded-lg shadow-md"
      style={{ cursor: interactive ? 'grab' : 'default' }}
    />
  );
};

export default MapView;
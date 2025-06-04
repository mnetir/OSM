import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Settings, Database, Layers } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          OpenStreetMap Manager
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          A comprehensive solution for managing and viewing OpenStreetMap data with custom styling and vector tile generation.
        </p>
      </div>

      <div className="mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link 
            to="/viewer" 
            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center">
                <Map className="h-8 w-8 text-blue-600" />
                <h2 className="ml-3 text-2xl font-bold text-gray-900">Map Viewer</h2>
              </div>
              <p className="mt-4 text-gray-600">
                Explore OSM maps with custom styles, both vector and raster tiles. View different layers and categories based on zoom levels.
              </p>
            </div>
            <div className="bg-blue-50 px-6 py-4">
              <div className="text-sm font-medium text-blue-600">View Maps →</div>
            </div>
          </Link>

          <Link 
            to="/management" 
            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center">
                <Settings className="h-8 w-8 text-teal-600" />
                <h2 className="ml-3 text-2xl font-bold text-gray-900">Management</h2>
              </div>
              <p className="mt-4 text-gray-600">
                Configure database connections, map styles, tile server settings, and manage vector tile generation.
              </p>
            </div>
            <div className="bg-teal-50 px-6 py-4">
              <div className="text-sm font-medium text-teal-600">Manage Settings →</div>
            </div>
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Database className="h-6 w-6 text-purple-600" />
            <h3 className="mt-3 text-lg font-semibold text-gray-900">Database Connection</h3>
            <p className="mt-2 text-sm text-gray-600">
              Connect to your OSM PostgreSQL database to access and modify map data.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <Layers className="h-6 w-6 text-orange-600" />
            <h3 className="mt-3 text-lg font-semibold text-gray-900">Vector Tiles</h3>
            <p className="mt-2 text-sm text-gray-600">
              Generate and serve vector tiles for faster and more flexible map rendering.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <Settings className="h-6 w-6 text-green-600" />
            <h3 className="mt-3 text-lg font-semibold text-gray-900">Customize Styles</h3>
            <p className="mt-2 text-sm text-gray-600">
              Create and apply custom map styles to change the appearance of your maps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
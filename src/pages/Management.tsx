import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Database, MapPin, Layers, Edit, Server } from 'lucide-react';

const Management: React.FC = () => {
  const managementOptions = [
    {
      title: 'Settings',
      description: 'Configure database connections, tile server URLs, and default map parameters',
      icon: <Settings className="h-8 w-8 text-blue-600" />,
      path: '/management/settings',
      color: 'blue'
    },
    {
      title: 'Vector Generation',
      description: 'Generate MBTiles from OSM database for faster vector tile serving',
      icon: <Layers className="h-8 w-8 text-purple-600" />,
      path: '/management/vector-generation',
      color: 'purple'
    },
    {
      title: 'Map Styles',
      description: 'Upload and manage custom map styles for both vector and raster tiles',
      icon: <MapPin className="h-8 w-8 text-green-600" />,
      path: '/management/map-styles',
      color: 'green'
    },
    {
      title: 'Tile Server Config',
      description: 'Configure OSM categories and zoom levels for the tile server',
      icon: <Server className="h-8 w-8 text-orange-600" />,
      path: '/management/tile-server-config',
      color: 'orange'
    },
    {
      title: 'Database Editor',
      description: 'Edit OSM object names and properties directly in the database',
      icon: <Edit className="h-8 w-8 text-red-600" />,
      path: '/management/database-editor',
      color: 'red'
    },
    {
      title: 'Database Connection',
      description: 'Manage PostgreSQL connection to your OSM database',
      icon: <Database className="h-8 w-8 text-indigo-600" />,
      path: '/management/settings',
      color: 'indigo'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Management Dashboard</h1>
        <p className="mt-4 text-lg text-gray-600">
          Configure and manage your OSM tile server and database
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managementOptions.map((option, index) => (
          <Link
            key={index}
            to={option.path}
            className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col`}
          >
            <div className="p-6 flex-grow">
              <div className="flex items-center">
                {option.icon}
                <h2 className="ml-3 text-xl font-bold text-gray-900">{option.title}</h2>
              </div>
              <p className="mt-4 text-gray-600">{option.description}</p>
            </div>
            <div className={`bg-${option.color}-50 px-6 py-4`}>
              <div className={`text-sm font-medium text-${option.color}-600`}>Configure →</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-blue-800">Quick Help</h3>
        <p className="mt-2 text-blue-700">
          Start by configuring your database connection in the Settings page. Then, you can generate vector tiles,
          customize map styles, and configure your tile server. Use the Database Editor to modify OSM object names.
        </p>
      </div>
    </div>
  );
};

export default Management;
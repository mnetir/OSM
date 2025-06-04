import React, { useState, useEffect } from 'react';
import { Search, Map, Edit, Save, Check, X, Database } from 'lucide-react';
import MapView from '../components/MapView';

interface MapObject {
  id: string;
  type: 'street' | 'building' | 'place' | 'water' | 'other';
  name: string;
  originalName: string;
  tags: Record<string, string>;
  coordinates: [number, number];
}

const DatabaseEditor: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MapObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<MapObject | null>(null);
  const [editedName, setEditedName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  // Load initial data
  useEffect(() => {
    // In a real app, this would be an API call
    // For demonstration, we'll use mock data
    const mockObjects: MapObject[] = [
      {
        id: '1',
        type: 'street',
        name: 'Valiasr Street',
        originalName: 'Valiasr Street',
        tags: { highway: 'primary' },
        coordinates: [51.4, 35.7]
      },
      {
        id: '2',
        type: 'building',
        name: 'Milad Tower',
        originalName: 'Milad Tower',
        tags: { building: 'tower', height: '435' },
        coordinates: [51.37, 35.74]
      },
      {
        id: '3',
        type: 'place',
        name: 'Tehran Grand Bazaar',
        originalName: 'Tehran Grand Bazaar',
        tags: { shop: 'mall', tourism: 'attraction' },
        coordinates: [51.42, 35.67]
      },
      {
        id: '4',
        type: 'water',
        name: 'Chitgar Lake',
        originalName: 'Chitgar Lake',
        tags: { natural: 'water', water: 'lake' },
        coordinates: [51.22, 35.75]
      }
    ];
    setSearchResults(mockObjects);
  }, []);

  const handleSearch = () => {
    // In a real app, this would make an API call to search for objects
    // For demonstration, we'll filter the mock data
    if (!searchQuery.trim()) {
      return;
    }

    const filteredResults = searchResults.filter(obj =>
      obj.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

  const handleSelectObject = (object: MapObject) => {
    setSelectedObject(object);
    setEditedName(object.name);
    setMapCenter(object.coordinates);
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditedName(selectedObject?.name || '');
  };

  const handleSaveChanges = async () => {
    if (!selectedObject || !editedName.trim()) return;

    setSaveStatus('saving');

    try {
      // Simulate API call to save changes
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update the object in the results list
      setSearchResults(prevResults =>
        prevResults.map(obj =>
          obj.id === selectedObject.id ? { ...obj, name: editedName } : obj
        )
      );

      // Update the selected object
      setSelectedObject({ ...selectedObject, name: editedName });
      
      setIsEditing(false);
      setSaveStatus('success');

      // Reset status after a delay
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error saving changes:', error);
      setSaveStatus('error');

      // Reset status after a delay
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };

  const getObjectTypeIcon = (type: string) => {
    switch (type) {
      case 'street':
        return <div className="h-3 w-3 bg-blue-500 rounded-full"></div>;
      case 'building':
        return <div className="h-3 w-3 bg-gray-700 rounded-sm"></div>;
      case 'place':
        return <div className="h-3 w-3 bg-purple-500 rounded-full"></div>;
      case 'water':
        return <div className="h-3 w-3 bg-blue-300 rounded-full"></div>;
      default:
        return <div className="h-3 w-3 bg-green-500 rounded-full"></div>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Database Editor</h1>
        <p className="mt-2 text-gray-600">
          Search and edit OSM object names in the database
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Search className="h-5 w-5 text-red-600 mr-2" />
                Search Objects
              </h2>

              <div className="mt-2">
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-red-500 focus:border-red-500 sm:text-sm border-gray-300"
                    placeholder="Search for streets, buildings, places..."
                  />
                  <button
                    onClick={handleSearch}
                    className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-red-600 text-white hover:bg-red-700"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Results</h3>
                {searchResults.length === 0 ? (
                  <p className="text-gray-500 text-sm">No results found. Try a different search term.</p>
                ) : (
                  <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                    {searchResults.map((obj) => (
                      <li
                        key={obj.id}
                        onClick={() => handleSelectObject(obj)}
                        className={`py-3 px-2 flex items-center cursor-pointer hover:bg-gray-50 ${
                          selectedObject?.id === obj.id ? 'bg-red-50' : ''
                        }`}
                      >
                        <div className="mr-3">{getObjectTypeIcon(obj.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{obj.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{obj.type}</p>
                        </div>
                        <div className="ml-2">
                          <Map className="h-4 w-4 text-gray-400" />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {selectedObject && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Edit className="h-5 w-5 text-red-600 mr-2" />
                  Edit Object
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Object ID
                    </label>
                    <div className="bg-gray-50 px-3 py-2 rounded-md text-sm text-gray-700 font-mono">
                      {selectedObject.id}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <div className="flex items-center bg-gray-50 px-3 py-2 rounded-md text-sm text-gray-700">
                      <div className="mr-2">{getObjectTypeIcon(selectedObject.type)}</div>
                      <span className="capitalize">{selectedObject.type}</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="object-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    {isEditing ? (
                      <div className="flex rounded-md shadow-sm">
                        <input
                          type="text"
                          id="object-name"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md focus:ring-red-500 focus:border-red-500 sm:text-sm border-gray-300"
                        />
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="bg-gray-50 px-3 py-2 rounded-md text-sm text-gray-700">
                          {selectedObject.name}
                        </div>
                        <button
                          onClick={handleStartEditing}
                          className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Original Name
                    </label>
                    <div className="bg-gray-50 px-3 py-2 rounded-md text-sm text-gray-700">
                      {selectedObject.originalName}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <div className="bg-gray-50 px-3 py-2 rounded-md text-sm text-gray-700">
                      {Object.entries(selectedObject.tags).map(([key, value]) => (
                        <span key={key} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-200 text-gray-800 mr-2 mb-1">
                          {key}={value}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coordinates
                    </label>
                    <div className="bg-gray-50 px-3 py-2 rounded-md text-sm text-gray-700 font-mono">
                      {selectedObject.coordinates[0].toFixed(6)}, {selectedObject.coordinates[1].toFixed(6)}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={handleCancelEditing}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveChanges}
                        disabled={saveStatus === 'saving'}
                        className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
                          saveStatus === 'saving'
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                        }`}
                      >
                        {saveStatus === 'saving' ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-1" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {saveStatus === 'success' && (
                    <div className="bg-green-50 p-3 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-800">
                            Changes saved successfully!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {saveStatus === 'error' && (
                    <div className="bg-red-50 p-3 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <X className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-red-800">
                            Failed to save changes. Please try again.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Map className="h-5 w-5 text-red-600 mr-2" />
                Map View
              </h2>
              <div className="h-[600px] rounded-md overflow-hidden">
                <MapView
                  style="vector"
                  initialCenter={mapCenter || undefined}
                  initialZoom={mapCenter ? 15 : undefined}
                  onMapClick={(e) => {
                    console.log('Map clicked at:', e.lngLat);
                  }}
                />
              </div>
              <div className="mt-4 bg-blue-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Database className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Database Connection</h3>
                    <p className="mt-1 text-sm text-blue-700">
                      Changes made here are immediately applied to the PostgreSQL database.
                      These changes will be reflected in the generated vector tiles and rendered maps.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseEditor;
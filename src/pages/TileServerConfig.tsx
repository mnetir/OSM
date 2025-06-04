import React, { useState, useEffect } from 'react';
import { Save, Layers, Plus, Minus, Info, AlertTriangle } from 'lucide-react';

interface LayerCategory {
  id: string;
  name: string;
  minZoom: number;
  maxZoom: number;
  visible: boolean;
  color: string;
}

const TileServerConfig: React.FC = () => {
  const [categories, setCategories] = useState<LayerCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Load initial categories
  useEffect(() => {
    // In a real app, this would fetch from an API
    const initialCategories: LayerCategory[] = [
      {
        id: 'roads',
        name: 'Roads',
        minZoom: 10,
        maxZoom: 19,
        visible: true,
        color: '#3B82F6'
      },
      {
        id: 'buildings',
        name: 'Buildings',
        minZoom: 14,
        maxZoom: 19,
        visible: true,
        color: '#6B7280'
      },
      {
        id: 'water',
        name: 'Water Bodies',
        minZoom: 8,
        maxZoom: 19,
        visible: true,
        color: '#60A5FA'
      },
      {
        id: 'landuse',
        name: 'Land Use',
        minZoom: 10,
        maxZoom: 19,
        visible: true,
        color: '#84CC16'
      },
      {
        id: 'places',
        name: 'Places',
        minZoom: 7,
        maxZoom: 19,
        visible: true,
        color: '#8B5CF6'
      },
      {
        id: 'poi',
        name: 'Points of Interest',
        minZoom: 14,
        maxZoom: 19,
        visible: true,
        color: '#F97316'
      }
    ];
    setCategories(initialCategories);
  }, []);

  const handleCategoryClick = (id: string) => {
    setSelectedCategory(id);
  };

  const handleVisibilityToggle = (id: string) => {
    setCategories(prevCategories =>
      prevCategories.map(category =>
        category.id === id ? { ...category, visible: !category.visible } : category
      )
    );
  };

  const handleZoomChange = (id: string, type: 'min' | 'max', value: number) => {
    setCategories(prevCategories =>
      prevCategories.map(category =>
        category.id === id
          ? {
              ...category,
              minZoom: type === 'min' ? Math.min(value, category.maxZoom) : category.minZoom,
              maxZoom: type === 'max' ? Math.max(value, category.minZoom) : category.maxZoom
            }
          : category
      )
    );
  };

  const handleColorChange = (id: string, color: string) => {
    setCategories(prevCategories =>
      prevCategories.map(category =>
        category.id === id ? { ...category, color } : category
      )
    );
  };

  const handleAddCategory = () => {
    const newId = `category-${Date.now()}`;
    const newCategory: LayerCategory = {
      id: newId,
      name: 'New Category',
      minZoom: 10,
      maxZoom: 19,
      visible: true,
      color: '#EF4444'
    };
    setCategories(prevCategories => [...prevCategories, newCategory]);
    setSelectedCategory(newId);
  };

  const handleRemoveCategory = (id: string) => {
    setCategories(prevCategories => prevCategories.filter(category => category.id !== id));
    if (selectedCategory === id) {
      setSelectedCategory(null);
    }
  };

  const handleSaveConfig = async () => {
    setSaveStatus('saving');
    
    // Simulate API call to save configuration
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus('success');
      
      // Reset status after a delay
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error saving configuration:', error);
      setSaveStatus('error');
      
      // Reset status after a delay
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };

  const selectedCategoryData = selectedCategory
    ? categories.find(category => category.id === selectedCategory)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tile Server Configuration</h1>
        <p className="mt-2 text-gray-600">
          Configure OSM categories and their visibility based on zoom levels
        </p>
      </div>

      <div className="bg-orange-50 p-4 rounded-md mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-orange-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-orange-800">Configuration Information</h3>
            <div className="mt-2 text-sm text-orange-700">
              <p>
                These settings control which OSM categories are visible at different zoom levels.
                Changes will affect both vector and raster tile rendering.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Layers className="h-5 w-5 text-orange-600 mr-2" />
                  OSM Categories
                </h2>
                <button
                  onClick={handleAddCategory}
                  className="inline-flex items-center p-1.5 border border-transparent rounded-full text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-2">
              <ul className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className={`relative py-3 px-2 flex items-center cursor-pointer hover:bg-gray-50 ${
                      selectedCategory === category.id ? 'bg-orange-50' : ''
                    }`}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{category.name}</p>
                      <p className="text-xs text-gray-500">
                        Zoom: {category.minZoom} - {category.maxZoom}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVisibilityToggle(category.id);
                        }}
                        className={`p-1 rounded-md ${
                          category.visible
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCategory(category.id);
                        }}
                        className="p-1 rounded-md text-red-600 hover:bg-red-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                {selectedCategoryData ? `Edit: ${selectedCategoryData.name}` : 'Select a category to edit'}
              </h2>

              {selectedCategoryData ? (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      id="category-name"
                      value={selectedCategoryData.name}
                      onChange={(e) => {
                        setCategories(prevCategories =>
                          prevCategories.map(category =>
                            category.id === selectedCategory
                              ? { ...category, name: e.target.value }
                              : category
                          )
                        );
                      }}
                      className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="category-color" className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        id="category-color"
                        value={selectedCategoryData.color}
                        onChange={(e) => handleColorChange(selectedCategory, e.target.value)}
                        className="h-9 w-9 border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        value={selectedCategoryData.color}
                        onChange={(e) => handleColorChange(selectedCategory, e.target.value)}
                        className="block rounded-md border border-gray-300 shadow-sm p-2 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <fieldset>
                      <legend className="block text-sm font-medium text-gray-700 mb-1">
                        Visibility Range (Zoom Levels)
                      </legend>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="min-zoom" className="block text-xs text-gray-500 mb-1">
                            Minimum Zoom Level
                          </label>
                          <input
                            type="number"
                            id="min-zoom"
                            min="0"
                            max="19"
                            value={selectedCategoryData.minZoom}
                            onChange={(e) => handleZoomChange(selectedCategory, 'min', parseInt(e.target.value, 10))}
                            className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="max-zoom" className="block text-xs text-gray-500 mb-1">
                            Maximum Zoom Level
                          </label>
                          <input
                            type="number"
                            id="max-zoom"
                            min="0"
                            max="19"
                            value={selectedCategoryData.maxZoom}
                            onChange={(e) => handleZoomChange(selectedCategory, 'max', parseInt(e.target.value, 10))}
                            className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </fieldset>
                  </div>

                  <div>
                    <div className="relative flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="category-visible"
                          type="checkbox"
                          checked={selectedCategoryData.visible}
                          onChange={() => handleVisibilityToggle(selectedCategory)}
                          className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="category-visible" className="font-medium text-gray-700">
                          Visible by default
                        </label>
                        <p className="text-gray-500">
                          When enabled, this category will be shown by default in the map viewer.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <Layers className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No category selected</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select a category from the list to edit its properties.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSaveConfig}
              disabled={saveStatus === 'saving'}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                saveStatus === 'saving'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
              }`}
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </>
              )}
            </button>
          </div>

          {saveStatus === 'success' && (
            <div className="mt-4 bg-green-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Configuration saved successfully!
                  </p>
                </div>
              </div>
            </div>
          )}

          {saveStatus === 'error' && (
            <div className="mt-4 bg-red-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    Failed to save configuration. Please try again.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TileServerConfig;
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Palette, Upload, Trash2, Check, Edit, Eye } from 'lucide-react';
import MapView from '../components/MapView';

const styleSchema = z.object({
  name: z.string().min(1, 'Style name is required').max(50, 'Style name is too long'),
  description: z.string().max(200, 'Description is too long').optional(),
  styleJson: z.string().min(1, 'Style JSON is required')
});

type StyleFormData = z.infer<typeof styleSchema>;

interface MapStyle {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const MapStyles: React.FC = () => {
  const [styles, setStyles] = useState<MapStyle[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [previewStyle, setPreviewStyle] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [styleJson, setStyleJson] = useState<string>('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<StyleFormData>({
    resolver: zodResolver(styleSchema)
  });

  // Load sample styles on initial render
  useEffect(() => {
    // In a real app, this would fetch from an API
    const mockStyles: MapStyle[] = [
      {
        id: 'default',
        name: 'Default OSM',
        description: 'Standard OpenStreetMap style',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      },
      {
        id: 'dark',
        name: 'Dark Mode',
        description: 'Dark theme for night viewing',
        createdAt: '2023-02-15T00:00:00Z',
        updatedAt: '2023-02-15T00:00:00Z'
      },
      {
        id: 'satellite',
        name: 'Satellite',
        description: 'Satellite imagery with labels',
        createdAt: '2023-03-20T00:00:00Z',
        updatedAt: '2023-03-20T00:00:00Z'
      }
    ];
    setStyles(mockStyles);
  }, []);

  const onSubmit = async (data: StyleFormData) => {
    setSubmitStatus('saving');
    
    // Simulate API call to save style
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add the new style to the list (in a real app, this would come from the API)
      const newStyle: MapStyle = {
        id: data.name.toLowerCase().replace(/\s+/g, '-'),
        name: data.name,
        description: data.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setStyles(prevStyles => [...prevStyles, newStyle]);
      setSubmitStatus('success');
      reset();
      
      // Reset status after a delay
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error saving style:', error);
      setSubmitStatus('error');
      
      // Reset status after a delay
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setStyleJson(content);
      
      // Validate that it's a valid JSON
      try {
        JSON.parse(content);
      } catch (error) {
        console.error('Invalid JSON file:', error);
        // Handle invalid JSON
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteStyle = (id: string) => {
    // In a real app, this would be an API call
    setStyles(prevStyles => prevStyles.filter(style => style.id !== id));
    
    if (selectedStyle === id) {
      setSelectedStyle(null);
    }
    
    if (previewStyle === id) {
      setPreviewStyle(null);
      setShowPreview(false);
    }
  };

  const handlePreviewStyle = (id: string) => {
    setPreviewStyle(id);
    setShowPreview(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Map Styles</h1>
        <p className="mt-2 text-gray-600">
          Manage and customize map styles for your tile server
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Palette className="h-5 w-5 text-green-600 mr-2" />
                Available Styles
              </h2>

              {styles.length === 0 ? (
                <p className="text-gray-500">No styles available. Upload your first map style.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Last Updated
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {styles.map((style) => (
                        <tr key={style.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{style.name}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">{style.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(style.updatedAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handlePreviewStyle(style.id)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setSelectedStyle(style.id)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStyle(style.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {showPreview && (
            <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Eye className="h-5 w-5 text-blue-600 mr-2" />
                  Style Preview
                </h2>
                <div className="h-96">
                  <MapView 
                    style="vector"
                    customStyle={previewStyle ? `/api/styles/${previewStyle}/style.json` : undefined}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Upload className="h-5 w-5 text-purple-600 mr-2" />
                {selectedStyle ? 'Edit Style' : 'Upload New Style'}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Style Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register('name')}
                      className={`block w-full rounded-md border ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description (optional)
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      {...register('description')}
                      className={`block w-full rounded-md border ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="styleFile" className="block text-sm font-medium text-gray-700 mb-1">
                      Style JSON File
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="styleFile"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="styleFile"
                              name="styleFile"
                              type="file"
                              accept=".json"
                              className="sr-only"
                              onChange={handleFileUpload}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">JSON files only</p>
                      </div>
                    </div>
                  </div>

                  <div className="hidden">
                    <textarea
                      id="styleJson"
                      {...register('styleJson')}
                      value={styleJson}
                      onChange={(e) => setStyleJson(e.target.value)}
                    />
                    {errors.styleJson && (
                      <p className="mt-1 text-sm text-red-600">{errors.styleJson.message}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  {submitStatus === 'success' && (
                    <div className="bg-green-50 p-4 rounded-md mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-800">
                            Style saved successfully!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="bg-red-50 p-4 rounded-md mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Trash2 className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-red-800">
                            Failed to save style. Please try again.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitStatus === 'saving'}
                    className={`w-full inline-flex justify-center items-center rounded-md border border-transparent ${
                      submitStatus === 'saving' ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                    } py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                  >
                    {submitStatus === 'saving' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        {selectedStyle ? 'Update Style' : 'Upload Style'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapStyles;
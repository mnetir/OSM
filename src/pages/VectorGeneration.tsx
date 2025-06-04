import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Database, Layers, RefreshCw, Check, AlertTriangle, Download } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

const generationSchema = z.object({
  minZoom: z.coerce.number().int().min(0).max(19, 'Min zoom must be between 0 and 19'),
  maxZoom: z.coerce.number().int().min(0).max(19, 'Max zoom must be between 0 and 19'),
  bounds: z.object({
    west: z.coerce.number().min(-180).max(180, 'West bound must be between -180 and 180'),
    south: z.coerce.number().min(-90).max(90, 'South bound must be between -90 and 90'),
    east: z.coerce.number().min(-180).max(180, 'East bound must be between -180 and 180'),
    north: z.coerce.number().min(-90).max(90, 'North bound must be between -90 and 90')
  }),
  filename: z.string().min(1, 'Filename is required'),
  includeCategories: z.array(z.string()).min(1, 'At least one category must be selected')
});

type GenerationFormData = z.infer<typeof generationSchema>;

// Mock data for category selection
const osmCategories = [
  { id: 'roads', name: 'Roads' },
  { id: 'buildings', name: 'Buildings' },
  { id: 'water', name: 'Water Bodies' },
  { id: 'landuse', name: 'Land Use' },
  { id: 'places', name: 'Places' },
  { id: 'poi', name: 'Points of Interest' },
  { id: 'railways', name: 'Railways' },
  { id: 'boundaries', name: 'Administrative Boundaries' }
];

const VectorGeneration: React.FC = () => {
  const { settings } = useSettings();
  const [status, setStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [progressPercent, setProgressPercent] = useState(0);
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<GenerationFormData>({
    resolver: zodResolver(generationSchema),
    defaultValues: {
      minZoom: 0,
      maxZoom: 14,
      bounds: {
        west: 44.0, // Iran approximate bounds
        south: 25.0,
        east: 63.0,
        north: 40.0
      },
      filename: 'iran-osm',
      includeCategories: osmCategories.map(c => c.id)
    }
  });

  const onSubmit = async (data: GenerationFormData) => {
    setStatus('generating');
    setProgressPercent(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgressPercent(prev => {
        const newProgress = prev + Math.random() * 5;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 500);
    
    try {
      // Simulate API call to generate vector tiles
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      clearInterval(progressInterval);
      setProgressPercent(100);
      setStatus('success');
      
      // Add the generated file to the list
      const newFile = `${data.filename}.mbtiles`;
      setGeneratedFiles(prev => [newFile, ...prev].slice(0, 10)); // Keep only the last 10 files
    } catch (error) {
      console.error('Error generating vector tiles:', error);
      clearInterval(progressInterval);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Vector Tile Generation</h1>
        <p className="mt-2 text-gray-600">
          Generate MBTiles from OSM database for faster vector tile serving
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Layers className="h-5 w-5 text-purple-600 mr-2" />
                Generate Vector Tiles
              </h2>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="minZoom" className="block text-sm font-medium text-gray-700 mb-1">
                      Min Zoom Level
                    </label>
                    <input
                      type="number"
                      id="minZoom"
                      min="0"
                      max="19"
                      {...register('minZoom')}
                      className={`block w-full rounded-md border ${
                        errors.minZoom ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                    />
                    {errors.minZoom && (
                      <p className="mt-1 text-sm text-red-600">{errors.minZoom.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="maxZoom" className="block text-sm font-medium text-gray-700 mb-1">
                      Max Zoom Level
                    </label>
                    <input
                      type="number"
                      id="maxZoom"
                      min="0"
                      max="19"
                      {...register('maxZoom')}
                      className={`block w-full rounded-md border ${
                        errors.maxZoom ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                    />
                    {errors.maxZoom && (
                      <p className="mt-1 text-sm text-red-600">{errors.maxZoom.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="filename" className="block text-sm font-medium text-gray-700 mb-1">
                      Output Filename
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="filename"
                        {...register('filename')}
                        className={`block w-full rounded-l-md border ${
                          errors.filename ? 'border-red-300' : 'border-gray-300'
                        } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                      />
                      <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        .mbtiles
                      </span>
                    </div>
                    {errors.filename && (
                      <p className="mt-1 text-sm text-red-600">{errors.filename.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <fieldset>
                      <legend className="block text-sm font-medium text-gray-700 mb-1">
                        Geographic Bounds
                      </legend>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="bounds.west" className="block text-xs text-gray-500 mb-1">
                            West
                          </label>
                          <input
                            type="number"
                            id="bounds.west"
                            step="0.000001"
                            {...register('bounds.west')}
                            className={`block w-full rounded-md border ${
                              errors.bounds?.west ? 'border-red-300' : 'border-gray-300'
                            } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                          />
                          {errors.bounds?.west && (
                            <p className="mt-1 text-xs text-red-600">{errors.bounds.west.message}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="bounds.east" className="block text-xs text-gray-500 mb-1">
                            East
                          </label>
                          <input
                            type="number"
                            id="bounds.east"
                            step="0.000001"
                            {...register('bounds.east')}
                            className={`block w-full rounded-md border ${
                              errors.bounds?.east ? 'border-red-300' : 'border-gray-300'
                            } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                          />
                          {errors.bounds?.east && (
                            <p className="mt-1 text-xs text-red-600">{errors.bounds.east.message}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="bounds.south" className="block text-xs text-gray-500 mb-1">
                            South
                          </label>
                          <input
                            type="number"
                            id="bounds.south"
                            step="0.000001"
                            {...register('bounds.south')}
                            className={`block w-full rounded-md border ${
                              errors.bounds?.south ? 'border-red-300' : 'border-gray-300'
                            } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                          />
                          {errors.bounds?.south && (
                            <p className="mt-1 text-xs text-red-600">{errors.bounds.south.message}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="bounds.north" className="block text-xs text-gray-500 mb-1">
                            North
                          </label>
                          <input
                            type="number"
                            id="bounds.north"
                            step="0.000001"
                            {...register('bounds.north')}
                            className={`block w-full rounded-md border ${
                              errors.bounds?.north ? 'border-red-300' : 'border-gray-300'
                            } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                          />
                          {errors.bounds?.north && (
                            <p className="mt-1 text-xs text-red-600">{errors.bounds.north.message}</p>
                          )}
                        </div>
                      </div>
                    </fieldset>
                  </div>

                  <div className="sm:col-span-2">
                    <fieldset>
                      <legend className="block text-sm font-medium text-gray-700 mb-1">
                        Include Categories
                      </legend>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {osmCategories.map((category) => (
                          <div key={category.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`category-${category.id}`}
                              value={category.id}
                              {...register('includeCategories')}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor={`category-${category.id}`}
                              className="ml-2 block text-sm text-gray-700"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                      {errors.includeCategories && (
                        <p className="mt-1 text-sm text-red-600">{errors.includeCategories.message}</p>
                      )}
                    </fieldset>
                  </div>
                </div>

                <div className="mt-8">
                  {status === 'generating' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Generating vector tiles...</span>
                        <span className="text-sm font-medium text-gray-700">{Math.round(progressPercent)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {status === 'success' && (
                    <div className="bg-green-50 p-4 rounded-md mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">Generation complete</h3>
                          <div className="mt-2 text-sm text-green-700">
                            <p>Vector tiles have been successfully generated.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="bg-red-50 p-4 rounded-md mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Generation failed</h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>An error occurred while generating vector tiles. Please try again.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'generating'}
                    className={`inline-flex justify-center items-center rounded-md border border-transparent ${
                      status === 'generating' ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                    } py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
                  >
                    {status === 'generating' ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Layers className="h-4 w-4 mr-2" />
                        Generate Vector Tiles
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Database className="h-5 w-5 text-blue-600 mr-2" />
                Recent MBTiles
              </h2>

              {generatedFiles.length === 0 ? (
                <p className="text-gray-500 text-sm">No files generated yet</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {generatedFiles.map((file, index) => (
                    <li key={index} className="py-3 flex justify-between items-center">
                      <span className="text-sm text-gray-800">{file}</span>
                      <button
                        type="button"
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6 bg-blue-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-blue-800">Storage Location</h3>
                <p className="mt-1 text-sm text-blue-700">
                  MBTiles are stored at: <span className="font-mono">{settings?.mbtilePath || '/data/mbtiles'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VectorGeneration;
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Database, MapPin, User, Lock } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

const settingsSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  database: z.object({
    host: z.string().min(1, 'Host is required'),
    port: z.coerce.number().int().positive('Port must be a positive number'),
    user: z.string().min(1, 'Database user is required'),
    password: z.string().min(1, 'Database password is required'),
    database: z.string().min(1, 'Database name is required')
  }),
  tileServerUrl: z.string().min(1, 'Tile server URL is required'),
  defaultZoom: z.coerce.number().int().min(0).max(19, 'Zoom must be between 0 and 19'),
  defaultCenter: z.tuple([
    z.coerce.number().min(-180).max(180, 'Longitude must be between -180 and 180'),
    z.coerce.number().min(-90).max(90, 'Latitude must be between -90 and 90')
  ]),
  mbtilePath: z.string().min(1, 'MBTiles path is required')
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const Settings: React.FC = () => {
  const { settings, saveSettings } = useSettings();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'general' | 'database' | 'map'>('general');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      username: '',
      password: '',
      database: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: '',
        database: 'gis'
      },
      tileServerUrl: 'http://localhost:8080',
      defaultZoom: 10,
      defaultCenter: [51.5, 35.7], // Default center of Iran
      mbtilePath: '/data/mbtiles'
    }
  });

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const onSubmit = async (data: SettingsFormData) => {
    setSaveStatus('saving');
    try {
      await saveSettings(data);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Configure your OSM Manager application settings
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-4 py-3 font-medium text-sm focus:outline-none ${
              activeTab === 'general'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm focus:outline-none ${
              activeTab === 'database'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('database')}
          >
            Database
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm focus:outline-none ${
              activeTab === 'map'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('map')}
          >
            Map Settings
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <h3 className="text-sm font-medium text-blue-800">
                  Authentication Settings
                </h3>
                <p className="mt-1 text-sm text-blue-700">
                  These credentials will be used to access the management section of the application.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    {...register('username')}
                    className={`block w-full rounded-md border ${
                      errors.username ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Lock className="h-4 w-4 mr-1" />
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    {...register('password')}
                    className={`block w-full rounded-md border ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="mbtilePath" className="block text-sm font-medium text-gray-700 mb-1">
                    MBTiles Storage Path
                  </label>
                  <input
                    type="text"
                    id="mbtilePath"
                    {...register('mbtilePath')}
                    className={`block w-full rounded-md border ${
                      errors.mbtilePath ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  />
                  {errors.mbtilePath && (
                    <p className="mt-1 text-sm text-red-600">{errors.mbtilePath.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Path where generated MBTiles will be stored
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="bg-purple-50 p-4 rounded-md mb-6">
                <h3 className="text-sm font-medium text-purple-800 flex items-center">
                  <Database className="h-4 w-4 mr-1" />
                  Database Connection
                </h3>
                <p className="mt-1 text-sm text-purple-700">
                  Configure the connection to your OSM PostgreSQL database.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="database.host" className="block text-sm font-medium text-gray-700 mb-1">
                    Host
                  </label>
                  <input
                    type="text"
                    id="database.host"
                    {...register('database.host')}
                    className={`block w-full rounded-md border ${
                      errors.database?.host ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  />
                  {errors.database?.host && (
                    <p className="mt-1 text-sm text-red-600">{errors.database.host.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="database.port" className="block text-sm font-medium text-gray-700 mb-1">
                    Port
                  </label>
                  <input
                    type="number"
                    id="database.port"
                    {...register('database.port')}
                    className={`block w-full rounded-md border ${
                      errors.database?.port ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  />
                  {errors.database?.port && (
                    <p className="mt-1 text-sm text-red-600">{errors.database.port.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="database.user" className="block text-sm font-medium text-gray-700 mb-1">
                    User
                  </label>
                  <input
                    type="text"
                    id="database.user"
                    {...register('database.user')}
                    className={`block w-full rounded-md border ${
                      errors.database?.user ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  />
                  {errors.database?.user && (
                    <p className="mt-1 text-sm text-red-600">{errors.database.user.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="database.password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="database.password"
                    {...register('database.password')}
                    className={`block w-full rounded-md border ${
                      errors.database?.password ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  />
                  {errors.database?.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.database.password.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="database.database" className="block text-sm font-medium text-gray-700 mb-1">
                    Database Name
                  </label>
                  <input
                    type="text"
                    id="database.database"
                    {...register('database.database')}
                    className={`block w-full rounded-md border ${
                      errors.database?.database ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  />
                  {errors.database?.database && (
                    <p className="mt-1 text-sm text-red-600">{errors.database.database.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-md mb-6">
                <h3 className="text-sm font-medium text-green-800 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Map Settings
                </h3>
                <p className="mt-1 text-sm text-green-700">
                  Configure default map view settings and tile server URL.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="tileServerUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Tile Server URL
                  </label>
                  <input
                    type="text"
                    id="tileServerUrl"
                    {...register('tileServerUrl')}
                    className={`block w-full rounded-md border ${
                      errors.tileServerUrl ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  />
                  {errors.tileServerUrl && (
                    <p className="mt-1 text-sm text-red-600">{errors.tileServerUrl.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    URL of the OSM tile server (e.g., http://localhost:8080)
                  </p>
                </div>

                <div>
                  <label htmlFor="defaultZoom" className="block text-sm font-medium text-gray-700 mb-1">
                    Default Zoom Level
                  </label>
                  <input
                    type="number"
                    id="defaultZoom"
                    min="0"
                    max="19"
                    {...register('defaultZoom')}
                    className={`block w-full rounded-md border ${
                      errors.defaultZoom ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  />
                  {errors.defaultZoom && (
                    <p className="mt-1 text-sm text-red-600">{errors.defaultZoom.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <fieldset>
                    <legend className="block text-sm font-medium text-gray-700 mb-1">
                      Default Center (Longitude, Latitude)
                    </legend>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="defaultCenter.0" className="sr-only">
                          Longitude
                        </label>
                        <input
                          type="number"
                          id="defaultCenter.0"
                          step="0.000001"
                          placeholder="Longitude"
                          {...register('defaultCenter.0')}
                          className={`block w-full rounded-md border ${
                            errors.defaultCenter?.[0] ? 'border-red-300' : 'border-gray-300'
                          } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                        />
                        {errors.defaultCenter?.[0] && (
                          <p className="mt-1 text-sm text-red-600">{errors.defaultCenter[0].message}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="defaultCenter.1" className="sr-only">
                          Latitude
                        </label>
                        <input
                          type="number"
                          id="defaultCenter.1"
                          step="0.000001"
                          placeholder="Latitude"
                          {...register('defaultCenter.1')}
                          className={`block w-full rounded-md border ${
                            errors.defaultCenter?.[1] ? 'border-red-300' : 'border-gray-300'
                          } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                        />
                        {errors.defaultCenter?.[1] && (
                          <p className="mt-1 text-sm text-red-600">{errors.defaultCenter[1].message}</p>
                        )}
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-5 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!isDirty || saveStatus === 'saving'}
                className={`ml-3 inline-flex justify-center items-center rounded-md border border-transparent ${
                  !isDirty ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                {saveStatus === 'saving' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
            
            {saveStatus === 'success' && (
              <div className="mt-2 text-sm text-green-600">
                Settings saved successfully!
              </div>
            )}
            
            {saveStatus === 'error' && (
              <div className="mt-2 text-sm text-red-600">
                An error occurred while saving settings.
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
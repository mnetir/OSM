import React from 'react';
import { MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <MapPin className="h-6 w-6 text-blue-400" />
            <span className="ml-2 text-lg font-semibold">OSM Manager</span>
          </div>
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} OSM Manager. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
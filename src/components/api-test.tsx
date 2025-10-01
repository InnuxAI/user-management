// Test API connectivity directly
"use client";

import { useState, useEffect } from 'react';

export function APITest() {
  const [apiStatus, setApiStatus] = useState('Testing...');
  const [projects, setProjects] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('🧪 Testing API connectivity...');
        
        // Test health endpoint first
        const healthResponse = await fetch('http://localhost:8000/api/v1/health');
        const healthData = await healthResponse.json();
        console.log('❤️ Health check:', healthData);

        if (healthResponse.ok) {
          setApiStatus('Backend connected ✅');
          
          // Test projects endpoint
          const projectsResponse = await fetch('http://localhost:8000/api/v1/projects');
          const projectsData = await projectsResponse.json();
          console.log('📊 Projects data:', projectsData);
          
          if (projectsResponse.ok) {
            setProjects(projectsData);
          } else {
            throw new Error(`Projects API failed: ${projectsData.message}`);
          }
        } else {
          throw new Error(`Health check failed: ${healthData.message}`);
        }
        
      } catch (error) {
        console.error('❌ API test failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(errorMessage);
        setApiStatus('Backend connection failed ❌');
      }
    };

    testAPI();
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-slate-50 mb-4">
      <h3 className="font-bold mb-2">🔧 API Connectivity Test</h3>
      <p><strong>Status:</strong> {apiStatus}</p>
      
      {error && (
        <p className="text-red-600 mt-2"><strong>Error:</strong> {error}</p>
      )}
      
      {projects && (
        <div className="mt-4">
          <p><strong>Projects found:</strong> {projects.data?.length || 0}</p>
          <pre className="bg-gray-100 p-2 rounded text-xs mt-2 overflow-auto max-h-40">
            {JSON.stringify(projects, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
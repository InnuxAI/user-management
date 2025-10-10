// Test API connectivity directly
"use client";

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { LordIcon, LORDICON_URLS } from "@/components/ui/lord-icon";

export function APITest() {
  const [apiStatus, setApiStatus] = useState('Testing...');
  const [projects, setProjects] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fastapiUrl = process.env.FASTAPI_URL || "http://localhost:8001";
  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('[TEST] API connectivity...');
        
        // Test health endpoint first
        const healthResponse = await fetch(`${fastapiUrl}/api/v1/health`);
        const healthData = await healthResponse.json();
        console.log('[HEALTH] Check:', healthData);

        if (healthResponse.ok) {
          setApiStatus('Backend connected ✓');
          
          // Test projects endpoint
          const projectsResponse = await fetch(`${fastapiUrl}/api/v1/projects`);
          const projectsData = await projectsResponse.json();
          console.log('[PROJECTS] Data:', projectsData);
          
          if (projectsResponse.ok) {
            setProjects(projectsData);
          } else {
            throw new Error(`Projects API failed: ${projectsData.message}`);
          }
        } else {
          throw new Error(`Health check failed: ${healthData.message}`);
        }
        
      } catch (error) {
        console.error('[ERROR] API test failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(errorMessage);
        setApiStatus('Backend connection failed ✗');
      }
    };

    testAPI();
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-slate-50 mb-4">
      <h3 className="font-bold mb-2 flex items-center gap-2">
        <LordIcon src={LORDICON_URLS.settings} size={20} trigger="hover" />
        API Connectivity Test
      </h3>
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
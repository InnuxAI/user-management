import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { DocumentUpdate, RFQUpdate, SystemUpdate } from '@/lib/api';

interface RealTimeContextType {
  // Connection status
  isConnected: boolean;
  connectionState: 'connecting' | 'connected' | 'disconnected' | 'error';
  
  // Real-time data
  documentUpdates: DocumentUpdate[];
  rfqUpdates: RFQUpdate[];
  systemUpdates: SystemUpdate[];
  
  // Methods
  subscribeToRFQ: (rfqId: string) => void;
  unsubscribeFromRFQ: () => void;
  clearUpdates: () => void;
  
  // Document processing state
  processingDocuments: Set<string>;
}

const RealTimeContext = createContext<RealTimeContextType | null>(null);

interface RealTimeProviderProps {
  children: ReactNode;
}

export const RealTimeProvider: React.FC<RealTimeProviderProps> = ({ children }) => {
  const [documentUpdates, setDocumentUpdates] = useState<DocumentUpdate[]>([]);
  const [rfqUpdates, setRFQUpdates] = useState<RFQUpdate[]>([]);
  const [systemUpdates, setSystemUpdates] = useState<SystemUpdate[]>([]);
  const [processingDocuments, setProcessingDocuments] = useState<Set<string>>(new Set());
  const [currentRFQId, setCurrentRFQId] = useState<string | null>(null);

  // Check if WebSocket should be enabled (can be controlled via environment variable)
  const isWebSocketEnabled = process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET !== 'false';

  // Main dashboard WebSocket connection - with error handling
  const {
    isConnected: dashboardConnected,
    connectionState: dashboardState
  } = useWebSocket(isWebSocketEnabled ? '/ws/dashboard' : '', {
    onSystemUpdate: (data: SystemUpdate) => {
      setSystemUpdates(prev => [data, ...prev.slice(0, 49)]); // Keep last 50
    },
    autoReconnect: false // Disable auto-reconnect for now to avoid spam
  });

  // Document processing WebSocket connection - with error handling
  const {
    isConnected: documentsConnected,
    connectionState: documentsState
  } = useWebSocket(isWebSocketEnabled ? '/ws/documents' : '', {
    onDocumentUpdate: (data: DocumentUpdate) => {
      setDocumentUpdates(prev => [data, ...prev.slice(0, 99)]); // Keep last 100
      
      // Update processing state
      setProcessingDocuments(prev => {
        const newSet = new Set(prev);
        
        if (data.status === 'processing') {
          newSet.add(data.document_id);
        } else {
          newSet.delete(data.document_id);
        }
        
        return newSet;
      });
    },
    autoReconnect: false // Disable auto-reconnect for now to avoid spam
  });

  // RFQ-specific WebSocket connection (only when needed)
  const rfqWebSocketUrl = isWebSocketEnabled && currentRFQId ? `/ws/rfq/${currentRFQId}` : null;
  
  const {
    isConnected: rfqConnected,
    connectionState: rfqState
  } = useWebSocket(
    rfqWebSocketUrl || '',
    {
      onRFQUpdate: (data: RFQUpdate) => {
        setRFQUpdates(prev => [data, ...prev.slice(0, 49)]); // Keep last 50
      },
      autoReconnect: false // Disable auto-reconnect for now to avoid spam
    }
  );

  // Overall connection status (connected if any WebSocket is connected)
  const isConnected = dashboardConnected || documentsConnected || rfqConnected;
  
  // Overall connection state (prioritize connected > connecting > error > disconnected)
  const connectionState = (() => {
    if (dashboardState === 'connected' || documentsState === 'connected' || rfqState === 'connected') {
      return 'connected';
    }
    if (dashboardState === 'connecting' || documentsState === 'connecting' || rfqState === 'connecting') {
      return 'connecting';
    }
    if (dashboardState === 'error' || documentsState === 'error' || rfqState === 'error') {
      return 'error';
    }
    return 'disconnected';
  })();

  const subscribeToRFQ = (rfqId: string) => {
    console.log('Subscribing to RFQ:', rfqId);
    setCurrentRFQId(rfqId);
  };

  const unsubscribeFromRFQ = () => {
    console.log('Unsubscribing from RFQ');
    setCurrentRFQId(null);
  };

  const clearUpdates = () => {
    setDocumentUpdates([]);
    setRFQUpdates([]);
    setSystemUpdates([]);
    setProcessingDocuments(new Set());
  };

  // Auto-subscribe to RFQ based on current page (you can customize this logic)
  useEffect(() => {
    // This could be enhanced to automatically detect current RFQ from URL
    // For now, it's manually controlled
  }, []);

  const value: RealTimeContextType = {
    isConnected,
    connectionState,
    documentUpdates,
    rfqUpdates,
    systemUpdates,
    processingDocuments,
    subscribeToRFQ,
    unsubscribeFromRFQ,
    clearUpdates
  };

  return (
    <RealTimeContext.Provider value={value}>
      {children}
    </RealTimeContext.Provider>
  );
};

export const useRealTime = (): RealTimeContextType => {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error('useRealTime must be used within a RealTimeProvider');
  }
  return context;
};

// Helper hooks for specific use cases
export const useDocumentProcessing = () => {
  const { documentUpdates, processingDocuments } = useRealTime();
  
  return {
    recentUpdates: documentUpdates.slice(0, 10),
    processingDocuments,
    isProcessing: processingDocuments.size > 0
  };
};

export const useRFQStatus = (rfqId?: string) => {
  const { rfqUpdates, subscribeToRFQ, unsubscribeFromRFQ } = useRealTime();
  
  useEffect(() => {
    if (rfqId) {
      subscribeToRFQ(rfqId);
      return () => unsubscribeFromRFQ();
    }
  }, [rfqId, subscribeToRFQ, unsubscribeFromRFQ]);
  
  const relevantUpdates = rfqId 
    ? rfqUpdates.filter(update => update.rfq_id === rfqId)
    : rfqUpdates;
  
  return {
    updates: relevantUpdates.slice(0, 10),
    latestStatus: relevantUpdates[0] || null
  };
};

export const useSystemStatus = () => {
  const { systemUpdates, isConnected, connectionState } = useRealTime();
  
  return {
    recentUpdates: systemUpdates.slice(0, 5),
    isConnected,
    connectionState,
    lastEmailProcessed: systemUpdates.find(update => 
      update.email_subject && update.rfq_detected
    ) || null
  };
};
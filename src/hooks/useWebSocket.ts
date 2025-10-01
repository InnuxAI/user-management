import { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface WebSocketMessage {
  event_type: string;
  data: any;
  timestamp: string;
  target: string;
}

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onDocumentUpdate?: (data: any) => void;
  onRFQUpdate?: (data: any) => void;
  onSystemUpdate?: (data: any) => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  sendMessage: (message: any) => void;
  lastMessage: WebSocketMessage | null;
  connectionState: 'connecting' | 'connected' | 'disconnected' | 'error';
}

export const useWebSocket = (
  url: string,
  options: UseWebSocketOptions = {}
): UseWebSocketReturn => {
  const {
    onMessage,
    onDocumentUpdate,
    onRFQUpdate,
    onSystemUpdate,
    autoReconnect = true,
    reconnectInterval = 5000
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // Store callback refs to avoid recreating the connect function
  const callbacksRef = useRef({
    onMessage,
    onDocumentUpdate,
    onRFQUpdate,
    onSystemUpdate
  });

  // Update callback refs when callbacks change
  useEffect(() => {
    callbacksRef.current = {
      onMessage,
      onDocumentUpdate,
      onRFQUpdate,
      onSystemUpdate
    };
  }, [onMessage, onDocumentUpdate, onRFQUpdate, onSystemUpdate]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.CONNECTING || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    // Check if WebSocket is supported
    if (typeof WebSocket === 'undefined') {
      console.warn('WebSocket not supported in this environment');
      setConnectionState('error');
      return;
    }

    // Skip connection if URL is empty or invalid
    if (!url || !url.trim()) {
      console.warn('WebSocket URL is empty or invalid:', url);
      setConnectionState('disconnected');
      return;
    }

    setConnectionState('connecting');
    
    try {
      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close();
      }

      // Create WebSocket URL (handle both HTTP and HTTPS)
      const wsUrl = url.startsWith('ws') 
        ? url 
        : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:8000${url}`;
      
      console.log('Attempting WebSocket connection to:', wsUrl);
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected:', url);
        setIsConnected(true);
        setConnectionState('connected');
        reconnectAttemptsRef.current = 0;
        
        // Show connection success for important connections
        if (url.includes('documents') || url.includes('dashboard')) {
          toast.success('Real-time updates connected', { 
            duration: 2000 
          });
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket disconnected:', url, event.code, event.reason);
        setIsConnected(false);
        setConnectionState('disconnected');
        wsRef.current = null;

        // Auto-reconnect logic
        if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setConnectionState('error');
          toast.error('Connection lost. Please refresh the page.', {
            duration: 5000
          });
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', {
          url: wsUrl,
          error: error || 'Unknown WebSocket error',
          readyState: wsRef.current?.readyState
        });
        setConnectionState('error');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('WebSocket message received:', message);
          
          setLastMessage(message);

          // Use current callback refs to avoid stale closures
          const callbacks = callbacksRef.current;

          // Call the generic onMessage handler
          callbacks.onMessage?.(message);

          // Call specific handlers based on event type
          switch (message.event_type) {
            case 'document_processing_started':
            case 'document_processing_completed':
            case 'document_processing_failed':
              callbacks.onDocumentUpdate?.(message.data);
              handleDocumentNotification(message);
              break;
            
            case 'rfq_status_updated':
            case 'vendor_selection_completed':
              callbacks.onRFQUpdate?.(message.data);
              handleRFQNotification(message);
              break;
            
            case 'system_status':
            case 'new_email_processed':
              callbacks.onSystemUpdate?.(message.data);
              handleSystemNotification(message);
              break;
            
            case 'connection_established':
              console.log('WebSocket connection established:', message.data);
              break;
            
            default:
              console.log('Unknown message type:', message.event_type, message);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error, event.data);
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', {
        url,
        error: error instanceof Error ? error.message : String(error)
      });
      setConnectionState('error');
    }
  }, [url, autoReconnect, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionState('disconnected');
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }, []);

  // Handle document processing notifications
  const handleDocumentNotification = (message: WebSocketMessage) => {
    const { data, event_type } = message;
    
    switch (event_type) {
      case 'document_processing_started':
        toast.info(`Processing document: ${data.filename}`, {
          description: `RFQ ${data.rfq_id} - ${data.vendor_id}`,
          duration: 3000
        });
        break;
      
      case 'document_processing_completed':
        toast.success(`Document processed: ${data.filename}`, {
          description: `Score: ${data.score ? data.score + '/10' : 'N/A'} - ${data.vendor_id}`,
          duration: 4000
        });
        break;
      
      case 'document_processing_failed':
        toast.error(`Failed to process: ${data.filename}`, {
          description: `Error: ${data.error}`,
          duration: 5000
        });
        break;
    }
  };

  // Handle RFQ notifications
  const handleRFQNotification = (message: WebSocketMessage) => {
    const { data, event_type } = message;
    
    switch (event_type) {
      case 'rfq_status_updated':
        toast.info(`RFQ ${data.rfq_id} updated`, {
          description: `${data.completion_percentage}% complete`,
          duration: 3000
        });
        break;
      
      case 'vendor_selection_completed':
        toast.success(`Vendor selected for ${data.rfq_id}`, {
          description: `Selected: ${data.selected_vendor?.name || 'Unknown'}`,
          duration: 5000
        });
        break;
    }
  };

  // Handle system notifications
  const handleSystemNotification = (message: WebSocketMessage) => {
    const { data, event_type } = message;
    
    switch (event_type) {
      case 'new_email_processed':
        if (data.rfq_detected) {
          toast.info(`New email processed`, {
            description: `${data.attachment_count} attachments from ${data.sender}`,
            duration: 3000
          });
        }
        break;
      
      case 'system_status':
        if (data.status !== 'healthy') {
          toast.warning('System status update', {
            description: `Status: ${data.status}`,
            duration: 4000
          });
        }
        break;
    }
  };

  // Connect on mount (only if URL is provided)
  useEffect(() => {
    if (url && url.trim()) {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [url, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    isConnected,
    sendMessage,
    lastMessage,
    connectionState
  };
};
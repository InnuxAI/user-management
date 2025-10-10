import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Wifi, WifiOff, AlertCircle, Loader2 } from 'lucide-react';
import { useRealTime } from '@/contexts/RealTimeContext';
import { LordIcon, LORDICON_URLS } from '@/components/ui/lord-icon';

interface ConnectionStatusProps {
  showText?: boolean;
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  showText = false,
  className = ""
}) => {
  const { isConnected, connectionState } = useRealTime();

  const getStatusIcon = () => {
    switch (connectionState) {
      case 'connected':
        // return <Wifi className="h-3 w-3 text-green-600" />;
        return <LordIcon src={LORDICON_URLS.wifi} size={12} trigger="hover" colors="primary:green"/>
      case 'connecting':
        return <Loader2 className="h-3 w-3 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-600" />;
      default:
        return <WifiOff className="h-3 w-3 text-gray-600" />;
    }
  };

  const getStatusText = () => {
    switch (connectionState) {
      case 'connected':
        return 'Live Updates';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Connection Error';
      default:
        return 'Offline';
    }
  };

  const getStatusColor = () => {
    switch (connectionState) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'connecting':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTooltipContent = () => {
    switch (connectionState) {
      case 'connected':
        return 'Real-time updates are active. You\'ll see live document processing and RFQ updates.';
      case 'connecting':
        return 'Establishing connection for real-time updates...';
      case 'error':
        return 'Connection failed. Real-time updates are not available. Try refreshing the page.';
      default:
        return 'Real-time updates are not connected. Some features may not update automatically.';
    }
  };

  const content = (
    <Badge 
      variant="outline" 
      className={`flex items-center gap-1.5 px-2 py-1 ${getStatusColor()} ${className}`}
    >
      {getStatusIcon()}
      {showText && (
        <span className="text-xs font-medium">
          {getStatusText()}
        </span>
      )}
    </Badge>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">{getTooltipContent()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
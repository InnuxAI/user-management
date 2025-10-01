import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, FileText } from 'lucide-react';
import { useDocumentProcessing } from '@/contexts/RealTimeContext';

interface DocumentProcessingIndicatorProps {
  className?: string;
  showRecent?: boolean;
  maxRecent?: number;
}

export const DocumentProcessingIndicator: React.FC<DocumentProcessingIndicatorProps> = ({
  className = "",
  showRecent = true,
  maxRecent = 5
}) => {
  const { recentUpdates, processingDocuments, isProcessing } = useDocumentProcessing();

  if (!isProcessing && recentUpdates.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {/* Processing Status */}
      {isProcessing && (
        <div className="flex items-center gap-2 mb-3">
          <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
          <span className="text-sm text-blue-700 font-medium">
            Processing {processingDocuments.size} document{processingDocuments.size !== 1 ? 's' : ''}...
          </span>
        </div>
      )}

      {/* Recent Updates */}
      {showRecent && recentUpdates.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Activity</h4>
          <div className="space-y-2">
            {recentUpdates.slice(0, maxRecent).map((update, index) => (
              <DocumentUpdateItem key={index} update={update} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface DocumentUpdateItemProps {
  update: any; // DocumentUpdate type
}

const DocumentUpdateItem: React.FC<DocumentUpdateItemProps> = ({ update }) => {
  const getStatusIcon = () => {
    switch (update.status) {
      case 'processing':
        return <Loader2 className="h-3 w-3 text-blue-600 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3 text-green-600" />;
      case 'failed':
        return <XCircle className="h-3 w-3 text-red-600" />;
      default:
        return <FileText className="h-3 w-3 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (update.status) {
      case 'processing':
        return 'bg-blue-50 border-blue-200';
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (update.status) {
      case 'processing':
        return 'Processing...';
      case 'completed':
        return `Completed${update.score ? ` (${update.score}/10)` : ''}`;
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card className={`transition-all duration-200 ${getStatusColor()}`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {getStatusIcon()}
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-gray-900 truncate">
                {update.filename}
              </div>
              <div className="text-xs text-gray-600">
                {update.rfq_id} • {update.vendor_id}
              </div>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`text-xs ml-2 ${
              update.status === 'completed' ? 'text-green-700 bg-green-50' :
              update.status === 'failed' ? 'text-red-700 bg-red-50' :
              'text-blue-700 bg-blue-50'
            }`}
          >
            {getStatusText()}
          </Badge>
        </div>
        
        {update.status === 'processing' && (
          <div className="mt-2">
            <Progress value={undefined} className="h-1" />
          </div>
        )}
        
        {update.error && (
          <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border">
            Error: {update.error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Simplified version for header/navbar
export const DocumentProcessingBadge: React.FC = () => {
  const { processingDocuments, isProcessing } = useDocumentProcessing();

  if (!isProcessing) {
    return null;
  }

  return (
    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 animate-pulse">
      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
      Processing {processingDocuments.size}
    </Badge>
  );
};
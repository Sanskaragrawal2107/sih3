import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, TrendingUp, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { MaterialPrice } from '../../types';

interface MarketAnalysisTabProps {
  materialPrices: MaterialPrice[];
  isFetchingPrices: boolean;
}

export const MarketAnalysisTab: React.FC<MarketAnalysisTabProps> = ({
  materialPrices,
  isFetchingPrices,
}) => {
  const { t } = useLanguage();

  const suspiciousItems = materialPrices.filter(p => p.status === 'suspicious').length;
  const overpricedItems = materialPrices.filter(p => p.status === 'overpriced').length;
  const fairItems = materialPrices.filter(p => p.status === 'fair').length;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'suspicious':
        return 'border-red-500 bg-red-50 dark:bg-red-950/30';
      case 'overpriced':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-950/30';
      case 'underpriced':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30';
      case 'fair':
        return 'border-green-500 bg-green-50 dark:bg-green-950/30';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'suspicious':
        return <Badge variant="destructive" className="text-sm">⚠️ {t('suspicious').toUpperCase()}</Badge>;
      case 'overpriced':
        return <Badge variant="destructive" className="text-sm bg-orange-600">🔴 {t('overpriced').toUpperCase()}</Badge>;
      case 'underpriced':
        return <Badge variant="secondary" className="text-sm">🟡 {t('underpriced').toUpperCase()}</Badge>;
      case 'fair':
        return <Badge variant="default" className="text-sm bg-green-600">✅ {t('fair').toUpperCase()}</Badge>;
      default:
        return null;
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />;
      default:
        return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  if (isFetchingPrices && materialPrices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-lg font-semibold">{t('loading')}</p>
        <p className="text-sm text-muted-foreground mt-2">Fetching current market prices...</p>
      </div>
    );
  }

  if (materialPrices.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p className="text-lg text-muted-foreground">No material price data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Alerts */}
      {(suspiciousItems > 0 || overpricedItems > 0) && (
        <div className="space-y-3">
          {suspiciousItems > 0 && (
            <Alert variant="destructive" className="border-2">
              <AlertTriangle className="h-5 w-5" />
              <AlertDescription className="text-base font-semibold">
                ⚠️ <strong>{suspiciousItems}</strong> material(s) have SUSPICIOUS pricing (30%+ above market rate)
              </AlertDescription>
            </Alert>
          )}
          {overpricedItems > 0 && (
            <Alert className="border-2 border-orange-500 bg-orange-50">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <AlertDescription className="text-base font-semibold text-orange-800">
                🔴 <strong>{overpricedItems}</strong> material(s) are OVERPRICED (15-30% above market rate)
              </AlertDescription>
            </Alert>
          )}
          {fairItems > 0 && (
            <Alert className="border-2 border-green-500 bg-green-50">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-base font-semibold text-green-800">
                ✅ <strong>{fairItems}</strong> material(s) have FAIR pricing (within acceptable range)
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Material Price Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materialPrices.map((price, idx) => (
          <Card 
            key={idx} 
            className={`border-2 ${getStatusColor(price.status)} transition-all hover:shadow-lg`}
            style={{
              animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both`
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <CardTitle className="text-lg font-bold flex-1">
                  {price.material}
                </CardTitle>
                {getTrendIcon(price.trend)}
              </div>
              {price.status && (
                <div className="flex flex-wrap gap-2">
                  {getStatusBadge(price.status)}
                  {price.variance !== undefined && (
                    <Badge variant="outline" className="text-sm font-mono">
                      {price.variance > 0 ? '+' : ''}{price.variance.toFixed(1)}%
                    </Badge>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Market Rate */}
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  💹 {t('currentMarketRate')}
                </p>
                <p className="text-xl font-bold text-blue-600">
                  {price.currentPrice || 'N/A'}
                </p>
                <p className="text-xs text-gray-500 mt-1">{price.unit}</p>
                {price.priceRange && (
                  <p className="text-xs text-gray-500 mt-1">Range: {price.priceRange}</p>
                )}
              </div>

              {/* DPR Quoted Price (if available) */}
              {price.dprPrice && (
                <div className={`p-3 rounded-lg border ${
                  price.status === 'suspicious' ? 'bg-red-100 dark:bg-red-950/50 border-red-300' :
                  price.status === 'overpriced' ? 'bg-orange-100 dark:bg-orange-950/50 border-orange-300' :
                  'bg-green-100 dark:bg-green-950/50 border-green-300'
                }`}>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    📄 {t('dprQuotedPrice')}
                  </p>
                  <p className="text-xl font-bold">
                    ₹{price.dprPrice}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{price.dprUnit || price.unit}</p>
                </div>
              )}

              {/* Analysis */}
              {price.analysis && (
                <div className="text-xs leading-relaxed p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                  <p className="font-semibold mb-1">📊 {t('analysis')}:</p>
                  <p>{price.analysis}</p>
                </div>
              )}

              {/* Source & Update Time */}
              <div className="text-xs text-gray-500 space-y-1">
                <p><strong>Source:</strong> {price.source}</p>
                <p><strong>Updated:</strong> {price.lastUpdated}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

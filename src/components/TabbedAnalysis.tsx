import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, FileText, TrendingUp, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { DPRAnalysis, MaterialPrice, ComprehensiveAuditReport } from '../types';
import { DashboardTab } from './tabs/DashboardTab';
import { ReportTab } from './tabs/ReportTab';
import { MarketAnalysisTab } from './tabs/MarketAnalysisTab';
import { AuditTab } from './tabs/AuditTab';

interface TabbedAnalysisProps {
  analysis: DPRAnalysis;
  materialPrices: MaterialPrice[];
  isFetchingPrices: boolean;
  comprehensiveAudit: ComprehensiveAuditReport | null;
  isPerformingAudit: boolean;
}

export const TabbedAnalysis: React.FC<TabbedAnalysisProps> = ({
  analysis,
  materialPrices,
  isFetchingPrices,
  comprehensiveAudit,
  isPerformingAudit,
}) => {
  const { t } = useLanguage();

  return (
    <div className="w-full">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-blue-50 dark:bg-blue-950">
          <TabsTrigger 
            value="dashboard" 
            className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline font-semibold">{t('dashboard')}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="report"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline font-semibold">{t('detailedReport')}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="market"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline font-semibold">{t('marketAnalysis')}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="audit"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline font-semibold">{t('auditReport')}</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="dashboard" className="mt-0">
            <DashboardTab analysis={analysis} />
          </TabsContent>

          <TabsContent value="report" className="mt-0">
            <ReportTab analysis={analysis} />
          </TabsContent>

          <TabsContent value="market" className="mt-0">
            <MarketAnalysisTab 
              materialPrices={materialPrices}
              isFetchingPrices={isFetchingPrices}
            />
          </TabsContent>

          <TabsContent value="audit" className="mt-0">
            <AuditTab 
              comprehensiveAudit={comprehensiveAudit}
              isPerformingAudit={isPerformingAudit}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

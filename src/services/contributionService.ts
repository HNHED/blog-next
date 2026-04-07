import { api } from '@/utils/api';

export interface ContributionData {
  date: string;
  count: number;
}

export interface ContributionStats {
  totalContributions: number;
  todayContributions: number;
  streak: number;
}

export const contributionService = {
  async getContributions(startDate?: string, endDate?: string): Promise<ContributionData[]> {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    
    const query = params.toString();
    return api.get(`/contributions${query ? `?${query}` : ''}`);
  },

  async getStats(): Promise<ContributionStats> {
    return api.get('/contributions/stats');
  },
};
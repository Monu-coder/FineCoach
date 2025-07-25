export interface RegionalData {
  averageSavingsRate: string;
  averageEmergencyFund: string;
  investmentParticipation: string;
}

export const regionalDataMap: Record<string, RegionalData> = {
  'north-america': {
    averageSavingsRate: '4.2%',
    averageEmergencyFund: '$3,200',
    investmentParticipation: '28%'
  },
  'europe': {
    averageSavingsRate: '5.8%',
    averageEmergencyFund: '€2,800',
    investmentParticipation: '35%'
  },
  'asia-pacific': {
    averageSavingsRate: '8.1%',
    averageEmergencyFund: '¥180,000',
    investmentParticipation: '22%'
  },
  'latin-america': {
    averageSavingsRate: '3.5%',
    averageEmergencyFund: '$1,800',
    investmentParticipation: '15%'
  },
  'africa': {
    averageSavingsRate: '6.2%',
    averageEmergencyFund: '$1,200',
    investmentParticipation: '12%'
  }
};

export function getRegionalKey(region: string): string {
  return region.toLowerCase().replace(/\s+/g, '-');
}

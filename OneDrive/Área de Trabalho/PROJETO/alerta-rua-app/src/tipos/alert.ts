export type AlertType = 
  | 'traffic' 
  | 'checkpoint' 
  | 'accident' 
  | 'closed' 
  | 'weather' 
  | 'construction';

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  expiresAt: Date;
  reportedBy: string;
}

export const alertTypeConfig: Record<AlertType, {
  label: string;
  icon: string;
  color: string;
}> = {
  traffic: { label: 'Congestionamento', icon: '🚗', color: '#f97316' },
  checkpoint: { label: 'Fiscalização', icon: '🚓', color: '#3b82f6' },
  accident: { label: 'Acidente', icon: '🚧', color: '#ef4444' },
  closed: { label: 'Via Interditada', icon: '🚦', color: '#7f1d1d' },
  weather: { label: 'Alagamento', icon: '🌧️', color: '#0ea5e9' },
  construction: { label: 'Obras', icon: '🛑', color: '#eab308' },
};
import { Alert } from '../tipos/alert';

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'checkpoint',
    title: 'Fiscalização Ativa',
    description: 'Operação de trânsito na via principal',
    location: {
      lat: -23.5505,
      lng: -46.6333,
      address: 'Av. Paulista, 1000',
    },
    upvotes: 45,
    downvotes: 2,
    createdAt: new Date(),
    reportedBy: 'Sistema',
  },
  {
    id: '2',
    type: 'accident',
    title: 'Acidente Reportado',
    description: 'Colisão leve, via parcialmente interditada',
    location: {
      lat: -23.5580,
      lng: -46.6350,
      address: 'Av. Brigadeiro, 500',
    },
    upvotes: 12,
    downvotes: 1,
    createdAt: new Date(),
    reportedBy: 'Usuario_99',
  }
];
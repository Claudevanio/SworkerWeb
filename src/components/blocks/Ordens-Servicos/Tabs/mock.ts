import { IServiceOrderDay } from '@/types/models/ServiceOrder/serviceOrder';

export const mockServiceOrders: IServiceOrderDay[] = [
  {
    id: 1,
    code: 'SO123456',
    description: 'Repair of air conditioning unit',
    requestDate: '2024-06-10T09:00:00Z',
    executionDate: '2024-06-15T14:00:00Z',
    supervisor: {
      name: 'John Doe',
      id: 101
    },
    status: {
      description: 'In Progress',
      id: 1
    },
    responsible: {
      name: 'Jane Smith',
      id: 202
    },
    sectorEquipId: 303,
    sectorEquipDescription: 'Air Conditioning',
    unityId: 404,
    unityDescription: 'Building A',
    sectorId: 505,
    sectorDescription: 'Maintenance',
    isEdited: false,
    serviceOrderProfessionals: [
      {
        name: 'Alice Johnson',
        professionalId: 606,
        isResponsible: true
      },
      {
        name: 'Bob Brown',
        professionalId: 707,
        isResponsible: false
      }
    ],
    responsibleName: 'Jane Smith',
    hasOccurrence: true
  },
  {
    id: 2,
    code: 'SO654321',
    description: 'Inspection of electrical system',
    requestDate: '2024-06-12T11:30:00Z',
    executionDate: '2024-06-20T10:00:00Z',
    supervisor: {
      name: 'Emily Davis',
      id: 102
    },
    status: {
      description: 'Pending',
      id: 2
    },
    responsible: {
      name: 'Chris Green',
      id: 203
    },
    sectorEquipId: 304,
    sectorEquipDescription: 'Electrical',
    unityId: 405,
    unityDescription: 'Building B',
    sectorId: 506,
    sectorDescription: 'Safety',
    isEdited: true,
    serviceOrderProfessionals: [
      {
        name: 'David Wilson',
        professionalId: 608,
        isResponsible: true
      },
      {
        name: 'Eva White',
        professionalId: 709,
        isResponsible: false
      }
    ],
    responsibleName: 'Chris Green',
    hasOccurrence: false
  },
  {
    id: 3,
    code: 'SO789012',
    description: 'Routine maintenance of plumbing',
    requestDate: '2024-06-14T14:00:00Z',
    executionDate: '2024-06-22T16:00:00Z',
    supervisor: {
      name: 'Frank Black',
      id: 103
    },
    status: {
      description: 'Completed',
      id: 3
    },
    responsible: {
      name: 'Grace Lee',
      id: 204
    },
    sectorEquipId: 305,
    sectorEquipDescription: 'Plumbing',
    unityId: 406,
    unityDescription: 'Building C',
    sectorId: 507,
    sectorDescription: 'Infrastructure',
    isEdited: false,
    serviceOrderProfessionals: [
      {
        name: 'Hannah Clark',
        professionalId: 610,
        isResponsible: true
      },
      {
        name: 'Ian Adams',
        professionalId: 711,
        isResponsible: false
      }
    ],
    responsibleName: 'Grace Lee',
    hasOccurrence: true
  }
];

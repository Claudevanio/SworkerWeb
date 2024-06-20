'use client';
import { Box, Skeleton, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DroppableProps } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './StrictDroppable';
import Image from 'next/image';
import { COLORS } from '@/utils';
import { useServiceOrder } from '@/contexts';
import { ServiceOrder } from '@/types/models/ServiceOrder/serviceOrder';
import { FiltroButton } from '@/components/ui';
import { useRouter } from 'next/navigation';

export const Kanban = ({ openFilterModal }: { openFilterModal: () => void }) => {
  const { serviceOrders } = useServiceOrder();

  const [crmPainelData, setCrmPainelData] = useState<any>([{}]);

  async function fetchPainelData() {
    const response = {
      Pending: [
        {
          id: 1,
          name: 'João',
          contact: '11999999999',
          status: 'Pendente',
          image: ''
        }
      ],
      Executing: [
        {
          id: 2,
          name: 'Maria',
          contact: '11999999999',
          status: 'Executando',
          image: ''
        }
      ],
      Review: [
        {
          id: 3,
          name: 'José',
          contact: '11999999999',
          status: 'Em revisão',
          image: ''
        }
      ],
      Canceled: [
        {
          id: 4,
          name: 'Carlos',
          contact: '11999999999',
          status: 'Cancelado',
          image: ''
        }
      ],
      Completed: [
        {
          id: 5,
          name: 'Ana',
          contact: '11999999999',
          status: 'Concluído',
          image: ''
        }
      ]
    };
    setCrmPainelData(response);
  }

  useEffect(() => {
    fetchPainelData();
    serviceOrders.resetFilter();
  }, []);

  const initialStages = useMemo(() => {
    return {
      pending: {
        name: 'Pendente',
        items: [
          {
            id: 1,
            nome: 'João',
            telefone: '11999999999',
            statusCode: 'Pendente',
            imagemUrl: ''
          },
          {
            id: 6,
            nome: 'João',
            telefone: '11999999999',
            statusCode: 'Pendente',
            imagemUrl: ''
          },
          {
            id: 65,
            nome: 'João',
            telefone: '11999999999',
            statusCode: 'Pendente',
            imagemUrl: ''
          }
        ]
      },
      executing: {
        name: 'Executando',
        items: [
          {
            id: 2,
            nome: 'Maria',
            telefone: '11999999999',
            statusCode: 'Executando',
            imagemUrl: ''
          }
        ]
      },
      review: {
        name: 'Em revisão',
        items: [
          {
            id: 3,
            nome: 'José',
            telefone: '11999999999',
            statusCode: 'Em revisão',
            imagemUrl: ''
          }
        ]
      },
      canceled: {
        name: 'Cancelado',
        items: [
          {
            id: 4,
            nome: 'Carlos',
            telefone: '11999999999',
            statusCode: 'Cancelado',
            imagemUrl: ''
          }
        ]
      },
      completed: {
        name: 'Concluído',
        items: [
          {
            id: 5,
            nome: 'Ana',
            telefone: '11999999999',
            statusCode: 'Concluído',
            imagemUrl: ''
          }
        ]
      }
    };
  }, []);

  const [stages, setStages] = useState(initialStages);

  const aggregateStages = (data?: ServiceOrder[]) => {
    if (!data) return initialStages;
    const stages = {
      pending: {
        name: 'Pendente',
        items: []
      },
      executing: {
        name: 'Executando',
        items: []
      },
      review: {
        name: 'Em revisão',
        items: []
      },
      canceled: {
        name: 'Cancelado',
        items: []
      },
      completed: {
        name: 'Concluído',
        items: []
      }
    };
    data.forEach(serviceOrder => {
      const statusCode =
        serviceOrder?.status?.description === 'Pendente'
          ? 'pending'
          : serviceOrder?.status?.description === 'Executando'
            ? 'executing'
            : serviceOrder?.status?.description === 'Em revisão'
              ? 'review'
              : serviceOrder?.status?.description === 'Cancelado'
                ? 'canceled'
                : 'completed';

      const stage = stages[statusCode.toLowerCase()];
      if (stage) {
        stage.items.push(serviceOrder);
      }
    });
    return stages;
  };

  useEffect(() => {
    if (serviceOrders) {
      setStages(aggregateStages(serviceOrders.data?.items));
    }
  }, [serviceOrders]);

  const onDragEnd = async (result: any) => {
    const { source, destination } = result;
    if (!destination) return;
    const sourceStage = stages[source.droppableId as never] as any;
    const destStage = stages[destination.droppableId as never] as any;
    const sourceItems = [...sourceStage.items];
    const destItems = [...destStage.items];
    const [removed] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, removed);
      setStages({
        ...stages,
        [source.droppableId]: {
          ...sourceStage,
          items: sourceItems
        }
      });
    } else {
      destItems.splice(destination.index, 0, removed);
      //chamadas pra api aqui
      const statusCodeNum =
        destination.droppableId === 'pending'
          ? 1
          : destination.droppableId === 'executing'
            ? 2
            : destination.droppableId === 'review'
              ? 5
              : destination.droppableId === 'canceled'
                ? 4
                : 3;
      const statusCodeSource =
        source.droppableId === 'pending'
          ? 1
          : source.droppableId === 'executing'
            ? 2
            : source.droppableId === 'review'
              ? 5
              : source.droppableId === 'canceled'
                ? 4
                : 3;

      // const statusCodeNum = destination.droppableId === 'primeiroContato' ? 2 : destination.droppableId === 'consultaAgendada' ? 1 : destination.droppableId === 'orcamento' ? 3 : destination.droppableId === 'compraRealizada' ? 4 : 5;

      try {
        // patientService.UpdateStatusCode(removed.id, statusCodeNum)
        serviceOrders.changeStatus(removed.id, statusCodeNum, statusCodeSource);

        console.log(
          JSON.stringify({
            draggableId: removed.id, // id do paciente
            source: source.droppableId, // nome da propriedade do objeto initialStages que veio
            destination: destination.droppableId, // nome da propriedade do objeto initialStages que está indo
            position: destination.index // posição no array
          })
        );

        const updatedStages = {
          ...stages,
          [source.droppableId]: {
            ...sourceStage,
            items: sourceItems
          },
          [destination.droppableId]: {
            ...destStage,
            items: destItems
          }
        };

        setStages(updatedStages);
      } catch {
        // toast.error('Erro ao atualizar status do paciente')
      }
    }
  };

  const router = useRouter();

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="w-full justify-end flex  md:mt-[-12px]">
        <FiltroButton onClick={openFilterModal} />
      </div>
      <Box
        sx={{
          display: 'flex',
          gap: '1.25rem',
          minWidth: '70vw',
          height: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          marginBottom: '4rem',
          paddingBottom: '2rem',
          '&::-webkit-scrollbar': {
            width: '.5rem',
            height: '.75rem'
          },
          '@media(max-width: 768px)': {
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            '-ms-overflow-style': 'none',
            scrollbarWidth: 'none'
          }
        }}
        className="me-[-38px] pr-4"
        id="kanban-operations"
      >
        {Object.entries(stages).map(([stageId, stage]: [string, any]) => (
          <StrictModeDroppable droppableId={stageId} key={stageId}>
            {(provided: any) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{
                  minWidth: '18rem',
                  height: '100%',
                  minHeight: '38rem',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '.5rem',
                  alignItems: 'center'
                }}
                className="border-2 border-base-2 bg-base-1"
              >
                <h2 className="text-base-8 text-lg font-bold flex items-center gap-4 w-full pt-8 px-8">
                  {stageId && <Image src={`/${stageId}-img.png`} alt={stageId} width={32} height={32} />}
                  {stage.name}
                </h2>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '.5rem',
                    alignItems: 'center',
                    width: '100%',
                    padding: '0 0rem 1rem',
                    maxHeight: '32rem',
                    overflowY: 'auto'
                  }}
                  className="p-6 "
                  onWheel={e => {
                    e.stopPropagation();
                  }}
                >
                  {stage.items.map((serviceOrder: ServiceOrder, index: number) => (
                    <Draggable key={serviceOrder.id} draggableId={serviceOrder?.id?.toString()} index={index}>
                      {(provided: any) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ cursor: 'grab', width: '100%' }}
                          className="w-full bg-primary-100 border-primary-300 border-2 rounded-lg px-4 py-[22px] flex flex-col gap-4"
                          onClick={() => {
                            router.push(`servicos-operacionais/${serviceOrder.id}`);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-base-7 font-bold">{serviceOrder.code}</h4>
                            {!serviceOrders.isLoading && (
                              <p
                                className="text-base-1 font-bold p-2 rounded-md uppercase min-w-[50%]"
                                style={
                                  serviceOrder.tagId === 0
                                    ? { backgroundColor: COLORS['warning']['2'], border: `1px solid ${COLORS['warning']['3']}` }
                                    : // patient.statusCode === 'Executando' ? {backgroundColor: COLORS['info']['2'], border: `1px solid ${COLORS['info']['3']}`} :
                                      // patient.statusCode === 'Em revisão' ? {backgroundColor: COLORS['success']['2'], border: `1px solid ${COLORS['success']['3']}`} :
                                      // serviceOrder.tagId === 1  ?
                                      { backgroundColor: COLORS['erro']['2'], border: `1px solid ${COLORS['erro']['3']}` }
                                }
                              >
                                {serviceOrder?.supervisor?.name ? 'Associada' : 'Não Associada'}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-4">
                            <p className="text-base-7 font-normal text-base">
                              {serviceOrders.isLoading ? <Skeleton width={100} height={20} /> : serviceOrder.description}
                            </p>
                            <div className="flex flex-col gap-2">
                              <span>
                                <strong>Origem:</strong>{' '}
                                {serviceOrders.isLoading ? (
                                  <Skeleton width={100} height={20} />
                                ) : (
                                  ' ' + (serviceOrder?.unityDescription ?? 'Indefinido')
                                )}
                              </span>
                              <span>
                                <strong>Responsavel:</strong>
                                {serviceOrders.isLoading ? (
                                  <Skeleton width={100} height={20} />
                                ) : (
                                  ' ' + (serviceOrder?.responsible?.name ?? 'Indefinido')
                                )}
                              </span>
                              <span>
                                <strong>Supervisor:</strong>
                                {serviceOrders.isLoading ? (
                                  <Skeleton width={100} height={20} />
                                ) : (
                                  ' ' + (serviceOrder?.supervisor?.name ?? 'Indefinido')
                                )}
                              </span>
                            </div>
                          </div>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                </Box>

                {provided.placeholder}
              </Box>
            )}
          </StrictModeDroppable>
        ))}
      </Box>
    </DragDropContext>
  );
};

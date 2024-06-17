import { COLORS } from '@/utils';
import { CheckOutlined, CollectionsBookmarkOutlined, TrendingDown, TrendingUp } from '@mui/icons-material';

export function OcurrenceList({
  geradas,
  reconhecidas,
  encerradas
}: {
  geradas: {
    count: number;
    variant: 'success' | 'danger';
    label: string;
  };
  reconhecidas: {
    count: number;
    variant: 'success' | 'danger';
    label: string;
  };
  encerradas: {
    count: number;
    variant: 'success' | 'danger';
    label: string;
  };
}) {
  return (
    <div>
      <div className="grid  md:grid-cols-3 gap-6">
        <div className="p-6 rounded-lg border-primary-100 border-2 flex flex-col gap-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center justify-center bg-primary-100 rounded-2xl p-4">
              <CollectionsBookmarkOutlined className="text-primary-500" />
            </div>
            <div>
              <p className="text-primary-600 text-[3rem] font-bold">{geradas.count}</p>
              <p className="text-primary-500 text-base font-semibold mt-[-10px]">Geradas</p>
            </div>
          </div>
          <div
            className="flex items-center gap-2 px-2 py-1 rounded-full "
            style={{
              backgroundColor: geradas.variant === 'success' ? COLORS['sucesso']['0'] : COLORS['erro']['0'],
              border: '1px solid',
              borderColor: geradas.variant === 'success' ? COLORS['sucesso']['2'] : COLORS['erro']['2'],
              color: geradas.variant === 'success' ? COLORS['sucesso']['3'] : COLORS['erro']['3']
            }}
          >
            {geradas.variant === 'success' ? <TrendingUp /> : <TrendingDown />}
            {geradas.label}
          </div>
        </div>

        <div className="p-6 rounded-lg border-primary-100 border-2 flex flex-col gap-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center justify-center bg-primary-100 rounded-2xl p-4">
              <CollectionsBookmarkOutlined className="text-primary-500" />
            </div>
            <div>
              <p className="text-primary-600 text-[3rem] font-bold">{reconhecidas.count}</p>
              <p className="text-primary-500 text-base font-semibold mt-[-10px]">Reconhecidas</p>
            </div>
          </div>
          <div
            className="flex items-center gap-2 px-2 py-1 rounded-full "
            style={{
              backgroundColor: reconhecidas.variant === 'success' ? COLORS['sucesso']['0'] : COLORS['erro']['0'],
              border: '1px solid',
              borderColor: reconhecidas.variant === 'success' ? COLORS['sucesso']['2'] : COLORS['erro']['2'],
              color: reconhecidas.variant === 'success' ? COLORS['sucesso']['3'] : COLORS['erro']['3']
            }}
          >
            {reconhecidas.variant === 'success' ? <TrendingUp /> : <TrendingDown />}
            {reconhecidas.label}
          </div>
        </div>

        <div className="p-6 rounded-lg border-primary-100 border-2 flex flex-col gap-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center justify-center bg-primary-100 rounded-2xl p-4">
              <CheckOutlined className="text-primary-500" />
            </div>
            <div>
              <p className="text-primary-600 text-[3rem] font-bold">{encerradas.count}</p>
              <p className="text-primary-500 text-base font-semibold mt-[-10px]">Encerradas</p>
            </div>
          </div>
          <div
            className="flex items-center gap-2 px-2 py-1 rounded-full "
            style={{
              backgroundColor: encerradas.variant === 'success' ? COLORS['sucesso']['0'] : COLORS['erro']['0'],
              border: '1px solid',
              borderColor: encerradas.variant === 'success' ? COLORS['sucesso']['2'] : COLORS['erro']['2'],
              color: encerradas.variant === 'success' ? COLORS['sucesso']['3'] : COLORS['erro']['3']
            }}
          >
            {encerradas.variant === 'success' ? <TrendingUp /> : <TrendingDown />}
            {encerradas.label}
          </div>
        </div>
      </div>
    </div>
  );
}

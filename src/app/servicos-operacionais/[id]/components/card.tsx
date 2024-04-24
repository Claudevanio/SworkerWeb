function Title({ children }: { children: React.ReactNode | React.ReactNode[] }) {
  return (
    <div className="flex flex-row items-center w-full bg-primary-100 rounded-t-lg py-6 px-8 " 
    style={children && Array.isArray(children) && children.length ? { justifyContent: 'space-between' } : {justifyContent: 'center'}}
    >
      {children}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode | React.ReactNode[] }) {
  return (
    <div className="border-2 border-primary-200 rounded-lg">
      {children}
    </div>
  );
}

function Field({ label, value, className = ''}: { label: string, value: string | string [], className?: string}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <span className="text-base-4 font-bold">{label}</span>
      {
        !Array.isArray(value) && <span className="text-base-7">{value}</span>
      }
      {
        Array.isArray(value) && (
          <div className="flex flex-col gap-2">
            {value.map((v, index) => (
              <span key={index} className="text-base-7">{v}</span>
            ))}
          </div>
        )
      }
    </div>
  );
}

export const DetailCard = {
  Title,
  Card,
  Field
} 
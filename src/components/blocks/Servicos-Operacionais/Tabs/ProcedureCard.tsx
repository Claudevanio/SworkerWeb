import React from 'react'


export const ProcedureCard : React.FC<{children : React.ReactNode, className?: string}> = ({ children, className }) => {
  return (
    <div
      className={'w-full border-2 border-primary-50 rounded-lg p-6 flex items-center gap-8 ' + className}
    >
      {children}
    </div>
  )
}

export const Icon : React.FC<{icon: React.ReactNode}>= ({ icon } ) => {
  return (
    <div
      className='flex items-center justify-center bg-primary-100 rounded-2xl p-4 text-primary-500'
    >
      {icon}
    </div>
  )
}
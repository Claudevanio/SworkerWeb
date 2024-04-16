import { ReactNode } from 'react'
import { CheckBoxRadio } from './ui/checkbox'

export const BoxWithCheck = (
  {
    value,
    setValue,
    children,
  }: {
    value: boolean,
    setValue: () => void,
    children: ReactNode
  }
) => {

  return(
    <div
      className="flex items-start w-full rounded-2xl border-2 py-5 px-4 border-[#00000000] h-full transition-all ease-linear hover:border-primary cursor-pointer"
      onClick={setValue}
      style={
        value ?
        {
        borderColor:  '#00B5B8'
      } : {}
    }
    >
      <CheckBoxRadio
        label=''
        onChange={setValue}
        value={value}
      />
      {
        children
      }
      
    </div>
  )
}

export const AssinaturaBox = (
  {
    title,
    subtitle,
    description,
    value,
    setValue
  } : {
    title: string,
    subtitle: string | ReactNode,
    description: string
    value: boolean,
    setValue: () => void
  }
) => {
  return(
    <BoxWithCheck
      value={value}
      setValue={setValue}
    >
      <div
        className='flex flex-col gap-4 text-primary'
      >
        <div
          className='flex flex-col gap-3'
        >
          <h3
            className='font-bold text-[2rem]'
            >
            {title}
          </h3>
          <h4
            className='font-normal text-xl'
            >
            {subtitle}
          </h4>
        </div>
        <p
          className='text-xl'
        >
          {description}
        </p>
      </div>
    </BoxWithCheck>
  )
}
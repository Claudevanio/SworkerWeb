'use client'
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react'; 
import { Modal } from '@/components/ui/modal';
import { Button, Dialog } from '@/components';

type DialogContextType = {
    title: string;
    openDialog:  ({
      title,
      onConfirm,
      message,
      onConfirmText,
      onCloseText,
      subtitle,
      variant
    } : {
      title: string,
      onConfirm: () => void,
      message?: string,
      onConfirmText?: string,
      onCloseText?: string
      subtitle?: string
      variant?: 'error' | 'success'
    }) => void;
    confirmDialog:  ({
      title,
      onConfirm,
      onConfirmText,
      onCloseText,
      message,
      subtitle,
      variant,
      hideCloseButton
    } : {
      title: string,
      onConfirm?: () => void,
      onConfirmText?: string,
      onCloseText?: string,
      hideCloseButton?: boolean
      message?: string
      subtitle?: string
      variant?: 'error' | 'success'
    }) => void;
    isOpened: boolean;
    setIsOpened: (isOpened: boolean) => void;
};

export const DialogContext = createContext<DialogContextType>({
    title: '',
    openDialog: () => { },
    isOpened: false,
    setIsOpened: () => { },
    confirmDialog: () => {}
}); 

export const DialogProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [showDialog, setShowDialog] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subtitle, setSubtitle] = useState<string>('');
    const [onConfirmText, setOnConfirmText] = useState<string | undefined>();
    const [onCloseText, setOnCloseText] = useState<string | undefined>();
    const [onConfirm, setOnConfirm] = useState<() => void>(() => { });
    const [hideCloseButton, setHideCloseButton] = useState(false)
    const [variant, setVariant] = useState<'error' | 'success'>('error');
    

    
  const openDialog = useCallback(({
    title,
    onConfirm,
    onConfirmText,
    onCloseText,
    hideCloseButton = false,
    message,
    subtitle,
    variant = 'error'
}: {
    title: string,
    onConfirm: () => void,
    onConfirmText?: string,
    onCloseText?: string,
    hideCloseButton?: boolean,
    message?: string
    subtitle?: string 
    variant?: 'error' | 'success'
}) => {
    setTitle(title);
    setOnConfirm(() => onConfirm); 
    setOnConfirmText(onConfirmText);
    setOnCloseText(onCloseText);
    setHideCloseButton(hideCloseButton);
    setShowDialog(true);
    setDescription(message ?? '');
    setSubtitle(subtitle ?? '');
    setVariant(variant);
}, []);

    const showSuccessDialog = ({
      title,
      onConfirm  = () => {},
      onConfirmText = 'Fechar',
      onCloseText,
      hideCloseButton = true,
      message,
      subtitle,
      variant = 'error'
    } : {
      title: string,
      onConfirm?: () => void,
      onConfirmText?: string,
      onCloseText?: string,
      hideCloseButton?: boolean
      message?: string
      subtitle?: string
      variant?: 'error' | 'success'
    }) => {
      setTitle(title);
      setOnConfirm(() => onConfirm); 
      setOnConfirmText(onConfirmText);
      setOnCloseText(onCloseText);
      setHideCloseButton(hideCloseButton)
      setShowDialog(true);
      setDescription(message ?? '');
      setSubtitle(subtitle ?? '');
      setVariant(variant);
    }

    useEffect(() => {
      if(!showDialog) {
        setTitle('');
        setOnConfirm(() => {});
        setOnConfirmText('');
        setHideCloseButton(false)
        setOnCloseText('');
        setDescription('');
        setSubtitle('');
        setVariant('error');
      }
    }, [showDialog]);

    return (
        <DialogContext.Provider value={{ isOpened: showDialog, openDialog, setIsOpened: setShowDialog, title, confirmDialog: showSuccessDialog }}>
            {children}
            {showDialog && (
              <Dialog
                title={title}
                isOpen={showDialog}
                onClose={() => setShowDialog(false)}
                width="444px">
                  <div
                    className='flex flex-col gap-4'
                  >
                    {
                      subtitle !== '' && <div
                        className='text-base-8 text-xl font-semibold '
                      >{subtitle}</div>
                    }
                    {
                      description !== '' && <div
                        className='text-base-4 text-base font-medium '
                      >{description}</div>
                    }
                    <div className="flex justify-between items-center w-full gap-4 mt-4">
                      {hideCloseButton && (
                        <p
                          onClick={() => {
                            setShowDialog(false);
                          }} 
                          className="text-base-7 font-medium text-sm md:text-lg cursor-pointer"
                        >
                          {onCloseText || 'Voltar'}
                        </p>
                      )}
                      {
                        variant === 'error' ?<Button
                        variant='error'
                        onClick={() => {
                          onConfirm();
                          setShowDialog(false);
                        }}
                        className='w-auto'
                      >
                        {onConfirmText ?? 'Excluir'}
                      </Button>
                      : <Button
                        onClick={() => {
                          onConfirm();
                          setShowDialog(false);
                        }}
                        className='w-auto'
                      >
                        {onConfirmText ?? 'Confirmar'}
                        </Button>
                      }

 </div>
                  </div>
              </Dialog>
            )}
        </DialogContext.Provider>
    );
};

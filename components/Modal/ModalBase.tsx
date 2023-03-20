import { Dialog } from '@headlessui/react';
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import React, { FunctionComponent, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


interface ModalBaseProps {
  open: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
};

export const ModalBase: FunctionComponent<ModalBaseProps> = ({ title, open, children, onClose }) => {

  return (
    <Dialog open={open} onClose={() => onClose()} className="relative z-50">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-xl rounded-3xl bg-white w-full">
          <Dialog.Title className="py-5 px-8 border-b border-gray-200 text-highlighted text-2xl font-bold flex justify-between items-center">
            {title}
            <button onClick={onClose}>
              <FontAwesomeIcon className="h-8" icon={faXmark} />
            </button>
          </Dialog.Title>

          <div className="p-8 text-normal">{children}</div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

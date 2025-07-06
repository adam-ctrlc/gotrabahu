import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X } from 'lucide-react';

function Modal({ isOpen, onToggle, title, children }) {
  return (
    <Transition appear show={isOpen}>
      <Dialog as='div' className='relative z-10' onClose={onToggle}>
        <Transition.Child
          as='div' // Explicitly render as a div
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 g-opacity-50' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Dialog.Panel} // Explicitly render as Dialog.Panel
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-2xl transform overflow-hidden rounded-md border border-gray-200 bg-white p-6 text-left align-middle transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-xl font-bold leading-6 text-gray-900 pb-4 border-b border-gray-200'
                >
                  <div className='flex justify-between items-center w-full'>
                    {title}
                    <button
                      type='button'
                      className='text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                      onClick={onToggle}
                      aria-label='Close modal'
                    >
                      <X size={24} />
                    </button>
                  </div>
                </Dialog.Title>
                <div className='mt-2'>{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;

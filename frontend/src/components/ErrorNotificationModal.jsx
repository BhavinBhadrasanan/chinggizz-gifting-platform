import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, AlertCircle } from 'lucide-react';

/**
 * Error Notification Modal Component
 * Displays error messages in a centered, beautiful modal popup
 *
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Called when modal is closed
 * @param {string} title - Error title
 * @param {string} message - Error message
 * @param {React.ReactNode} icon - Custom icon component
 * @param {function} primaryAction - Optional primary action button
 * @param {string} primaryActionText - Text for primary action button
 */
export default function ErrorNotificationModal({
  isOpen,
  onClose,
  title = 'Error',
  message = 'An error occurred',
  icon = null,
  autoClose = true,
  autoCloseDuration = 4000,
  primaryAction = null,
  primaryActionText = 'Change Box Size'
}) {
  // Auto-close after duration
  React.useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDuration, onClose]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        {/* Backdrop with blur */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal Container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-gradient-to-br from-red-50 via-white to-red-50 p-8 text-center shadow-2xl transition-all border-2 border-red-100">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors rounded-full p-1 hover:bg-red-100"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Icon with animated background */}
                <div className="mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-red-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg">
                    {icon || <AlertCircle className="h-10 w-10 text-white" />}
                  </div>
                </div>

                {/* Title */}
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold text-gray-900 mb-3"
                >
                  {title}
                </Dialog.Title>

                {/* Message */}
                <div className="mb-6">
                  <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line text-left">
                    {message}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* Primary Action Button (if provided) */}
                  {primaryAction && (
                    <button
                      onClick={() => {
                        primaryAction();
                        onClose();
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all transform hover:scale-105 shadow-lg"
                    >
                      {primaryActionText}
                    </button>
                  )}

                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className={`w-full px-6 py-3 ${primaryAction ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'} font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all transform hover:scale-105 shadow-lg`}
                  >
                    {primaryAction ? 'Cancel' : 'Got it'}
                  </button>
                </div>

                {/* Auto-close indicator */}
                {autoClose && (
                  <div className="mt-4">
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-shrink"
                        style={{
                          animation: `shrink ${autoCloseDuration}ms linear forwards`
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Auto-closing...</p>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}


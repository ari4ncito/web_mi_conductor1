import { useEffect, useRef } from 'react';

export default function useModalA11y(openOrOptions, maybeOnClose) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  const open = typeof openOrOptions === 'object' && openOrOptions !== null
    ? Boolean(openOrOptions.isOpen ?? openOrOptions.open)
    : Boolean(openOrOptions);

  const onClose = typeof openOrOptions === 'object' && openOrOptions !== null
    ? openOrOptions.onClose
    : maybeOnClose;

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    // Save previous focus when opening
    previousFocusRef.current = document.activeElement;

    // Handle Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCloseRef.current?.();
      }
    };
    
    // Auto-focus the modal container or the first focusable element only when modal opens
    if (modalRef.current) {
      modalRef.current.focus();
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus on close
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, [open]);

  return modalRef;
}

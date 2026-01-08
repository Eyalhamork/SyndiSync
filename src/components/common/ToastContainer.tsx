// src/components/common/ToastContainer.tsx
import useAppStore from '../../store/appStore';
import { Toast } from './Toast';

export function ToastContainer() {
  const { toasts, hideToast } = useAppStore();

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-md">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          show={toast.show}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </div>
  );
}

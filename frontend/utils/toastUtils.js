import { toast } from 'react-toastify';

// Function to show an error toast with a dynamic message
export const showErrorToast = (message) => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

// Function to show a success toast with a dynamic message
export const showSuccessToast = (message) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

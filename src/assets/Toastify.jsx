import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toastify = (message, type = 'success') => {
  const options = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  // Dùng switch hoặc object để đơn giản hoá
  const toastTypes = {
    success: toast.success,
    error: toast.error,
    info: toast.info,
    warning: toast.warn,
  };

  const showToast = toastTypes[type] || toast.success; // Default is 'success'

  showToast(message, options); // Gọi toast phù hợp
};

export default Toastify;

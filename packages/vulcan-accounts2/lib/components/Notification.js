import notie from 'notie';
import 'notie/dist/notie.css';

const Notification = {
  error: (message) => {
    notie.alert(3, message, 2.5);
  },
  success: (message) => {
    notie.alert(1, message, 2.5);
  }
}

export default Notification;

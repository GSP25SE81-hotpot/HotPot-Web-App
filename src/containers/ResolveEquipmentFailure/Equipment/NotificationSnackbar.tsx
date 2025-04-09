// src/components/common/NotificationSnackbar.tsx

import { Alert, Snackbar } from "@mui/material";
import { NotificationState } from "../../../types/equipmentFailure";

interface NotificationSnackbarProps {
  notification: NotificationState | null;
  setNotification: React.Dispatch<
    React.SetStateAction<NotificationState | null>
  >;
}

const NotificationSnackbar: React.FC<NotificationSnackbarProps> = ({
  notification,
  setNotification,
}) => {
  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={6000}
      onClose={() => setNotification(null)}
    >
      <Alert severity={notification?.severity} sx={{ width: "100%" }}>
        {notification?.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;

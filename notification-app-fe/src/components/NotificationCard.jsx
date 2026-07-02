import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";

const priorityColors = {
  High: "error",
  Medium: "warning",
  Low: "success",
};

export function NotificationCard({
  notification,
  onDelete,
  onMarkAsRead,
}) {
  const createdAt = notification.createdAt
    ? new Date(notification.createdAt).toLocaleString()
    : "";

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        borderColor: notification.isRead ? "divider" : "primary.main",
        bgcolor: notification.isRead ? "background.paper" : "primary.50",
      }}
    >
      <Stack spacing={1.5}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              {notification.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {createdAt}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label={notification.type} size="small" />
            <Chip
              label={notification.priority}
              size="small"
              color={priorityColors[notification.priority] || "default"}
            />
          </Stack>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          {notification.message}
        </Typography>

        <Stack direction="row" spacing={1}>
          {!notification.isRead && (
            <Button
              size="small"
              variant="contained"
              startIcon={<DoneIcon />}
              onClick={() => onMarkAsRead(notification.id)}
            >
              Mark as read
            </Button>
          )}

          <Button
            size="small"
            color="error"
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(notification.id)}
          >
            Delete
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

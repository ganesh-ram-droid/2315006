import { useState } from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  CircularProgress,
  Divider,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";
import { useNotifications } from "../hooks/useNotifications";

export function NotificationsPage() {
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);

  const {
    notifications,
    totalPages,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications(page, filter);

  // Count unread notifications
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // Filter Change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  // Pagination Change
  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: 2, py: 4 }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        justifyContent="space-between"
        spacing={1.5}
        mb={3}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Badge
            badgeContent={unreadCount}
            color="primary"
            max={99}
          >
            <NotificationsIcon sx={{ fontSize: 28 }} />
          </Badge>

          <Typography variant="h5" fontWeight={700}>
            Notifications
          </Typography>
        </Stack>

        <Button
          size="small"
          variant="outlined"
          disabled={unreadCount === 0}
          onClick={markAllAsRead}
        >
          Mark all as read
        </Button>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Filter */}
      <Box mb={3}>
        <NotificationFilter
          value={filter}
          onChange={handleFilterChange}
        />
      </Box>

      {/* Loading */}
      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {/* Error */}
      {!loading && error && (
        <Alert severity="error">
          Failed to load notifications : {error}
        </Alert>
      )}

      {/* Empty State */}
      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">
          No notifications found.
        </Alert>
      )}

      {/* Notification List */}
      {!loading && !error && notifications.length > 0 && (
        <Stack spacing={2}>
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onDelete={removeNotification}
              onMarkAsRead={markAsRead}
            />
          ))}
        </Stack>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Box
          display="flex"
          justifyContent="center"
          mt={4}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}

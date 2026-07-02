const BASE_URL = "http://localhost:5000/api/notifications";

export async function fetchNotifications(page = 1, type = "") {
  let url = `${BASE_URL}`;

  const params = [];

  if (page) params.push(`page=${page}`);
  if (type) params.push(`type=${type}`);

  if (params.length) {
    url += `?${params.join("&")}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return response.json();
}

export async function fetchNotificationById(id) {
  const response = await fetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch notification");
  }

  return response.json();
}

export async function markNotificationAsRead(id) {
  const response = await fetch(`${BASE_URL}/${id}/read`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }

  return response.json();
}

export async function markAllNotificationsAsRead() {
  const response = await fetch(`${BASE_URL}/read-all`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Failed to mark all notifications as read");
  }

  return response.json();
}

export async function deleteNotification(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete notification");
  }

  return response.json();
}

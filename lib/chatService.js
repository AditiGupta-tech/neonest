import axios from "axios";

export async function fetchChatHistory(role, token) {
  if (!token || !role) return [];

  const res = await axios.get(`/api/chat/history?role=${role}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data.messages || [];
}

export async function saveChatHistory(role, messages, token) {
  if (!token || !role || !messages.length) return;

  await axios.post("/api/chat/save", { role, messages }, { headers: { Authorization: `Bearer ${token}` } });
}

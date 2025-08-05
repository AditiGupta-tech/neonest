import { MoreVertical, User, Baby, Smile, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import axios from "axios";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogContent, AlertDialogAction, AlertDialogCancel, AlertDialogTitle } from "@/components/ui/alert-dialog";

const roleIcons = {
  pediatrician: <User className="w-5 h-5 text-blue-500" />,
  baby: <Baby className="w-5 h-5 text-purple-500" />,
  mother: <Smile className="w-5 h-5 text-pink-500" />,
};

export default function ChatHistoryPanel({ role, chatSessions, activeChatId, isLoading, onSelectChat, onNewChat, onChatDeleted, onTitleEdited, token }) {
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(null);

  const handleEdit = (chat) => {
    setEditId(chat._id);
    setEditValue(chat.title);
  };

  const handleEditSubmit = async (chat) => {
    if (!editValue.trim() || editValue === chat.title) {
      setEditId(null);
      return;
    }
    setLoadingId(chat._id);
    try {
      await axios.put(`/api/chat/${chat._id}/title`, { title: editValue }, { headers: { Authorization: `Bearer ${token}` } });
      onTitleEdited(chat._id, editValue);
      setEditId(null);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (chat) => {
    setLoadingId(chat._id);
    try {
      await axios.delete(`/api/chat/${chat._id}`, { headers: { Authorization: `Bearer ${token}` } });
      onChatDeleted(chat._id);
      setShowConfirm(null);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-4 border-b bg-pink-50/60">
        <span className="font-semibold text-pink-600 text-base">Chats</span>
        <Button size="icon" variant="ghost" className="hover:bg-pink-100" onClick={onNewChat} aria-label="New Chat">
          <Plus className="w-5 h-5 text-pink-600" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="p-4 text-gray-400">Loading...</div>
        ) : chatSessions.length === 0 ? (
          <div className="p-4 text-gray-400 text-sm">No chats yet. Start a new chat!</div>
        ) : (
          chatSessions.map((chat) => (
            <div
              key={chat._id}
              className={`relative flex items-center gap-2 px-4 py-4 cursor-pointer rounded transition group
                ${activeChatId === chat._id ? "bg-gradient-to-r from-pink-100 to-purple-100" : "hover:bg-gray-50"}`}
              onClick={() => (editId ? null : onSelectChat(chat._id))}>
              <div>{roleIcons[chat.role]}</div>
              <div className="flex-1 min-w-0">
                {editId === chat._id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleEditSubmit(chat);
                    }}
                    className="flex items-center gap-1">
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                      style={{ width: "160px" }}
                      onBlur={() => handleEditSubmit(chat)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") setEditId(null);
                      }}
                      disabled={loadingId === chat._id}
                      className="border rounded px-1 py-0.5 text-sm font-medium bg-white focus:outline-none focus:ring-1 ring-pink-400"
                    />
                    {loadingId === chat._id && <Loader2 className="w-4 h-4 animate-spin ml-1 text-pink-400" />}
                  </form>
                ) : (
                  <span className="truncate font-medium text-sm max-w-[140px] block">{chat.title}</span>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hover:bg-pink-100" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(chat)}>
                    <Pencil className="w-4 h-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowConfirm(chat._id)} className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialog open={showConfirm === chat._id} onOpenChange={(open) => !open && setShowConfirm(null)}>
                <AlertDialogContent>
                  <AlertDialogTitle>Delete Chat</AlertDialogTitle>
                  <div className="text-base font-medium mb-2">Delete this chat?</div>
                  <div className="flex justify-end item-end gap-2">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(chat)} className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
                      {loadingId === chat._id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

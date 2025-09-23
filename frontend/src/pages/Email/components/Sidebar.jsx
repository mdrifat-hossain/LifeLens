import React from "react"
import { Inbox, Send, Edit3, Star, Archive, Trash2 } from "lucide-react"

export const Sidebar = ({ activeView, onViewChange, unreadCount }) => {
  const menuItems = [
    { id: "inbox", label: "Inbox", icon: Inbox, count: unreadCount },
    { id: "sent", label: "Sent", icon: Send },
    { id: "drafts", label: "Drafts", icon: Edit3 },
    { id: "starred", label: "Starred", icon: Star },
    { id: "archive", label: "Archive", icon: Archive },
    { id: "trash", label: "Trash", icon: Trash2 }
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Mail</h1>
      </div>

      <div className="p-4">
        <button
          onClick={() => onViewChange("compose")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Edit3 size={18} />
          Compose
        </button>
      </div>

      <nav className="flex-1 px-4">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
              activeView === item.id
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <item.icon size={20} />
            <span className="flex-1">{item.label}</span>
            {item.count && item.count > 0 && (
              <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                {item.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}

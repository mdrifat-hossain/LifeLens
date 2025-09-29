import React from "react"
import { Inbox, Send, Edit3, Star, Archive, Trash2, MailWarning, LogOut } from "lucide-react"

export const Sidebar = ({ activeView, onViewChange, unreadCount, isUserLoggedIn, emailLogin, signOut }) => {
  const menuItems = [
    { id: "inbox", label: "Inbox", icon: Inbox, count: unreadCount },
    { id: "sent", label: "Sent", icon: Send },
    { id: "drafts", label: "Drafts", icon: Edit3 },
    { id: "starred", label: "Starred", icon: Star },
    { id: "spam", label: "Spam", icon: MailWarning },
    { id: "archive", label: "Archive", icon: Archive },
    { id: "trash", label: "Trash", icon: Trash2 }
  ]

  return (
    <div className="w-64 bg-light-background dark:bg-dark-background border-r border-accent/50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-accent/30">
        <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">Mail</h1>
      </div>

      {/* Compose button */}
      <div className="p-4">
        <button
          onClick={() => onViewChange("compose")}
          className="w-full bg-primary hover:bg-primary/70 cursor-pointer text-light-text font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Edit3 size={18} />
          Compose
        </button>
      </div>

      {/* Menu items */}
      <nav className="flex-1 px-4">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-left duration-200
              rounded-xl transition-colors text-light-dark dark:text-dark-text mb-2
              ${activeView === item.id
                ? "bg-secondary/10 border-l-2 border-primary"
                : "text-light-dark dark:text-dark-text hover:bg-accent/10"
              }`}
          >
            <item.icon size={20} />
            <span className="flex-1">{item.label}</span>
            {item.count && item.count > 0 && (
              <span className="bg-primary text-light-text text-xs font-medium px-2 py-1 rounded-full">
                {item.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Sign Out at bottom */}
      <div className="p-4 border-t border-accent/30">
        {isUserLoggedIn ? (<button
          onClick={signOut}
          className="w-full bg-red-500 hover:bg-red-600 cursor-pointer text-dark-text font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Sign Out
        </button>) : (<button
          onClick={emailLogin}
          className="w-full bg-primary hover:bg-primary/70 cursor-pointer text-light-text font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Sign In
        </button>)}

      </div>
    </div>
  )
}

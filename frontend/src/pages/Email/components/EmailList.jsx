import React from "react"
import { Star, StarOff, Clock } from "lucide-react"

export const EmailList = ({
  emails,
  selectedEmail,
  onSelectEmail,
  onToggleStar,
  showImportantOnly = false
}) => {
  const filteredEmails = showImportantOnly
    ? emails.filter(email => email.isImportant)
    : emails

  const formatTime = date => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      })
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      })
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {filteredEmails.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <Clock size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No emails to display</p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {filteredEmails.map(email => (
            <div
              key={email.id}
              onClick={() => onSelectEmail(email)}
              className={`p-4 cursor-pointer transition-colors duration-200 hover:bg-gray-50 ${
                selectedEmail?.id === email.id
                  ? "bg-blue-50 border-r-4 border-blue-600"
                  : ""
              } ${!email.isRead ? "bg-blue-25" : ""}`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={e => {
                    e.stopPropagation()
                    onToggleStar(email.id)
                  }}
                  className="mt-1 text-gray-400 hover:text-yellow-500 transition-colors duration-200"
                >
                  {email.isStarred ? (
                    <Star
                      size={16}
                      className="fill-yellow-500 text-yellow-500"
                    />
                  ) : (
                    <StarOff size={16} />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`text-sm font-medium truncate ${
                        !email.isRead ? "text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {email.from}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {formatTime(email.timestamp)}
                    </span>
                  </div>

                  <p
                    className={`text-sm mb-1 truncate ${
                      !email.isRead
                        ? "text-gray-900 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {email.subject}
                  </p>

                  <p className="text-xs text-gray-600 truncate">
                    {email.body.substring(0, 100)}...
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    {!email.isRead && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                    {email.isImportant && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        Important
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

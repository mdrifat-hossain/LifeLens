import React from "react"
import {
  Reply,
  ReplyAll,
  Forward,
  Archive,
  Trash2,
  Star,
  StarOff
} from "lucide-react"

export const EmailView = ({ email, onToggleStar, onCompose }) => {
  if (!email) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <Archive size={24} className="text-gray-500" />
          </div>
          <p className="text-gray-500 text-lg">Select an email to read</p>
        </div>
      </div>
    )
  }

  const formatFullDate = date => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    })
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              {email.subject}
            </h1>
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">{email.from}</span>
              <span className="mx-2">&lt;{email.fromEmail}&gt;</span>
              <span className="mx-2">to</span>
              <span>{email.to}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {formatFullDate(email.timestamp)}
            </p>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => onToggleStar(email.id)}
              className="p-2 text-gray-400 hover:text-yellow-500 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              {email.isStarred ? (
                <Star size={20} className="fill-yellow-500 text-yellow-500" />
              ) : (
                <StarOff size={20} />
              )}
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Archive size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onCompose("reply", email)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <Reply size={16} />
            Reply
          </button>
          <button
            onClick={() => onCompose("replyAll", email)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
          >
            <ReplyAll size={16} />
            Reply All
          </button>
          <button
            onClick={() => onCompose("forward", email)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
          >
            <Forward size={16} />
            Forward
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="prose max-w-none">
          {email.body.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

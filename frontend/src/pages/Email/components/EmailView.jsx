import React from "react"
import { useEffect } from "react";
import {
  Reply,
  ReplyAll,
  Forward,
  Archive,
  Trash2,
  Star,
  StarOff
} from "lucide-react"
import { useApi } from '../../../utils/api';


export const EmailView = ({ email, onToggleStar }) => {
  const { makeRequest } = useApi();

  useEffect(() => {
    if (email?.id) {
      const markAsRead = async () => {
        try {
          await makeRequest(`gmail/mark-read/${email.id}`, {
            method: "POST",
          });
          console.log(`📩 Marked email ${email.id} as read`);
        } catch (err) {
          console.error("❌ Failed to mark as read:", err);
        }
      };

      markAsRead();
    }
  }, [email?.id]);

  if (!email) {
    return (
      <div className="flex-1 flex items-center justify-center bg-light-background dark:bg-dark-background">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center">
            <Archive size={24} className="text-white" />
          </div>
          <p className="text-gray-400 text-lg">Select an email to read</p>
        </div>
      </div>
    )
  }

  const formatFullDate = date => {
    const formatDate = new Date(date);
    return formatDate.toLocaleDateString("en-US", {
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
    <div className="flex-1 flex flex-col bg-light-background dark:bg-dark-background min-w-0 overflow-hidden">
      <div className="border-b border-primary/50 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-dark-text mb-2">
              {email.subject}
            </h1>
            <div className="flex items-center text-sm text-gray-600 dark:text-dark-text/60">
              <span className="font-medium">{email.from}</span>
              <span className="mx-2">&lt;{email.fromEmail}&gt;</span>
              <span className="mx-2">to</span>
              <span>{email.to}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-dark-text/40 mt-1">
              {formatFullDate(email.timestamp)}
            </p>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => onToggleStar(email.id)}
              className="p-2 text-gray-400 hover:text-yellow-500 rounded-lg  transition-colors duration-200"
            >
              {email.isStarred ? (
                <Star size={20} className="fill-yellow-500 text-yellow-500" />
              ) : (
                <StarOff size={20} />
              )}
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg  transition-colors duration-200">
              <Archive size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-500 rounded-lg  transition-colors duration-200">
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* <div className="flex gap-2">
          <button
            onClick={() => onCompose("reply", email)}
            className="px-4 py-2 bg-primary text-light-text rounded-lg hover:bg-primary/80 cursor-pointer transition-colors duration-200 flex items-center gap-2"
          >
            <Reply size={16} />
            Reply
          </button>
          <button
            onClick={() => onCompose("replyAll", email)}
            className="px-4 py-2 border border-primary text-gray-700 dark:text-dark-text rounded-lg cursor-pointer hover:border-accent transition-colors duration-200 flex items-center gap-2"
          >
            <ReplyAll size={16} />
            Reply All
          </button>
          <button
            onClick={() => onCompose("forward", email)}
            className="px-4 py-2 border border-primary text-gray-700 dark:text-dark-text rounded-lg cursor-pointer hover:border-accent transition-colors duration-200 flex items-center gap-2"
          >
            <Forward size={16} />
            Forward
          </button>
        </div> */}
      </div>

      <div className="flex-1 p-6 overflow-y-auto overflow-x-hidden min-h-0 scrollbar-hide">
        <div className="prose max-w-2xl whitespace-pre-wrap email-body">
          {email.body.split("\n").map((paragraph, index) => (
            <p
              key={index}
              className="mb-4 text-gray-700 dark:text-dark-text leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

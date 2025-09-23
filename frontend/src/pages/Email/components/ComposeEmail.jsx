import React, { useState, useEffect } from "react"
import { X, Send, Save } from "lucide-react"

export const ComposeEmail = ({
  onClose,
  onSend,
  onSaveDraft,
  replyTo,
  composeType
}) => {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")

  useEffect(() => {
    if (replyTo && composeType) {
      switch (composeType) {
        case "reply":
          setTo(replyTo.fromEmail)
          setSubject(
            replyTo.subject.startsWith("Re:")
              ? replyTo.subject
              : `Re: ${replyTo.subject}`
          )
          setBody(
            `\n\nOn ${replyTo.timestamp.toLocaleDateString()}, ${
              replyTo.from
            } wrote:\n> ${replyTo.body.replace(/\n/g, "\n> ")}`
          )
          break
        case "replyAll":
          setTo(replyTo.fromEmail)
          setSubject(
            replyTo.subject.startsWith("Re:")
              ? replyTo.subject
              : `Re: ${replyTo.subject}`
          )
          setBody(
            `\n\nOn ${replyTo.timestamp.toLocaleDateString()}, ${
              replyTo.from
            } wrote:\n> ${replyTo.body.replace(/\n/g, "\n> ")}`
          )
          break
        case "forward":
          setSubject(
            replyTo.subject.startsWith("Fwd:")
              ? replyTo.subject
              : `Fwd: ${replyTo.subject}`
          )
          setBody(
            `\n\n---------- Forwarded message ---------\nFrom: ${
              replyTo.from
            } <${
              replyTo.fromEmail
            }>\nDate: ${replyTo.timestamp.toLocaleDateString()}\nSubject: ${
              replyTo.subject
            }\nTo: ${replyTo.to}\n\n${replyTo.body}`
          )
          break
      }
    }
  }, [replyTo, composeType])

  const handleSend = () => {
    if (to && subject && body) {
      onSend({ to, subject, body })
      onClose()
    }
  }

  const handleSaveDraft = () => {
    if (to || subject || body) {
      onSaveDraft({ to, subject, body })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[600px] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {composeType === "reply"
              ? "Reply"
              : composeType === "replyAll"
              ? "Reply All"
              : composeType === "forward"
              ? "Forward"
              : "New Email"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 w-16">
              To:
            </label>
            <input
              type="email"
              value={to}
              onChange={e => setTo(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="recipient@example.com"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 w-16">
              Subject:
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Email subject"
            />
          </div>
        </div>

        <div className="flex-1 p-4">
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            className="w-full h-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Type your message here..."
          />
        </div>

        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleSaveDraft}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2 transition-colors duration-200"
          >
            <Save size={16} />
            Save Draft
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!to || !subject || !body}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
            >
              <Send size={16} />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

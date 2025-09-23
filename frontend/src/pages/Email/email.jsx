import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { EmailList } from './components/EmailList';
import { EmailView } from './components/EmailView';
import { ComposeEmail } from './components/ComposeEmail';
import { AIChatbot } from './components/AIChatbot';
import { useEmails } from './hooks/useEmails';

function Email() {
    const {
        emails,
        sentEmails,
        selectedEmail,
        setSelectedEmail,
        markAsRead,
        toggleStar,
        sendEmail,
        saveDraft,
    } = useEmails();

    const [activeView, setActiveView] = useState('inbox');
    const [activeTab, setActiveTab] = useState('important');
    const [showCompose, setShowCompose] = useState(false);
    const [composeType, setComposeType] = useState();
    const [replyToEmail, setReplyToEmail] = useState();
    const [isAIMinimized, setIsAIMinimized] = useState(false);

    const unreadCount = emails.filter(email => !email.isRead).length;

    const handleSelectEmail = (email) => {
        setSelectedEmail(email);
        if (!email.isRead) {
            markAsRead(email.id);
        }
    };

    const handleViewChange = (view) => {
        setActiveView(view);
        setSelectedEmail(null);
        if (view === 'compose') {
            setShowCompose(true);
            setComposeType(undefined);
            setReplyToEmail(undefined);
        }
    };

    const handleCompose = (type, email) => {
        setComposeType(type);
        setReplyToEmail(email);
        setShowCompose(true);
    };

    const handleSendEmail = (emailData) => {
        sendEmail(emailData);
        setShowCompose(false);
        setComposeType(undefined);
        setReplyToEmail(undefined);
    };

    const handleSaveDraft = (draft) => {
        saveDraft(draft);
    };

    const getDisplayEmails = () => {
        switch (activeView) {
            case 'sent':
                return sentEmails;
            case 'starred':
                return emails.filter(email => email.isStarred);
            default:
                return emails;
        }
    };

    const displayEmails = getDisplayEmails();

    return (
        <div className="h-screen bg-light-background dark:bg-dark-background flex">
            <Sidebar
                activeView={activeView}
                onViewChange={handleViewChange}
                unreadCount={unreadCount}
            />

            <div className="flex-1 flex">
                <div className="flex-1 flex flex-col">
                    {/* Header with tabs for inbox view */}
                    {activeView === 'inbox' && (
                        <div className="bg-light-background dark:bg-dark-background border-b border-accent/20 px-6 py-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">Inbox</h2>
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setActiveTab('important')}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${activeTab === 'important'
                                            ? 'bg-white text-accent shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        Important
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('all')}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${activeTab === 'all'
                                            ? 'bg-white text-accent shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        All Mail
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Other view headers */}
                    {activeView !== 'inbox' && (
                        <div className="bg-light-background dark:bg-dark-background border-b border-gray-200 px-6 py-4">
                            <h2 className="text-xl font-semibold text-gray-900 capitalize">
                                {activeView === 'sent' ? 'Sent Mail' : activeView}
                            </h2>
                        </div>
                    )}

                    <div className="flex-1 flex">
                        {/* Email List */}
                        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                            <EmailList
                                emails={displayEmails}
                                selectedEmail={selectedEmail}
                                onSelectEmail={handleSelectEmail}
                                onToggleStar={toggleStar}
                                showImportantOnly={activeView === 'inbox' && activeTab === 'important'}
                            />
                        </div>

                        {/* Email View */}
                        <EmailView
                            email={selectedEmail}
                            onToggleStar={toggleStar}
                            onCompose={handleCompose}
                        />
                    </div>
                </div>

                {/* AI Chatbot */}
                <AIChatbot
                    isMinimized={isAIMinimized}
                    onToggleMinimize={() => setIsAIMinimized(!isAIMinimized)}
                />
            </div>

            {/* Compose Modal */}
            {showCompose && (
                <ComposeEmail
                    onClose={() => {
                        setShowCompose(false);
                        setComposeType(undefined);
                        setReplyToEmail(undefined);
                    }}
                    onSend={handleSendEmail}
                    onSaveDraft={handleSaveDraft}
                    replyTo={replyToEmail}
                    composeType={composeType}
                />
            )}
        </div>
    );
}

export default Email;

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
        spamEmails,
        selectedEmail,
        isUserLoggedIn,
        isLoading,
        setSelectedEmail,
        markAsRead,
        toggleStar,
        sendEmail,
        saveDraft,
        setIsUserLoggedIn,
        emailLogin,
        setIsLoading,
        signOut
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
            case 'spam':
                return spamEmails;
            case 'starred':
                return emails.filter(email => email.isStarred);
            default:
                return emails;
        }
    };

    const displayEmails = getDisplayEmails();

    return (
        <div className="h-[calc(100vh-4rem)] bg-light-background dark:bg-dark-background flex overflow-hidden">
            <Sidebar
                activeView={activeView}
                onViewChange={handleViewChange}
                unreadCount={unreadCount}
                isUserLoggedIn={isUserLoggedIn}
                emailLogin={emailLogin}
                signOut={signOut}
            />

            <div className="flex-1 flex">
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Header with tabs for inbox view */}
                    {activeView === 'inbox' && (
                        <div className="bg-light-background dark:bg-dark-background border-b border-accent/20 px-6 py-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">Inbox</h2>
                                <div className="flex bg-gray-100 dark:bg-primary rounded-lg p-1">
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
                        <div className="bg-light-background dark:bg-dark-background border-b border-accent/20 px-6 py-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text capitalize">
                                {activeView === 'sent' ? 'Sent Mail' : activeView}
                            </h2>
                        </div>
                    )}

                    <div className="flex-1 flex min-h-0">
                        {/* Email List */}
                        {/* Email List */}
                        <div className="w-80 bg-light-background dark:bg-dark-background border-r border-accent/50 flex flex-col min-h-0 overflow-hidden">
                            <EmailList
                                emails={displayEmails}
                                selectedEmail={selectedEmail}
                                onSelectEmail={handleSelectEmail}
                                onToggleStar={toggleStar}
                                showImportantOnly={activeView === 'inbox' && activeTab === 'important'}
                                isLoading={isLoading}
                            />
                        </div>



                        {/* Email View */}
                        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
                            <EmailView
                                email={selectedEmail}
                                onToggleStar={toggleStar}
                                onCompose={handleCompose}
                            />
                        </div>
                    </div>
                </div>

                {/* AI Chatbot */}
                <AIChatbot
                    isMinimized={isAIMinimized}
                    onToggleMinimize={() => setIsAIMinimized(!isAIMinimized)}
                    isUserLoggedIn={isUserLoggedIn}
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

import { useState, useEffect } from 'react';
import { Email, Draft } from '../types/Email';
import { mockEmails, mockSentEmails } from '../data/mockEmails';

export const useEmails = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [sentEmails, setSentEmails] = useState<Email[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  useEffect(() => {
    // Simulate loading emails
    setEmails(mockEmails);
    setSentEmails(mockSentEmails);
  }, []);

  const markAsRead = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, isRead: true } : email
    ));
  };

  const toggleStar = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
    ));
  };

  const toggleImportant = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, isImportant: !email.isImportant } : email
    ));
  };

  const saveDraft = (draft: Omit<Draft, 'id' | 'timestamp'>) => {
    const newDraft: Draft = {
      ...draft,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setDrafts(prev => [...prev, newDraft]);
  };

  const sendEmail = (emailData: { to: string; subject: string; body: string }) => {
    const newEmail: Email = {
      id: `sent-${Date.now()}`,
      from: 'You',
      fromEmail: 'you@example.com',
      to: emailData.to,
      subject: emailData.subject,
      body: emailData.body,
      timestamp: new Date(),
      isRead: true,
      isImportant: false,
      isStarred: false,
    };
    setSentEmails(prev => [newEmail, ...prev]);
  };

  return {
    emails,
    sentEmails,
    drafts,
    selectedEmail,
    setSelectedEmail,
    markAsRead,
    toggleStar,
    toggleImportant,
    saveDraft,
    sendEmail,
  };
};
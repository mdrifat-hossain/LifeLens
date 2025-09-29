import { useState, useEffect } from 'react';
import { Email, Draft } from '../types/Email';
import { mockEmails, mockSentEmails } from '../data/mockEmails';
import { useApi } from '../../../utils/api';

export const useEmails = () => {
  const { makeRequest } = useApi();

  const [emails, setEmails] = useState<Email[]>([]);
  const [sentEmails, setSentEmails] = useState<Email[]>([]);
  const [spamEmails, setSpamEmails] = useState<Email[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    checkLogin();
    // setEmails(mockEmails);
    // setSentEmails(mockSentEmails);
  }, []);

  // useEffect(() => {
  //   console.log("Emails updated:", sentEmails);
  // }, [sentEmails]);


  const checkLogin = async () => {
    try {
      const data = await makeRequest("auth/status");

      if (data.logged_in) {
        setIsUserLoggedIn(true);
        getEmail();
      } else {
        setIsUserLoggedIn(false);
      }
    } catch (err) {
      console.error("❌ Error checking login status:", err);
    }
  };

  const signOut = async () => {
    try {
      const res = await makeRequest("auth/logout", {
        method: "POST"
      });

      if(res.status == "success"){
        setIsUserLoggedIn(false);
        setEmails([]);
        setSentEmails([]);
        setSpamEmails([])
      }
      
    } catch (err) {
      console.error("❌ Error checking login status:", err);
    }
  };


  const emailLogin = async () => {
    try {
      const res = await makeRequest("auth/google/login");
      window.location.href = res.auth_url; // redirect to Google login
    } catch (err) {
      console.error("❌ Error starting Google login:", err);
    }
  };

  const getEmail = async () => {
    setIsLoading(true)
    try {
      const [inboxRes, sentRes, spamRes] = await Promise.all([
        makeRequest("gmail/inbox"),
        makeRequest("gmail/sent"),
        makeRequest("gmail/spam")
      ]);


      setEmails(inboxRes.messages);
      setSentEmails(sentRes.messages);
      setSpamEmails(spamRes.messages)
    } catch (err) {
      console.error("❌ Error fetching emails:", err);
    } finally {
      setIsLoading(false)
    }
  };



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
      timestamp: "",
      isRead: true,
      isImportant: false,
      isStarred: false,
    };
    setSentEmails(prev => [newEmail, ...prev]);
  };

  return {
    emails,
    sentEmails,
    spamEmails,
    drafts,
    selectedEmail,
    isUserLoggedIn,
    isLoading,
    setSelectedEmail,
    markAsRead,
    toggleStar,
    toggleImportant,
    saveDraft,
    sendEmail,
    setIsUserLoggedIn,
    emailLogin,
    setIsLoading,
    signOut
  };
};
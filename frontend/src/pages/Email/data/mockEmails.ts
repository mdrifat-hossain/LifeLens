import { Email } from '../types/Email';

export const mockEmails: Email[] = [
  {
    id: '3',
    from: 'LinkedIn Notifications',
    fromEmail: 'notifications@linkedin.com',
    to: 'you@example.com',
    subject: 'You have 3 new connection requests',
    body: `You have 3 new connection requests waiting for your response.

View and respond to these requests in your LinkedIn inbox.`,
    timestamp: '2025-09-25T19:58:27.218508',
    isRead: true,
    isImportant: false,
    isStarred: false,
  },
  {
    id: '4',
    from: 'GitHub',
    fromEmail: 'noreply@github.com',
    to: 'you@example.com',
    subject: '[GitHub] Security Alert: New SSH key added',
    body: `A new SSH key was recently added to your account.

If this was you, you can safely ignore this email. If not, please secure your account immediately.`,
    timestamp: '2025-09-25T19:58:27.218508',
    isRead: false,
    isImportant: false,
    isStarred: false,
  }
];

export const mockSentEmails: Email[] = [
  {
    id: 's1',
    from: 'You',
    fromEmail: 'you@example.com',
    to: 'client@business.com',
    subject: 'Project Proposal - Next Steps',
    body: `Dear Client,

Thank you for taking the time to review our project proposal. I'm excited about the opportunity to work together.

As discussed, I've attached the detailed timeline and budget breakdown. Please let me know if you have any questions or would like to schedule a call to discuss further.

Looking forward to your feedback.

Best regards,
[Your Name]`,
    timestamp: '2025-09-25T19:58:27.218508',
    isRead: true,
    isImportant: false,
    isStarred: false,
  },
  {
    id: 's2',
    from: 'You',
    fromEmail: 'you@example.com',
    to: 'hr@company.com',
    subject: 'Vacation Request - December 23-30',
    body: `Hi HR Team,

I would like to request vacation time from December 23rd to December 30th for the holidays.

I've ensured that all my current projects will be completed before my departure, and I've briefed my team on any urgent matters.

Please let me know if you need any additional information.

Thank you,
[Your Name]`,
    timestamp: '2025-09-25T19:58:27.218508',
    isRead: true,
    isImportant: false,
    isStarred: false,
  }
];


[
    {
        "id": "1",
        "from": "Sarah Chen",
        "fromEmail": "sarah.chen@company.com",
        "to": "you@example.com",
        "subject": "Q4 Marketing Campaign Results",
        "body": "Hi there,\n\nI wanted to share the exciting results from our Q4 marketing campaign. We exceeded our targets by 23% and saw significant engagement across all channels.\n\nKey highlights:\n- Email open rate: 32% (industry average: 21%)\n- Click-through rate: 8.5% (industry average: 2.6%)\n- Conversion rate: 4.2% (previous quarter: 2.8%)\n\nThe creative team did an outstanding job with the visuals, and the personalization strategy really paid off. I'd love to schedule a meeting to discuss how we can build on this success for Q1.\n\nBest regards,\nSarah",
        "timestamp": "2024-12-15T08:30:00.000Z",
        "isRead": false,
        "isImportant": true,
        "isStarred": true
    },
    {
        "id": "2",
        "from": "Alex Rodriguez",
        "fromEmail": "alex@startup.co",
        "to": "you@example.com",
        "subject": "Partnership Opportunity",
        "body": "Hello,\n\nI hope this email finds you well. I'm reaching out regarding a potential partnership opportunity between our companies.\n\nWe've been following your recent product launches and are impressed with your innovation in the space. I believe there could be significant synergies between our platforms.\n\nWould you be available for a brief call next week to explore this further?\n\nLooking forward to hearing from you.\n\nBest,\nAlex Rodriguez",
        "timestamp": "2024-12-15T05:15:00.000Z",
        "isRead": true,
        "isImportant": true,
        "isStarred": false
    }
];

[
    {
        "id": "199814ebbdb72753",
        "from": "Sololearn",
        "fromEmail": "team@info.sololearn.com",
        "to": "thomasalvert31@gmail.com",
        "subject": "What are you going to do, Alvert?",
        "body": "(No Content)",
        "timestamp": "2025-09-25T19:58:27.218508",
        "isRead": false,
        "isImportant": false,
        "isStarred": false
    },
    {
        "id": "1997d62b2db45c6a",
        "from": "Dreamstime",
        "fromEmail": "noreply@dreamstime.com",
        "to": "Thomasalvert31 <thomasalvert31@gmail.com>",
        "subject": "Important: Update Your Password for Enhanced Security",
        "body": "(No Content)",
        "timestamp": "2025-09-25T19:58:29.460416",
        "isRead": false,
        "isImportant": false,
        "isStarred": false
    },
    {
        "id": "1997c285f033b4aa",
        "from": "Sololearn",
        "fromEmail": "team@info.sololearn.com",
        "to": "thomasalvert31@gmail.com",
        "subject": "How fast do you learn, Alvert?",
        "body": "(No Content)",
        "timestamp": "2025-09-25T19:58:30.762968",
        "isRead": false,
        "isImportant": false,
        "isStarred": false
    }
]

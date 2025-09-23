import { Email } from '../types/Email';

export const mockEmails: Email[] = [
  {
    id: '1',
    from: 'Sarah Chen',
    fromEmail: 'sarah.chen@company.com',
    to: 'you@example.com',
    subject: 'Q4 Marketing Campaign Results',
    body: `Hi there,

I wanted to share the exciting results from our Q4 marketing campaign. We exceeded our targets by 23% and saw significant engagement across all channels.

Key highlights:
- Email open rate: 32% (industry average: 21%)
- Click-through rate: 8.5% (industry average: 2.6%)
- Conversion rate: 4.2% (previous quarter: 2.8%)

The creative team did an outstanding job with the visuals, and the personalization strategy really paid off. I'd love to schedule a meeting to discuss how we can build on this success for Q1.

Best regards,
Sarah`,
    timestamp: new Date(2024, 11, 15, 14, 30),
    isRead: false,
    isImportant: true,
    isStarred: true,
  },
  {
    id: '2',
    from: 'Alex Rodriguez',
    fromEmail: 'alex@startup.co',
    to: 'you@example.com',
    subject: 'Partnership Opportunity',
    body: `Hello,

I hope this email finds you well. I'm reaching out regarding a potential partnership opportunity between our companies.

We've been following your recent product launches and are impressed with your innovation in the space. I believe there could be significant synergies between our platforms.

Would you be available for a brief call next week to explore this further?

Looking forward to hearing from you.

Best,
Alex Rodriguez`,
    timestamp: new Date(2024, 11, 15, 11, 15),
    isRead: true,
    isImportant: true,
    isStarred: false,
  },
  {
    id: '3',
    from: 'LinkedIn Notifications',
    fromEmail: 'notifications@linkedin.com',
    to: 'you@example.com',
    subject: 'You have 3 new connection requests',
    body: `You have 3 new connection requests waiting for your response.

View and respond to these requests in your LinkedIn inbox.`,
    timestamp: new Date(2024, 11, 15, 9, 0),
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
    timestamp: new Date(2024, 11, 14, 16, 45),
    isRead: false,
    isImportant: false,
    isStarred: false,
  },
  {
    id: '5',
    from: 'Team Lead',
    fromEmail: 'teamlead@company.com',
    to: 'you@example.com',
    subject: 'Weekly Team Sync - Tomorrow 2PM',
    body: `Hi everyone,

Just a reminder that we have our weekly team sync tomorrow at 2PM. Please come prepared with your updates and any blockers you're facing.

Agenda:
1. Sprint progress review
2. Upcoming deadlines
3. Resource allocation
4. Q&A

See you there!`,
    timestamp: new Date(2024, 11, 14, 10, 30),
    isRead: true,
    isImportant: true,
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
    timestamp: new Date(2024, 11, 15, 13, 0),
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
    timestamp: new Date(2024, 11, 13, 9, 15),
    isRead: true,
    isImportant: false,
    isStarred: false,
  }
];
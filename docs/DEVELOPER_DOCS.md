# OutLoud Chrome Extension - Developer Documentation

### Permission Justifications

**activeTab**

- **Purpose**: Detect user's own posts on X.com and add archive buttons
- **Justification**: Required to identify and interact with user's content on X.com
- **User Benefit**: Enables seamless archival workflow without manual copying

**storage**

- **Purpose**: Temporarily store selected post data and user preferences
- **Justification**: Needed to transfer post data from webpage to extension popup
- **User Benefit**: Smooth user experience and preference persistence

**scripting**

- **Purpose**: Inject archive buttons into X.com interface
- **Justification**: Required to modify X.com DOM and add extension functionality
- **User Benefit**: Native integration with social media platform

### Technical Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Content       │    │   Background     │    │   Popup         │
│   Script        │◄──►│   Service Worker │◄──►│   Interface     │
│   (X.com)       │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Page Script   │    │   Chrome APIs    │    │   Wallet        │
│   (Wallet Det.) │    │   (Storage, etc.)│    │   Integration   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Data Flow

1. User clicks "Repost on Bitcoin" on their post
2. Content script extracts post data (author, content, timestamp)
3. Data stored temporarily in Chrome local storage
4. Background script opens popup and signals data availability
5. Popup retrieves data and presents to user
6. User enters recipient address and confirms
7. Wallet service creates inscription order
8. Payment processed through user's Bitcoin wallet

### Privacy Compliance

**GDPR Compliance**

- No personal data collection beyond explicitly selected posts
- Data processing only with user consent (explicit button clicks)
- Local data storage only (no external databases)
- Right to deletion (uninstalling extension removes all data)

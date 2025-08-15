import { Content } from "../interfaces/content";

export class DusmService {
  private static instance: DusmService;
  private mockPosts: Content[] = [
    {
      id: "1",
      author: "@satoshi",
      content:
        "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks. Digital freedom starts here.",
      platform: "x.com",
      timestamp: "2024-01-15T10:30:00Z",
      likes: 2847,
      isLiked: false,
      inscription_id: "abc123...def456",
      btc_address: "bc1q...",
    },
    {
      id: "2",
      author: "@halfin",
      content:
        "Running bitcoin. This is the future of money and freedom of speech combined.",
      platform: "x.com",
      timestamp: "2024-01-14T15:45:00Z",
      likes: 1923,
      isLiked: true,
      inscription_id: "xyz789...uvw012",
      btc_address: "bc1q...",
    },
    {
      id: "3",
      author: "@anon_btc",
      content:
        "Decentralized social media is not just about technology, it's about preserving human expression for eternity.",
      platform: "x.com",
      timestamp: "2024-01-14T09:20:00Z",
      likes: 756,
      isLiked: false,
      inscription_id: "mno345...pqr678",
      btc_address: "bc1q...",
    },
    {
      id: "4",
      author: "@cryptopoet",
      content:
        "Every transaction tells a story,\nEvery block holds our memory,\nOn the timechain, we are free,\nTo speak our truth eternally.",
      platform: "x.com",
      timestamp: "2024-01-13T20:15:00Z",
      likes: 432,
      isLiked: false,
      inscription_id: "stu901...vwx234",
      btc_address: "bc1q...",
    },
    {
      id: "5",
      author: "@freedomdude",
      content:
        "They can censor our accounts, but they cannot censor the blockchain. Our voices live forever here. #StayFree",
      platform: "x.com",
      timestamp: "2024-01-13T14:30:00Z",
      likes: 1205,
      isLiked: true,
      inscription_id: "ghi567...jkl890",
      btc_address: "bc1q...",
    },
    {
      id: "6",
      author: "@techvisionary",
      content:
        "The future is decentralized. Social media on Bitcoin is just the beginning of a new era of digital sovereignty.",
      platform: "x.com",
      timestamp: "2024-01-12T11:45:00Z",
      likes: 891,
      isLiked: false,
      inscription_id: "bcd123...efg456",
      btc_address: "bc1q...",
    },
    {
      id: "7",
      author: "@btcmaxi",
      content:
        "Orange coin good. Orange coin forever. Every sat tells a story, every inscription preserves history.",
      platform: "x.com",
      timestamp: "2024-01-12T08:20:00Z",
      likes: 1647,
      isLiked: true,
      inscription_id: "hij789...klm012",
      btc_address: "bc1q...",
    },
    {
      id: "8",
      author: "@digitalrebel",
      content:
        "Traditional social media: Your content, their rules.\nBitcoin social media: Your content, your rules, forever.",
      platform: "x.com",
      timestamp: "2024-01-11T16:55:00Z",
      likes: 567,
      isLiked: false,
      inscription_id: "nop345...qrs678",
      btc_address: "bc1q...",
    },
    {
      id: "9",
      author: "@timechainphil",
      content:
        "In a world of temporary tweets and fleeting posts, we choose permanence. We choose truth. We choose Bitcoin.",
      platform: "x.com",
      timestamp: "2024-01-11T12:10:00Z",
      likes: 923,
      isLiked: false,
      inscription_id: "tuv901...wxy234",
      btc_address: "bc1q...",
    },
    {
      id: "10",
      author: "@sovereign",
      content:
        "Be your own bank. Be your own media. Be your own voice. The tools of freedom are in your hands.",
      platform: "x.com",
      timestamp: "2024-01-10T19:30:00Z",
      likes: 1334,
      isLiked: true,
      inscription_id: "zab567...cde890",
      btc_address: "bc1q...",
    },
  ];

  public static getInstance(): DusmService {
    if (!DusmService.instance) {
      DusmService.instance = new DusmService();
    }
    return DusmService.instance;
  }

  public async getFeedByAddress(address: string): Promise<Content[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock data, to implement the real one
    const addressHash = address
      .split("")
      .reduce((a, b) => a + b.charCodeAt(0), 0);
    const startIndex = addressHash % 3;
    const endIndex = startIndex + 7;

    return this.mockPosts.slice(startIndex, endIndex);
  }

  public async likePost(postId: string): Promise<boolean> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const post = this.mockPosts.find((p) => p.id === postId);
    if (post) {
      post.isLiked = !post.isLiked;
      post.likes += post.isLiked ? 1 : -1;
      return true;
    }
    return false;
  }
}

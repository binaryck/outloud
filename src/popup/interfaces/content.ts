export interface Content {
  id: string;
  author: string;
  content: string;
  platform: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  inscription_id?: string;
  btc_address?: string;
}

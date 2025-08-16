import { Content } from "../interfaces/content";

export class DusmService {
  private static instance: DusmService;

  //Add getFeedByAddress

  public static getInstance(): DusmService {
    if (!DusmService.instance) {
      DusmService.instance = new DusmService();
    }
    return DusmService.instance;
  }

  public async likePost(postId: string): Promise<boolean> {
    //Service to inscribe a like on a post
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return true; // Mock response, to implement the real one
  }
}

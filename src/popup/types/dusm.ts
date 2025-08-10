export type DusmPost = {
  p: string; // "dusm"
  op: string; // "pub"
  type: string; // "post"
  txt: string; // Post content
  author?: string; // Author of the post
  from?: string; // Platform (e.g., "x", "bluesky")
  edit: boolean; // Whether this is an edit
};

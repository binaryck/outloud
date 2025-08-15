export interface Content {
  tx_id: string;
  input_index: string;
  inscription_id: string;
  inscription_number: string;
  block_height: string;
  content_str: string;
  content: any; // Add type
  content_type_str: string;
  content_hash: string;
  content_length: string;
  metadata_str: string;
  created_at: string;
  owner: string;
  protocol: string;
}

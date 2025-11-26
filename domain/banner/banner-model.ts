export interface Banner {
  id: number;
  target_url: string;
  image_url: string;
  start_time: string | null;
  end_time: string | null;
  created_at: string;
}

export function isValidBannerUrl(url: string): boolean {
  return url.startsWith('http');
}

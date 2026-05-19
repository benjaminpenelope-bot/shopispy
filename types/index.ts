export interface Product {
  id: string;
  title: string;
  niche: string;
  price: number;
  currency: string;
  saturation_score: number; // 0–100 (100 = saturé)
  trend_score: number;       // 0–100 (100 = trending fort)
  monthly_orders_estimate: number;
  image_url: string;
  store_url: string;
  tags: string[];
  created_at: string;
}

export interface ClonedProduct {
  id: string;
  product_id: string;
  user_id: string;
  title: string;
  hook: string;
  description: string;
  bullet_points: string[];
  target_audience: string;
  ad_angle: string;
  seo_keywords: string[];
  suggested_price: number;
  suggested_price_rationale: string;
  created_at: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  created_at: string;
}

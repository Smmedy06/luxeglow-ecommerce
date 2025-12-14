export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number;
          brand: string;
          name: string;
          price: string;
          category: string;
          image: string;
          description: string | null;
          in_stock: boolean;
          stock_count: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          brand: string;
          name: string;
          price: string;
          category: string;
          image: string;
          description?: string | null;
          in_stock?: boolean;
          stock_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          brand?: string;
          name?: string;
          price?: string;
          category?: string;
          image?: string;
          description?: string | null;
          in_stock?: boolean;
          stock_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: number;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: number;
          quantity: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: number;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          order_number: string;
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          total: number;
          tax: number;
          discount: number | null;
          promo_code: string | null;
          shipping_address: {
            name: string;
            address: string;
            address2?: string | null;
            city: string;
            state?: string | null;
            postal_code: string;
            country: string;
            delivery_instructions?: string | null;
          };
          tracking_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_number: string;
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          total: number;
          tax: number;
          discount?: number | null;
          promo_code?: string | null;
          shipping_address: {
            name: string;
            address: string;
            address2?: string | null;
            city: string;
            state?: string | null;
            postal_code: string;
            country: string;
            delivery_instructions?: string | null;
          };
          tracking_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          order_number?: string;
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          total?: number;
          tax?: number;
          discount?: number | null;
          promo_code?: string | null;
          shipping_address?: {
            name: string;
            address: string;
            address2?: string | null;
            city: string;
            state?: string | null;
            postal_code: string;
            country: string;
            delivery_instructions?: string | null;
          };
          tracking_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: number;
          quantity: number;
          price: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: number;
          quantity: number;
          price: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: number;
          quantity?: number;
          price?: string;
          created_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          phone: string | null;
          address: string | null;
          address2: string | null;
          city: string | null;
          state: string | null;
          postal_code: string | null;
          country: string | null;
          delivery_instructions: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          phone?: string | null;
          address?: string | null;
          address2?: string | null;
          city?: string | null;
          state?: string | null;
          postal_code?: string | null;
          country?: string | null;
          delivery_instructions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          phone?: string | null;
          address?: string | null;
          address2?: string | null;
          city?: string | null;
          state?: string | null;
          postal_code?: string | null;
          country?: string | null;
          delivery_instructions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}


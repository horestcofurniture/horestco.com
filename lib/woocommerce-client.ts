import OAuth from 'oauth-1.0a';

export interface WooCommerceClientConfig {
  url: string;
  consumerKey: string;
  consumerSecret: string;
  version?: string;
}

export interface WooCommerceResponse<T = any> {
  data: T;
  status: number;
  headers: Headers;
}

export class WooCommerceRestClient {
  private readonly baseURL: string;
  private readonly consumerKey: string;
  private readonly consumerSecret: string;
  
  constructor(config: WooCommerceClientConfig) {
    if (!config.url || !config.consumerKey || !config.consumerSecret) {
      throw new Error('WooCommerce API credentials are required');
    }
    
    this.baseURL = `${config.url.replace(/\/$/, '')}/wp-json/${config.version || 'wc/v3'}`;
    this.consumerKey = config.consumerKey;
    this.consumerSecret = config.consumerSecret;
  }

  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${this.baseURL}/${endpoint.replace(/^\//, '')}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  private getAuthHeaders(): Record<string, string> {
    // WooCommerce REST API uses Basic Auth with consumer key and secret
    const credentials = `${this.consumerKey}:${this.consumerSecret}`;
    const encodedCredentials = btoa(credentials);
    
    return {
      'Authorization': `Basic ${encodedCredentials}`,
      'Content-Type': 'application/json',
    };
  }

  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<WooCommerceResponse<T>> {
    const url = this.buildURL(endpoint, params);
    const headers = this.getAuthHeaders();
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      data,
      status: response.status,
      headers: response.headers,
    };
  }

  async post<T = any>(endpoint: string, data?: any, params?: Record<string, any>): Promise<WooCommerceResponse<T>> {
    const url = this.buildURL(endpoint, params);
    const headers = this.getAuthHeaders();
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    
    return {
      data: responseData,
      status: response.status,
      headers: response.headers,
    };
  }

  async put<T = any>(endpoint: string, data?: any, params?: Record<string, any>): Promise<WooCommerceResponse<T>> {
    const url = this.buildURL(endpoint, params);
    const headers = this.getAuthHeaders();
    
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    
    return {
      data: responseData,
      status: response.status,
      headers: response.headers,
    };
  }

  async delete<T = any>(endpoint: string, params?: Record<string, any>): Promise<WooCommerceResponse<T>> {
    const url = this.buildURL(endpoint, params);
    const headers = this.getAuthHeaders();
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      data,
      status: response.status,
      headers: response.headers,
    };
  }
}

// Factory function to create WooCommerce client instance
export function createWooCommerceClient(): WooCommerceRestClient {
  const url = process.env.WOOCOMMERCE_URL;
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  
  if (!url || !consumerKey || !consumerSecret) {
    throw new Error('WooCommerce API credentials are required. Please check your environment variables: WOOCOMMERCE_URL, WOOCOMMERCE_CONSUMER_KEY, WOOCOMMERCE_CONSUMER_SECRET');
  }
  
  return new WooCommerceRestClient({
    url,
    consumerKey,
    consumerSecret,
    version: 'wc/v3',
  });
} 
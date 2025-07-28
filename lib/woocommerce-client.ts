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

// Web Crypto API compatible hash function for edge runtimes
async function hmacSha1(key: string, baseString: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const baseStringData = encoder.encode(baseString);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, baseStringData);
  const signatureArray = new Uint8Array(signature);
  
  // Convert to base64
  return btoa(String.fromCharCode(...signatureArray));
}

export class WooCommerceRestClient {
  private readonly baseURL: string;
  private readonly oauth: OAuth;
  
  constructor(config: WooCommerceClientConfig) {
    if (!config.url || !config.consumerKey || !config.consumerSecret) {
      throw new Error('WooCommerce API credentials are required');
    }
    
    this.baseURL = `${config.url.replace(/\/$/, '')}/wp-json/${config.version || 'wc/v3'}`;
    
    this.oauth = new OAuth({
      consumer: {
        key: config.consumerKey,
        secret: config.consumerSecret,
      },
      signature_method: 'HMAC-SHA1',
      hash_function: (base_string, key) => {
        // This will be handled asynchronously in getAuthHeaders
        return '';
      },
    });
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

  private async getAuthHeaders(method: string, url: string): Promise<Record<string, string>> {
    const requestData = {
      url,
      method: method.toUpperCase(),
    };

    // Generate the authorization data without signature first
    const authData = this.oauth.authorize(requestData);
    
    // Create the signature base string manually
    const parameters: Record<string, string | number> = { ...authData };
    const parameterString = Object.keys(parameters)
      .sort()
      .map(key => `${key}=${encodeURIComponent(String(parameters[key]))}`)
      .join('&');
    
    const signatureBaseString = [
      method.toUpperCase(),
      encodeURIComponent(url.split('?')[0]),
      encodeURIComponent(parameterString)
    ].join('&');
    
    const signingKey = `${encodeURIComponent(this.oauth.consumer.secret)}&`;
    
    // Generate signature using Web Crypto API
    const signature = await hmacSha1(signingKey, signatureBaseString);
    
    // Add signature to auth data
    authData.oauth_signature = signature;
    
    const authHeader = this.oauth.toHeader(authData);
    
    return {
      'Authorization': authHeader.Authorization,
      'Content-Type': 'application/json',
    };
  }

  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<WooCommerceResponse<T>> {
    const url = this.buildURL(endpoint, params);
    const headers = await this.getAuthHeaders('GET', url);
    
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
    const headers = await this.getAuthHeaders('POST', url);
    
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
    const headers = await this.getAuthHeaders('PUT', url);
    
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
    const headers = await this.getAuthHeaders('DELETE', url);
    
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

// Create and export a singleton instance
export const wooCommerceClient = new WooCommerceRestClient({
  url: process.env.WOOCOMMERCE_URL || '',
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || '',
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || '',
  version: 'wc/v3',
}); 
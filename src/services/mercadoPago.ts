import { PaymentPreference } from '../types/payment';

class MercadoPagoService {
  private apiUrl: string;
  private accessToken: string;

  constructor() {
    this.accessToken = 'TEST-3286097988616751-102919-aa9578e50ee02d46daa50bf06f4576cc-96981334';
    this.apiUrl = 'https://api.mercadopago.com/checkout/preferences';
  }

  async createAndRedirect(data: PaymentPreference): Promise<void> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify({
          items: data.items,
          payer: data.payer,
          back_urls: {
            success: 'https://adorable-donut-d7c897.netlify.app/success',
            failure: 'https://adorable-donut-d7c897.netlify.app/failure',
            pending: 'https://adorable-donut-d7c897.netlify.app/pending'
          },
          auto_return: 'approved'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create preference');
      }

      const result = await response.json();
      
      // Redirect to MercadoPago checkout
      window.location.href = result.init_point;
    } catch (error) {
      console.error('Error creating preference:', error);
      throw new Error('Failed to create payment preference');
    }
  }
}

export const mercadoPagoService = new MercadoPagoService();
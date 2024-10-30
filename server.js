import express from 'express';
import cors from 'cors';
import { createServer } from 'vite';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize MercadoPago with your access token
const client = new MercadoPagoConfig({ 
  accessToken: 'TEST-3286097988616751-102919-aa9578e50ee02d46daa50bf06f4576cc-96981334'
});

app.post('/api/create-preference', async (req, res) => {
  try {
    const { packageNights, price, customerData } = req.body;

    const preference = new Preference(client);
    const result = await preference.create({
      items: [
        {
          title: `Pacote ${packageNights} Noites - Estacionamento Porto Santos`,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: price,
        },
      ],
      payer: {
        name: customerData.name,
        email: customerData.email,
        phone: {
          number: customerData.phone
        }
      },
      metadata: {
        licensePlate: customerData.licensePlate,
        startDate: customerData.startDate,
        packageNights: packageNights
      },
      back_urls: {
        success: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/success`,
        failure: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/failure`,
        pending: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/pending`
      },
      auto_return: 'approved',
      notification_url: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/api/webhooks/mercadopago`,
    });

    res.json({ preferenceId: result.id });
  } catch (error) {
    console.error('Error creating preference:', error);
    res.status(500).json({ error: 'Error creating payment preference' });
  }
});

// Webhook endpoint to receive payment notifications
app.post('/api/webhooks/mercadopago', async (req, res) => {
  try {
    const { data } = req.body;
    
    // Here you would typically:
    // 1. Verify the payment status
    // 2. Update your database
    // 3. Send confirmation email
    // 4. Update inventory/availability
    
    console.log('Payment notification received:', data);
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error processing webhook');
  }
});

// Create Vite server in middleware mode
const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'spa'
});

// Use vite's connect instance as middleware
app.use(vite.middlewares);

const port = process.env.PORT || 5173;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
    private stripe: Stripe;

    constructor(private configService: ConfigService) {
        this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY') || 'mock_key', {
            apiVersion: '2024-12-18.acacia',
        });
    }

    async createPaymentIntent(amount: number, currency: string = 'usd') {
        return this.stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: { enabled: true },
        });
    }

    async handleWebhook(signature: string, payload: Buffer) {
        const endpointSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        try {
            const event = this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
            // Handle specific events like payment_intent.succeeded
            return { received: true };
        } catch (err: any) {
            throw new Error(`Webhook Error: ${err.message}`);
        }
    }
}

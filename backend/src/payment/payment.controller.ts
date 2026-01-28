import { Controller, Post, Body, Headers, Request, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post('create-intent')
    async createPaymentIntent(@Body() body: { amount: number }) {
        // In a real app, calculate amount based on plan selected
        return this.paymentService.createPaymentIntent(body.amount);
    }

    @Post('webhook')
    async handleWebhook(@Headers('stripe-signature') signature: string, @Request() req) {
        if (!signature) throw new BadRequestException('Missing stripe-signature');
        // Note: In NestJS, raw body handling requires specific setup
        // For this implementation plan, we assume raw body is available
        return this.paymentService.handleWebhook(signature, req.rawBody);
    }
}

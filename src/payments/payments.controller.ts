import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('order')
  async createOrder(@Body('amount') amount: number, @Body('currency') currency: string) {
    return this.paymentsService.createOrder(amount, currency);
  }

  @Post('verify')
  async verifyPayment(@Body() paymentData: any) {
    const { order_id, payment_id, razorpay_signature } = paymentData;
    return this.paymentsService.verifyPaymentSignature(order_id, payment_id, razorpay_signature);
  }
}

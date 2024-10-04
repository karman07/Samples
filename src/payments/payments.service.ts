import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(amount: number, currency: string) {
    const options = {
      amount: amount * 100,
      currency,
      receipt: `receipt_order_${new Date().getTime()}`,
    };

    try {
      const order = await this.razorpay.orders.create(options);
      return order;
    } catch (error) {
      throw new Error('Error creating Razorpay order');
    }
  }

  verifyPaymentSignature(orderId: string, paymentId: string, razorpaySignature: string) {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const body = `${orderId}|${paymentId}`;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (expectedSignature === razorpaySignature) {
      return { status: 'success' };
    } else {
      throw new Error('Invalid signature');
    }
  }
}

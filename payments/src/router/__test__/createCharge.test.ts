import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import Order, { OrderStatus } from '../../model/orderModel';
import { stripe } from '../../stripe';
import Payment from '../../model/paymentModel';

it('returns 404 when trying to pay for nonexisting order', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({ token: 'abcf', orderId: new mongoose.Types.ObjectId().toHexString() })
    .expect(404);
});
it('returns 400 when trying to pay for different user order', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
    version: 0,
  });
  await order.save();

  await request(app).post('/api/payments').set('Cookie', global.signin()).send({ token: 'abcf', orderId: order.id }).expect(401);
});
it('returns 400 when trying to pay for cancelled order', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Cancelled,
    version: 0,
  });
  await order.save();

  await request(app).post('/api/payments').set('Cookie', global.signin(order.userId)).send({ token: 'abcf', orderId: order.id }).expect(400);
});

it('returns 201 with valid inputs', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
    version: 0,
  });
  await order.save();
  await request(app).post('/api/payments').set('Cookie', global.signin(order.userId)).send({ token: 'tok_visa', orderId: order.id }).expect(201);
  expect(stripe.charges.create).toHaveBeenCalled();
  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions).toBeDefined();
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual('usd');

  const payment = await Payment.findOne({ orderId: order.id, stripeId: 'new_stripe_id' });
  expect(payment).not.toBeNull();
});

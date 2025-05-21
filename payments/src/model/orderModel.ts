import { OrderStatus } from '@emil_tickets/common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export { OrderStatus };

interface OrderAttrs {
  id: string;
  userId: string;
  status: OrderStatus;
  version: number;
  price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
  findByIdAndPrevVersion(event: { id: string; version: number }): Promise<OrderDoc | null>;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  price: number;
  version: number;
}

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    status: { type: String, required: true, enum: Object.values(OrderStatus), default: OrderStatus.Created },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
  },
);

orderSchema.statics.findByIdAndPrevVersion = async (event: { id: string; version: number }) => {
  const { id, version } = event;
  const ticket = await Order.findOne({ _id: id, version: version - 1 });
  return ticket;
};

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    userId: attrs.userId,
    status: attrs.status,
    version: attrs.version,
    price: attrs.price,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export default Order;

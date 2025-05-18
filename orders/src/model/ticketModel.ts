import mongoose from 'mongoose';
import Order, { OrderStatus } from './orderModel';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByIdAndPrevVersion(event: { id: string; version: number }): Promise<TicketDoc | null>;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
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

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByIdAndPrevVersion = async (event: { id: string; version: number }) => {
  const { id, version } = event;
  const ticket = await Ticket.findOne({ _id: id, version: version - 1 });
  return ticket;
};


ticketSchema.statics.build = (attrs: TicketAttrs) => {
  const { id, ...restOfAttrs } = attrs;
  return new Ticket({ _id: id, ...restOfAttrs });
};

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({ ticket: this, status: { $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete] } });
  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export default Ticket;



export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: 'new_stripe_id' }),
  },
};

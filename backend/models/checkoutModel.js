import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema(
  {
    productItems: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        sizeProduct: { type: String, required: true },
        colorProduct: { type: String, required: true },
        _id: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    deliveryAddress: {
      fullName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      email: { type: String, required: true },
      province: { type: String, required: true },
      distinct: { type: String, required: true },
      ward: { type: String, required: true },
      address: { type: String, required: true },
      note: { type: String },
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      // required: [true, "Checkout must be done by a user"],
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    totalCost: {
      type: Number,
      required: [true, "Checkout must has the totalCost"],
    },
    paymentMethod: { type: String, enum: ["Paypal", "COD"], required: true },
    isPaid: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Checkout", checkoutSchema);

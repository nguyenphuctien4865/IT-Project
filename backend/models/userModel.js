import mongoose, { mongo } from "mongoose";
// TODO check unique and required
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User must have a name"],
      trim: true,
      maxLength: [40, "A user name must have less or equal than 40 characters"],
      minLength: [5, "A user name must have more or equal than 5 characters"],
    },
    img: {
      type: {
        coverImage: {
          type: Buffer,
          default: "",
          //required: true
        },
        coverImageType: {
          type: String,
          default: "",
          //required: true
        },
      },
      default: null,
    },
    avatar: {
      type: String,
    },
    phoneNumber: {
      type: String,
      //required: [true, "User must have a phone number"],
      //unique: true,
    },
    address: {
      type: String,
      default: "%Phường Phúc Xá%Quận Ba Đình%Thành Phố Hà Nội",
    },
    email: {
      type: String,
      //required: [true, "User must have a email"],
      //unique: true,
    },
    password: {
      type: String,
      //required: [true, "User must have a password"],
      minLength: [
        6,
        "A user password must have more or equal than 6 characters",
      ],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
userSchema.virtual("coverImagePath").get(function () {
  let rs;
  // NOTE: img luon o truoc, xet tu ben ngoai vao trong
  if (
    this.img != null &&
    this.img.coverImage != null &&
    this.img.coverImageType != null
  ) {
    rs = `data:${
      this.img.coverImageType
    };charset=utf-8;base64,${this.img.coverImage.toString("base64")}`;
  }
  return rs;
});
export default mongoose.model("User", userSchema);

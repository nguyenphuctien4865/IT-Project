import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  cart: {
    indexItem: localStorage.getItem("indexItem")
      ? JSON.parse(localStorage.getItem("indexItem"))
      : 0,
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    deliveryAddress: localStorage.getItem("deliveryAddress")
      ? JSON.parse(localStorage.getItem("deliveryAddress"))
      : {},
  },
  userInfo: localStorage.getItem("userInfo")
    ? localStorage.getItem("userInfo")
    : null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CART_ADD_ITEM": {
      const newItem = action.payload;
      let existItem = state.cart.cartItems.find(
        (item) =>
          item._id === newItem._id &&
          item.sizeProduct === newItem.sizeProduct &&
          item.colorProduct === newItem.colorProduct
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === newItem._id &&
            item.sizeProduct === newItem.sizeProduct &&
            item.colorProduct === newItem.colorProduct
              ? newItem
              : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    //? Chỉ lấy các sản phẩm khác id với id của product cần xóa và sản phẩm cùng id và khác size với product cần xóa
    case "CART_REMOVE_ITEM": {
      const removeItem = action.payload;
      console.log(removeItem);
      // const cartItems = state.cart.cartItems.filter(
      //   (item) =>
      //     item._id !== removeItem._id ||
      //     (item._id === removeItem._id &&
      //       item.sizeProduct !== removeItem.sizeProduct)
      // );
      const cartItems = state.cart.cartItems.filter(
        (item) => item.indexItem !== removeItem.indexItem
      );
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems: cartItems } };
    }
    case "CART_CLEAR": {
      localStorage.removeItem("cartItems");
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    }
    case "ADD_INDEX": {
      const indexItem = state.cart.indexItem + 1;
      localStorage.setItem("indexItem", JSON.stringify(indexItem));
      return {
        ...state,
        cart: {
          ...state.cart,
          indexItem,
        },
      };
    }
    case "REMOVE_INDEX": {
      localStorage.removeItem("indexItem");
      return {
        ...state,
        cart: {
          ...state.cart,
          indexItem: 0,
        },
      };
    }
    case "SAVE_DELIVERY_ADDRESS": {
      return {
        ...state,
        cart: {
          ...state.cart,
          deliveryAddress: action.payload,
        },
      };
    }
    case "USER_SIGNIN": {
      return {
        ...state,
        userInfo: action.payload,
      };
    }
    default:
      return state;
  }
};
export function StoreProvider(props) {
  const [state, contextDispatch] = useReducer(reducer, initialState);
  const value = { state, contextDispatch };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}

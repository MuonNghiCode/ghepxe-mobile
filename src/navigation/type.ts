export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgetPassword: undefined;
  Welcome: undefined;
  AnimationWelcome: undefined;
};

export type DriverTabParamList = {
  DriverTabs: undefined;
};
export type UserTabParamList = {
  Billing: undefined;
  UserTabs: undefined;
  Shipping: undefined;
  MapSelect: undefined;
  ConfirmOrder: undefined;
  OrderBilling: undefined;
  OrderShipping: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  MapSelect: {
    returnScreen?: keyof RootStackParamList;
  };
  Billing: {
    mapLocation: {
      coords: any;
      address: string;
    };
  };
  Shipping: {
    mapLocation: {
      coords: any;
      address: string;
    };
  }
};


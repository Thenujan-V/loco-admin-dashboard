

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};


export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    login: `${ROOTS.AUTH}/login`,
    register: `${ROOTS.AUTH}/register`,
    otp: `${ROOTS.AUTH}/otp`,
    forgotPW: `${ROOTS.AUTH}/forgot-password`,
    forgotPWOTP: `${ROOTS.AUTH}/forgot-password/otp`,
    resetPW: `${ROOTS.AUTH}/forgot-password/reset-password`,
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    users: {
      root: `${ROOTS.DASHBOARD}/users`,
    },
    orders: {
      root: `${ROOTS.DASHBOARD}/orders`,
    },
    menu: {
      root: `${ROOTS.DASHBOARD}/menu`,
      categories: `${ROOTS.DASHBOARD}/menu/categories`,
      items: `${ROOTS.DASHBOARD}/menu/items`,
    },
    trainInfo: {
      root: `${ROOTS.DASHBOARD}/train-info`,
      stations: `${ROOTS.DASHBOARD}/train-info/stations`,
      trains: `${ROOTS.DASHBOARD}/train-info/trains`,
      routes: `${ROOTS.DASHBOARD}/train-info/routes`,
      lines: `${ROOTS.DASHBOARD}/train-info/lines`,
      lineStations: `${ROOTS.DASHBOARD}/train-info/line-stations`,
    },
    trainSchedule: {
      root: `${ROOTS.DASHBOARD}/train-schedule`,
      scheduling: `${ROOTS.DASHBOARD}/train-schedule/scheduling`,
      stationStops: `${ROOTS.DASHBOARD}/train-schedule/station-stops`,
      schedulingDetails: (id: string) => `${ROOTS.DASHBOARD}/train-schedule/scheduling/${id}`,
    },
    restaurants: {
      root: `${ROOTS.DASHBOARD}/restaurants`,
      list: `${ROOTS.DASHBOARD}/restaurants/list`,
      details: (id: string) => `${ROOTS.DASHBOARD}/restaurants/${id}`,
    },
    pickupPerson: {
      root: `${ROOTS.DASHBOARD}/pickup-person`,
      list: `${ROOTS.DASHBOARD}/pickup-person/list`,
      details: (id: string) => `${ROOTS.DASHBOARD}/pickup-person/${id}`,
    },
    deliveryPerson: {
      root: `${ROOTS.DASHBOARD}/delivery-person`,
      list: `${ROOTS.DASHBOARD}/delivery-person/list`,
      details: (id: string) => `${ROOTS.DASHBOARD}/delivery-person/${id}`,
    },
    foods: {
      root: `${ROOTS.DASHBOARD}/foods`,
      categories: `${ROOTS.DASHBOARD}/foods/categories`,
      defaultItems: `${ROOTS.DASHBOARD}/foods/default-items`,
    },
  },
};

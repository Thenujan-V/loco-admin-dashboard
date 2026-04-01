export type UserRow = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  avatar: string;
};

export type OrderItemRow = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export type PersonSummary = {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
};

export type RestaurantSummary = {
  name: string;
  address: string;
  location: string;
};

export type OrderRow = {
  orderId: string;
  userId: number;
  totalAmount: number;
  status: 'PENDING' | 'PREPARING' | 'ON_TRAIN' | 'DELIVERED' | 'CANCELLED';
  deliveredStationName: string;
  trainName: string;
  pickupPersonName: string;
  pickupPersonId: number;
  deliveryPersonName: string;
  deliveryPersonId: number;
  createdAt: string;
  orderItems: OrderItemRow[];
  restaurant: RestaurantSummary;
  pickupPerson: PersonSummary;
  deliveryPerson: PersonSummary;
};

export const MOCK_USERS: UserRow[] = [
  {
    id: 101,
    firstname: 'Ava',
    lastname: 'Fernando',
    email: 'ava.fernando@example.com',
    phoneNumber: '+1 202 555 0141',
    isVerified: true,
    isActive: true,
    createdAt: '2026-01-18T10:15:00Z',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Ava',
  },
  {
    id: 102,
    firstname: 'Liam',
    lastname: 'Perera',
    email: 'liam.perera@example.com',
    phoneNumber: '+1 202 555 0178',
    isVerified: false,
    isActive: false,
    createdAt: '2026-02-02T08:45:00Z',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Liam',
  },
  {
    id: 103,
    firstname: 'Nina',
    lastname: 'Silva',
    email: 'nina.silva@example.com',
    phoneNumber: '+1 202 555 0199',
    isVerified: true,
    isActive: true,
    createdAt: '2026-02-20T13:05:00Z',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Nina',
  },
];

export const MOCK_ORDERS: OrderRow[] = [
  {
    orderId: 'ORD-9001',
    userId: 101,
    totalAmount: 24.5,
    status: 'DELIVERED',
    deliveredStationName: 'Central Station',
    trainName: 'Express Alpha',
    pickupPersonName: 'John Doe',
    pickupPersonId: 501,
    deliveryPersonName: 'Alex Rider',
    deliveryPersonId: 701,
    createdAt: '2026-03-23T11:20:00Z',
    orderItems: [
      { id: 1, name: 'Chicken Kottu', price: 12.5, quantity: 1 },
      { id: 2, name: 'Iced Milo', price: 4, quantity: 3 },
    ],
    restaurant: {
      name: 'Spicy Loco Kitchen',
      address: '123 Main St, Tech Park',
      location: 'Platform 2 Food Hub',
    },
    pickupPerson: {
      id: 501,
      name: 'John Doe',
      phoneNumber: '+1 202 555 0101',
      email: 'john.pickup@example.com',
    },
    deliveryPerson: {
      id: 701,
      name: 'Alex Rider',
      phoneNumber: '+1 202 555 0102',
      email: 'alex.delivery@example.com',
    },
  },
  {
    orderId: 'ORD-9002',
    userId: 101,
    totalAmount: 17,
    status: 'ON_TRAIN',
    deliveredStationName: 'Northgate Station',
    trainName: 'Loco Commuter',
    pickupPersonName: 'Jane Peris',
    pickupPersonId: 502,
    deliveryPersonName: 'Sam Fisher',
    deliveryPersonId: 702,
    createdAt: '2026-03-28T07:40:00Z',
    orderItems: [
      { id: 3, name: 'Veg Sandwich', price: 6, quantity: 2 },
      { id: 4, name: 'Orange Juice', price: 5, quantity: 1 },
    ],
    restaurant: {
      name: 'Green Bite Cafe',
      address: '22 Lake Road, Metro City',
      location: 'Concourse Level Kiosk',
    },
    pickupPerson: {
      id: 502,
      name: 'Jane Peris',
      phoneNumber: '+1 202 555 0103',
      email: 'jane.pickup@example.com',
    },
    deliveryPerson: {
      id: 702,
      name: 'Sam Fisher',
      phoneNumber: '+1 202 555 0104',
      email: 'sam.delivery@example.com',
    },
  },
  {
    orderId: 'ORD-9003',
    userId: 102,
    totalAmount: 31.75,
    status: 'PREPARING',
    deliveredStationName: 'South Station',
    trainName: 'Express Alpha',
    pickupPersonName: 'John Doe',
    pickupPersonId: 501,
    deliveryPersonName: 'Alex Rider',
    deliveryPersonId: 701,
    createdAt: '2026-03-29T15:10:00Z',
    orderItems: [
      { id: 5, name: 'Seafood Rice', price: 14.25, quantity: 1 },
      { id: 6, name: 'Lime Soda', price: 3.5, quantity: 5 },
    ],
    restaurant: {
      name: 'Ocean Flame',
      address: '9 Harbor Lane, Metro City',
      location: 'Station Market Wing',
    },
    pickupPerson: {
      id: 501,
      name: 'John Doe',
      phoneNumber: '+1 202 555 0101',
      email: 'john.pickup@example.com',
    },
    deliveryPerson: {
      id: 701,
      name: 'Alex Rider',
      phoneNumber: '+1 202 555 0102',
      email: 'alex.delivery@example.com',
    },
  },
];

export const getUserById = (id: string) =>
  MOCK_USERS.find((user) => String(user.id) === id) ?? MOCK_USERS[0];

export const getOrdersByUserId = (userId: number) =>
  MOCK_ORDERS.filter((order) => order.userId === userId);

export const getOrdersByPickupPersonId = (pickupPersonId: number) =>
  MOCK_ORDERS.filter((order) => order.pickupPersonId === pickupPersonId);

export const getOrdersByDeliveryPersonId = (deliveryPersonId: number) =>
  MOCK_ORDERS.filter((order) => order.deliveryPersonId === deliveryPersonId);

export const getOrdersByRestaurantName = (restaurantName: string) =>
  MOCK_ORDERS.filter((order) => order.restaurant.name === restaurantName);

export const getOrderById = (id: string) =>
  MOCK_ORDERS.find((order) => order.orderId === id) ?? MOCK_ORDERS[0];

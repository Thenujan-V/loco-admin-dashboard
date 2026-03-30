// assets
import { countries } from 'src/assets/data';
//
import { _mock } from './_mock';
import { duration } from '@mui/material';

// ----------------------------------------------------------------------

export const OPERATOR_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const TRANSACTIONS_STATUS_OPTIONS = [
  { value: 'PAID', label: 'Paid' },
  { value: 'PENDING', label: 'Pending' },
];

export const APPROVAL_QUEUE_STATUS_OPTIONS = [
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
];

export const TRANSACTIONS_TYPE_OPTIONS = [
  { value: 'PACKAGES', label: 'Package' },
  { value: 'ADDON', label: 'Addon' },
];

export const _userAbout = {
  id: _mock.id(1),
  role: _mock.role(1),
  email: _mock.email(1),
  country: countries[1].label,
  school: _mock.companyName(2),
  company: _mock.companyName(1),
  coverUrl: _mock.image.cover(3),
  totalFollowers: _mock.number.nativeL(1),
  totalFollowing: _mock.number.nativeL(2),
  quote:
    'Tart I love sugar plum I love oat cake. Sweet roll caramels I love jujubes. Topping cake wafer..',
  socialLinks: {
    facebook: `https://www.facebook.com/caitlyn.kerluke`,
    instagram: `https://www.instagram.com/caitlyn.kerluke`,
    linkedin: `https://www.linkedin.com/in/caitlyn.kerluke`,
    twitter: `https://www.twitter.com/caitlyn.kerluke`,
  },
};

export const _userFollowers = [...Array(18)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  country: countries[index + 1].label,
  avatarUrl: _mock.image.avatar(index),
}));

export const _userFriends = [...Array(18)].map((_, index) => ({
  id: _mock.id(index),
  role: _mock.role(index),
  name: _mock.fullName(index),
  avatarUrl: _mock.image.avatar(index),
}));

export const _userGallery = [...Array(12)].map((_, index) => ({
  id: _mock.id(index),
  postedAt: _mock.time(index),
  title: _mock.postTitle(index),
  imageUrl: _mock.image.cover(index),
}));

export const _userFeeds = [...Array(3)].map((_, index) => ({
  id: _mock.id(index),
  createdAt: _mock.time(index),
  media: _mock.image.travel(index + 1),
  message: _mock.sentence(index),
  personLikes: [...Array(20)].map((__, personIndex) => ({
    name: _mock.fullName(personIndex),
    avatarUrl: _mock.image.avatar(personIndex + 2),
  })),
  comments: (index === 2 && []) || [
    {
      id: _mock.id(7),
      author: {
        id: _mock.id(8),
        avatarUrl: _mock.image.avatar(index + 5),
        name: _mock.fullName(index + 5),
      },
      createdAt: _mock.time(2),
      message: 'Praesent venenatis metus at',
    },
    {
      id: _mock.id(9),
      author: {
        id: _mock.id(10),
        avatarUrl: _mock.image.avatar(index + 6),
        name: _mock.fullName(index + 6),
      },
      createdAt: _mock.time(3),
      message:
        'Etiam rhoncus. Nullam vel sem. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Sed lectus.',
    },
  ],
}));

export const _userCards = [...Array(21)].map((_, index) => ({
  id: _mock.id(index),
  role: _mock.role(index),
  name: _mock.fullName(index),
  coverUrl: _mock.image.cover(index),
  avatarUrl: _mock.image.avatar(index),
  totalFollowers: _mock.number.nativeL(index),
  totalPosts: _mock.number.nativeL(index + 2),
  totalFollowing: _mock.number.nativeL(index + 1),
}));

export const _userPayment = [...Array(3)].map((_, index) => ({
  id: _mock.id(index),
  cardNumber: ['**** **** **** 1234', '**** **** **** 5678', '**** **** **** 7878'][index],
  cardType: ['mastercard', 'visa', 'visa'][index],
  primary: index === 1,
}));

export const _userAddressBook = [...Array(4)].map((_, index) => ({
  id: _mock.id(index),
  primary: index === 0,
  name: _mock.fullName(index),
  phoneNumber: _mock.phoneNumber(index),
  fullAddress: _mock.fullAddress(index),
  addressType: (index === 0 && 'Home') || 'Office',
}));

export const _userInvoices = [...Array(10)].map((_, index) => ({
  id: _mock.id(index),
  invoiceNumber: `INV-199${index}`,
  createdAt: _mock.time(index),
  price: _mock.number.price(index),
}));

export const _userPlans = [
  {
    subscription: 'basic',
    price: 0,
    primary: false,
  },
  {
    subscription: 'starter',
    price: 4.99,
    primary: true,
  },
  {
    subscription: 'premium',
    price: 9.99,
    primary: false,
  },
];

export const  _userList = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  zipCode: '85807',
  state: 'Virginia',
  city: 'Rancho Cordova',
  role: _mock.role(index),
  email: _mock.email(index),
  address: '908 Jack Locks',
  name: _mock.fullName(index),
  isVerified: _mock.boolean(index),
  company: _mock.companyName(index),
  country: countries[index + 1].label,
  avatarUrl: _mock.image.avatar(index),
  phoneNumber: _mock.phoneNumber(index),
  connections: _mock.number.nativeS(index),
  registerdDate: _mock.time(index),
  status:
    (index % 2 && 'active') || (index % 3 && 'inactive') || 'active',
  currentCreditBalance: _mock.number.nativeM(index),
}));

export const _customerDetails = [...Array(20)].map((_, index) => ({
    id: _mock.id(index),
    phoneNumber: _mock.phoneNumber(index),
    name: _mock.fullName(index),
    connections: _mock.number.nativeS(index),
    status: (index % 2 && 'active') || (index % 3 && 'inactive') || 'active',
    currentCreditBalance: _mock.number.nativeM(index),
    registerdDate: _mock.time(index),
}));

export const _customerConnections = [
  {
    id: 1,
    vcNumber: "482901736254",
    idNumber: "7391548260",
    operator: "TATA",
    status: "active",
  },
  {
    id: 2,
    vcNumber: "917263504182",
    idNumber: "1846207395",
    operator: "SUN DISH",
    status: "inactive",
  },
  {
    id: 3,
    vcNumber: "605284917362",
    idNumber: "5927401836",
    operator: "TATA",
    status: "active",
  },
  {
    id: 4,
    vcNumber: "374829105623",
    idNumber: "7301954826",
    operator: "SUN DISH",
    status: "inactive",
  },
  {
    id: 5,
    vcNumber: "829173645028",
    idNumber: "4618297305",
    operator: "SUN DIRECT",
    status: "active",
  },
  {
    id: 6,
    vcNumber: "152739846205",
    idNumber: "9037154826",
    operator: "TATA",
    status: "inactive",
  },
  {
    id: 7,
    vcNumber: "963528104726",
    idNumber: "2751904386",
    operator: "SUN DIRECT",
    status: "active",
  },
  {
    id: 8,
    vcNumber: "540187392645",
    idNumber: "8194726503",
    operator: "TATA",
    status: "inactive",
  },
];

export const _packagesMockData = [
  {
    id: 1,
    image: _mock.image.avatar(1),
    name: "South Sports",
    mplanCode: "SUN_MPLAN",
    operator: "Sun Direct",
    status: "active",
    duration: "30 days",
    description: "This is a sports package that includes channels like Star Sports, Sony Ten, and more.",
    channelCount: 4,
  },
  {
    id: 2,
    image: _mock.image.avatar(2),
    name: "Kids Channel",
    mplanCode: "SUNDIRECT_MPLSN",
    operator: "Dish TV",
    status: "inactive",
    duration: "4 Months",
    description: "This is a kids package that includes channels like Cartoon Network, Nickelodeon, and more.",
    channelCount: 5,
  },
  {
    id: 3,
    image: _mock.image.avatar(3),
    name: "South Sports",
    mplanCode: "SUN_MPLAN",
    operator: "Airtel Digital",
    status: "active",
    duration: "75 days",
    description: "This is a kids package that includes channels like Cartoon Network, Nickelodeon, and more.",
    channelCount: 5,
  },
  {
    id: 4,
    image: _mock.image.avatar(4),
    name: "Kids Channel",
    mplanCode: "SUNDIRECT_MPLSN",
    operator: "Dialog TV",
    status: "inactive",
    duration: "70 days",
    description: "This is a kids package that includes channels like Cartoon Network, Nickelodeon, and more.",
    channelCount: 5,
  },
  {
    id: 5,
    image: _mock.image.avatar(5),
    name: "South Sports",
    mplanCode: "SUN_MPLAN",
    operator: "Tata Play",
    status: "active",
    duration: "30 days",
    description: "This is a kids package that includes channels like Cartoon Network, Nickelodeon, and more.",
    channelCount: 3,
  },
  {
    id: 6,
    image: _mock.image.avatar(6),
    name: "Kids Channel",
    mplanCode: "SUNDIRECT_MPLSN",
    operator: "Hathway",
    status: "inactive",
    duration: "3 Months",
    description: "This is a kids package that includes channels like Cartoon Network, Nickelodeon, and more.",
    channelCount: 5,
  },
  {
    id: 7,
    image:  _mock.image.avatar(7),
    name: "South Sports",
    mplanCode: "SUN_MPLAN",
    operator: "Sun Direct",
    status: "active",
    duration: "1 Month",
    description: "This is a kids package that includes channels like Cartoon Network, Nickelodeon, and more.",
    channelCount: 2,
  },
  {
    id: 8,
    image: _mock.image.avatar(8),
    name: "Kids Channel",
    mplanCode: "SUNDIRECT_MPLSN",
    operator: "Dish TV",
    status: "inactive",
    duration: "2 Months",
    description: "This is a kids package that includes channels like Cartoon Network, Nickelodeon, and more.",
    channelCount: 3,
  },
];

export const _packagePlanMockData = [
  {
    id: 1,
    packageId: 1,
    duration: 1,
    durationLabel: "1 Month",
    priceINR: 199,
    priceLKR: 750,
    status: "inactive",
  },
  {
    id: 2,
    packageId: 1,
    duration: 3,
    durationLabel: "3 Months",
    priceINR: 549,
    priceLKR: 2100,
    status: "inactive",
  },
  {
    id: 3,
    packageId: 1,
    duration: 6,
    durationLabel: "6 Months",
    priceINR: 999,
    priceLKR: 3800,
    status: "active",
  },
  {
    id: 4,
    packageId: 1,
    duration: 12,
    durationLabel: "12 Months",
    priceINR: 1799,
    priceLKR: 6900,
    status: "active",
  },

  // Kids Channel package
  {
    id: 5,
    packageId: 2,
    duration: 1,
    durationLabel: "1 Month",
    priceINR: 149,
    priceLKR: 560,
    status: "active",
  },
  {
    id: 6,
    packageId: 2,
    duration: 3,
    durationLabel: "3 Months",
    priceINR: 399,
    priceLKR: 1500,
    status: "inactive",
  },
  {
    id: 7,
    packageId: 2,
    duration: 6,
    durationLabel: "6 Months",
    priceINR: 749,
    priceLKR: 2800,
    status: "active",
  },
  {
    id: 8,
    packageId: 2,
    duration: 12,
    durationLabel: "12 Months",
    priceINR: 1299,
    priceLKR: 4900,
    status: "inactive",
  },
];

export const _channelsMockData = [
  { id: 1,packageId: 1, name: "Sun TV", channelNo: 101, language: "Tamil", status: "active" },
  { id: 2,packageId: 2, name: "KTV", channelNo: 102, language: "Tamil", status: "active" },
  { id: 3,packageId: 3, name: "Sun Music", channelNo: 103, language: "Tamil", status: "inactive" },
  { id: 4,packageId: 1, name: "Star Vijay", channelNo: 104, language: "Tamil", status: "active" },
  { id: 5,packageId: 2, name: "Colors Tamil", channelNo: 105, language: "Tamil", status: "active" },

  { id: 6,packageId: 3, name: "Cartoon Network", channelNo: 201, language: "KpackageIds", status: "active" },
  { id: 7,packageId: 2, name: "Pogo", channelNo: 202, language: "KpackageIds", status: "inactive" },
  { id: 8,packageId: 1, name: "Nickelodeon", channelNo: 203, language: "KpackageIds", status: "active" },
  { id: 9,packageId: 2, name: "Disney Channel", channelNo: 204, language: "KpackageIds", status: "active" },

  { id: 10,packageId: 1, name: "Star Sports 1", channelNo: 301, language: "Sports", status: "active" },
  { id: 11,packageId: 4, name: "Sony Sports Ten 1", channelNo: 302, language: "Sports", status: "active" },
  { id: 12,packageId: 4, name: "Eurosport", channelNo: 303, language: "Sports", status: "inactive" },

  { id: 13,packageId: 3, name: "Discovery Channel", channelNo: 401, language: "English", status: "active" },
  { id: 14,packageId: 4, name: "National Geographic", channelNo: 402, language: "English", status: "active" },
  { id: 15,packageId: 3, name: "Animal Planet", channelNo: 403, language: "English", status: "inactive" },

  { id: 16,packageId: 2, name: "Zee TV", channelNo: 501, language: "Hindi", status: "active" },
  { id: 17,packageId: 2, name: "Sony Entertainment", channelNo: 502, language: "Hindi", status: "active" },
  { id: 18,packageId: 1, name: "Star Plus", channelNo: 503, language: "Hindi", status: "inactive" },
];

export const _channelList = [
  { id: 1, name: "Sun TV" },
  { id: 2, name: "KTV" },
  { id: 3, name: "Sun Music" },
  { id: 4, name: "Star Vijay" },
  { id: 5, name: "Colors Tamil" },
  { id: 6, name: "Cartoon Network" },
  { id: 7, name: "Pogo" },
  { id: 8, name: "Nickelodeon" },
  { id: 9, name: "Disney Channel" },
  { id: 10, name: "Star Sports 1" },
  { id: 11, name: "Sony Sports Ten 1" },
  { id: 12, name: "Eurosport" },
  { id: 13, name: "Discovery Channel" },
  { id: 14, name: "National Geographic" },
  { id: 15, name: "Animal Planet" },
  { id: 16, name: "Zee TV" },
  { id: 17, name: "Sony Entertainment Television" },
  { id: 18, name: "Star Plus" },
  { id: 19, name: "HBO" },
  { id: 20, name: "AXN" }
];

  export const _addonPackages = [
    {
      "id": "eyJhbGciOiJIUzI1NiJ9.addon001",
      "name": "Sports Addon",
      "packageCode": "SUN_MPLAN_001",
      "description": "All sports channels in one pack",
      "amount": 199,
      "currencyCode": "INR",
      "channelCount": 12,
      "status": "active"
      
    },
    {
      "id": "eyJhbGciOiJIUzI1NiJ9.addon002",
      "name": "Movies Addon",
      "packageCode": "SUN_MPLAN_002",
      "description": "Premium movie channels including HD",
      "amount": 249,
      "currencyCode": "INR",
      "channelCount": 18,
      "status": "active"
    },
    {
      "id": "eyJhbGciOiJIUzI1NiJ9.addon003",
      "name": "Kids Special",
      "packageCode": "SUN_MPLAN_003",
      "description": "Cartoon and kids entertainment channels",
      "amount": 149,
      "currencyCode": "INR",
      "channelCount": 10,
      "status": "active"
      
    },
    {
      "id": "eyJhbGciOiJIUzI1NiJ9.addon004",
      "name": "News Pack",
      "packageCode": "SUN_MPLAN_004",
      "description": "National and international news channels",
      "amount": 99,
      "currencyCode": "INR",
      "channelCount": 15,
      "status": "inactive",
    },
    {
      "id": "eyJhbGciOiJIUzI1NiJ9.addon005",
      "name": "Tamil Regional Pack",
      "packageCode": "SUN_MPLAN_005",
      "description": "Popular Tamil entertainment channels",
      "amount": 179,
      "currencyCode": "INR",
      "channelCount": 20,
      "status": "inactive"
    },
    {
      "id": "eyJhbGciOiJIUzI1NiJ9.addon006",
      "name": "HD Upgrade Pack",
      "packageCode": "SUN_MPLAN_006",
      "description": "Upgrade existing channels to HD quality",
      "amount": 299,
      "currencyCode": "INR",
      "channelCount": 8,
      "status": "inactive",
    }
  ]

export const _transactionsList: any[] = [
    {
      "id": "TXN1001",
      "transactionId": "TRX-20260226-1001",
      "netAmount": 999,
      "currencyCode": "INR",
      "grossAmountINR": 999,
      "transactionType": "ADDON",
      "status": "PAID",
      "createdAt": "2026-02-26T08:15:30.000Z",
      "payedAt": "2026-02-26T08:16:10.000Z",
      "customerId": "CUST2001",
      "customerName": "Arjun Mehta",
      "dthConnectionId": "DTH1001",
      "dthConnectionName": "Hall TV",
      "vcNumber": "VC7788990011",
      "idNumber": "ID20014567",
      "operatorId": "OP1001",
      "operatorCode": "DISH_TV",
      "operatorName": "Dish TV India",
      "amountINR": {
        "currency": "INR",
        "integerPart": "999",
        "decimalPart": "00"
      },
      "amount": {
        "currency": "LKR",
        "integerPart": "3746",
        "decimalPart": "25"
      }
    },
    {
      "id": "TXN1002",
      "transactionId": "TRX-20260226-1002",
      "netAmount": 1499,
      "currencyCode": "INR",
      "grossAmountINR": 1499,
      "transactionType": "PACKAGE",
      "status": "PENDING",
      "createdAt": "2026-02-25T12:10:45.000Z",
      "payedAt": null,
      "customerId": "CUST2002",
      "customerName": "Priya Nair",
      "dthConnectionId": "DTH1002",
      "dthConnectionName": "Bedroom TV",
      "vcNumber": "VC4455667788",
      "idNumber": "ID20027890",
      "operatorId": "OP1002",
      "operatorCode": "TATA_PLAY",
      "operatorName": "Tata Play",
      "amountINR": {
        "currency": "INR",
        "integerPart": "1499",
        "decimalPart": "00"
      },
      "amount": {
        "currency": "LKR",
        "integerPart": "5612",
        "decimalPart": "75"
      }
    },
    {
      "id": "TXN1003",
      "transactionId": "TRX-20260226-1003",
      "netAmount": 599,
      "currencyCode": "INR",
      "grossAmountINR": 599,
      "transactionType": "ADDON",
      "status": "PAID",
      "createdAt": "2026-02-24T09:45:10.000Z",
      "payedAt": "2026-02-24T09:46:02.000Z",
      "customerId": "CUST2003",
      "customerName": "Rahul Verma",
      "dthConnectionId": "DTH1003",
      "dthConnectionName": "Kids Room TV",
      "vcNumber": "VC2233445566",
      "idNumber": "ID20031234",
      "operatorId": "OP1003",
      "operatorCode": "AIRTEL_DIGITAL",
      "operatorName": "Airtel Digital TV",
      "amountINR": {
        "currency": "INR",
        "integerPart": "599",
        "decimalPart": "00"
      },
      "amount": {
        "currency": "LKR",
        "integerPart": "2243",
        "decimalPart": "25"
      }
    },
    {
      "id": "TXN1004",
      "transactionId": "TRX-20260226-1004",
      "netAmount": 1999,
      "currencyCode": "INR",
      "grossAmountINR": 1999,
      "transactionType": "PACKAGE",
      "status": "PENDING",
      "createdAt": "2026-02-23T16:20:00.000Z",
      "payedAt": null,
      "customerId": "CUST2004",
      "customerName": "Sneha Kapoor",
      "dthConnectionId": "DTH1004",
      "dthConnectionName": "Main Hall Premium",
      "vcNumber": "VC8899001122",
      "idNumber": "ID20044567",
      "operatorId": "OP1004",
      "operatorCode": "SUN_DIRECT",
      "operatorName": "Sun Direct",
      "amountINR": {
        "currency": "INR",
        "integerPart": "1999",
        "decimalPart": "00"
      },
      "amount": {
        "currency": "LKR",
        "integerPart": "7487",
        "decimalPart": "50"
      }
    }
  ]

  export const _channels_categories_list = [
  {
    name: "Sports",
    description: "Live matches, highlights, and sports analysis including cricket, football, and more.",
  },
  {
    name: "Movies",
    description: "Latest blockbuster movies, classic films, and regional cinema channels.",
  },
  {
    name: "News",
    description: "24/7 local and international news coverage with live updates.",
  },
  {
    name: "Kids",
    description: "Cartoons, educational programs, and fun entertainment for children.",
  },
  {
    name: "Music",
    description: "Top hits, music videos, concerts, and entertainment shows.",
  },
  {
    name: "Entertainment",
    description: "TV series, reality shows, talk shows, and drama programs.",
  },
  {
    name: "Documentary",
    description: "Educational and informative content about nature, science, and history.",
  },
  {
    name: "Religious",
    description: "Spiritual programs, devotional songs, and religious teachings.",
  },
  {
    name: "Lifestyle",
    description: "Cooking shows, travel programs, fashion, and wellness content.",
  },
  {
    name: "Regional",
    description: "Channels dedicated to regional languages and local cultural content.",
  },
];

export const _approvalQueueList =  [
  {
    id: "REQ-1001",
    customerName: "Nimal Perera",
    vcNumber: "VC12345678",
    operatorName: "Dialog TV",
    requestType: "Upgrade",
    currentPack: "Basic Pack",
    requestedPack: "Premium Pack",
    paidAt: "2026-02-26T08:15:30.000Z",
    status: "Pending",
    activeSince: "2025-12-01T00:00:00.000Z",
    lastRechargeDuration: "30 days",
    requestedOn: "2026-02-25T10:00:00.000Z",

  },
  {
    id: "REQ-1002",
    customerName: "Kavindu Silva",
    vcNumber: "VC87654321",
    operatorName: "PEO TV",
    requestType: "Downgrade",
    currentPack: "Gold Pack",
    requestedPack: "Silver Pack",
    paidAt: "2026-02-25T12:10:45.000Z",
    status: "Approved",
    activeSince: "2025-11-15T00:00:00.000Z",
    lastRechargeDuration: "60 days",
    requestedOn: "2026-02-24T14:30:00.000Z",
  },
  {
    id: "REQ-1003",
    customerName: "Tharushi Fernando",
    vcNumber: "VC45678912",
    operatorName: "Dialog TV",
    requestType: "Package Change",
    currentPack: "Family Pack",
    requestedPack: "Sports Addon",
    paidAt: "2026-02-24T09:45:10.000Z",
    status: "Rejected",
activeSince: "2025-10-01T00:00:00.000Z",
lastRechargeDuration: "90 days",
requestedOn: "2026-02-22T14:30:00.000Z",
  },
  {
    id: "REQ-1004",
    customerName: "Saman Kumara",
    vcNumber: "VC11223344",
    operatorName: "Lanka Broadband",
    requestType: "New Connection",
    currentPack: "-",
    requestedPack: "Starter Pack",
    paidAt: "2026-02-23T16:20:00.000Z",
    status: "Approved",
activeSince: "2025-10-01T00:00:00.000Z",
lastRechargeDuration: "90 days",
requestedOn: "2026-02-22T14:30:00.000Z",
  },
  {
    id: "REQ-1005",
    customerName: "Ishara Jayasinghe",
    vcNumber: "VC99887766",
    operatorName: "PEO TV",
    requestType: "Upgrade",
    currentPack: "Silver Pack",
    requestedPack: "Platinum Pack",
    paidAt: "2026-02-22T14:30:00.000Z",
    status: "Pending",
    activeSince: "2025-10-01T00:00:00.000Z",
    lastRechargeDuration: "90 days",
    requestedOn: "2026-02-22T14:30:00.000Z",
  },
];


  export const _ACTIVITY_LOGS = [
  {
    date: "2026-03-01 09:15 AM",
    action: "Request Created",
    performedBy: "Nimal Perera",
    remarks: "New upgrade request submitted",
  },
  {
    date: "2026-03-01 09:30 AM",
    action: "Reviewed",
    performedBy: "Admin - Kavindu Silva",
    remarks: "Documents verified successfully",
  },
  {
    date: "2026-03-01 10:00 AM",
    action: "Approved",
    performedBy: "Supervisor - Tharushi Fernando",
    remarks: "Upgrade approved. Proceed to activation",
  },
  {
    date: "2026-03-01 10:30 AM",
    action: "Package Activated",
    performedBy: "System",
    remarks: "Premium Pack activated successfully",
  },
  {
    date: "2026-03-01 11:00 AM",
    action: "Notification Sent",
    performedBy: "System",
    remarks: "Customer notified via SMS & Email",
  },
];

  export const _rechargeApis = [
  {
    ruleName: "Small Amount Rule",
    minAmountINR: 1,
    maxAmountINR: 999,
    gateway: "Razorpay",
    status: "Active",
  },
  {
    ruleName: "Medium Amount Rule",
    minAmountINR: 1000,
    maxAmountINR: 4999,
    gateway: "PayU",
    status: "Active",
  },
  {
    ruleName: "High Value Rule",
    minAmountINR: 5000,
    maxAmountINR: 20000,
    gateway: "Stripe",
    status: "Active",
  },
  {
    ruleName: "Premium Transaction Rule",
    minAmountINR: 20001,
    maxAmountINR: 50000,
    gateway: "Cashfree",
    status: "Inactive",
  },
  {
    ruleName: "Bulk Payment Rule",
    minAmountINR: 50001,
    maxAmountINR: 100000,
    gateway: "Razorpay",
    status: "Active",
  },
];
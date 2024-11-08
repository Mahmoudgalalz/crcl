export type ImageFile = {
  file: File;
  preview: string;
};

export type Announcement = {
  id: number;
  artist: string;
  description: string;
  images: string[];
  title: string;
  pricing: string;
  location: string;
  dateTime: string;
  promoVideo?: string;
};

export type SuperUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  type: SuperUserType;
};

export type SuperUserType = "ADMIN" | "FINANCE" | "MODERATOR" | "APPROVAL";

export type User = {
  id: string;
  name: string;
  email: string;
  number: string;
  password: string;
  facebook?: string;
  instagram?: string;
  gender?: Gender;
  picture?: string;
  type: UserType;
  wallet?: Wallet;
  tickets: TicketPurchase[];
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type AnEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  image?: string;
  date: Date;
  time: string;
  status: EventStatus;
  capacity: number;
  artists: string[];
  tickets: Ticket[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Ticket = {
  id: string;
  title: string;
  description: string;
  price: number;
  capacity: number;
  eventId: string;
  event: Event;
  createdAt: Date;
  updatedAt: Date;
  TicketPurchase: TicketPurchase[];
};

export type TicketPurchase = {
  id: string;
  ticketId: string;
  ticket: Ticket;
  userId: string;
  user?: User;
  externalEmail?: string;
  externalPhone?: string;
  externalFacebook?: string;
  externalInstagram?: string;
  purchaseDate: Date;
  status: TicketStatus;
};

export type Wallet = {
  id: number;
  userId: string;
  user: User;
  balance: number;
};

export type WalletToken = {
  id: number;
  tokenPrice: number;
};

export type Newspaper = {
  id: string;
  title: string;
  description: string;
  image?: string;
  status: NewsStatus;
  createdAt: Date;
  updatedAt: Date;
};

export enum UserType {
  USER = "USER",
  READER = "READER",
  BOOTH = "BOOTH",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export enum TicketStatus {
  BOOKED = "BOOKED",
  APPROVED = "APPROVED",
  DECLINED = "DECLINED",
  ATTENDED = "ATTENDED",
  PAST_DUE = "PAST_DUE",
}

export enum EventStatus {
  DRAFTED = "DRAFTED",
  PUBLISHED = "PUBLISHED",
  ENDED = "ENDED",
  CANCLED = "CANCLED",
  DELETED = "DELETED",
}

export enum NewsStatus {
  DRAFTED = "DRAFTED",
  PUBLISHED = "PUBLISHED",
  DELETED = "DELETED",
}

export enum Gender {
  Male = "Male",
  Female = "Female",
}

export type ApiSuccessResponse<T> = {
  status: "success";
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  status: "error";
  message: string;
};

export type TicketRequest = {
  id: string;
  userId: string;
  eventId: string;
  meta: {
    name: string;
    email: string;
    number: string;
    social: string;
    ticketId: string;
  }[];
  status: TicketStatus;
  createdAt: string;
  updateAt: string;
};

export type Analytics = {
  totalMoney: {
    walletTotal: number;
    paymentTotal: number;
    combinedTotal: number;
  };
  boothTransactions: Array<{
    _sum: { amount: number };
    _count: { id: number };
    to: string;
  }>;
  eventStats: {
    totalEvents: number;
    upcomingEvents: number;
    pastEvents: number;
  };
  eventRequestCounts: Array<{ _count: { id: number }; eventId: string }>;
  totalPaidTickets: number;
  userRequestCounts: Array<{
    period: string;
    data: Array<{
      userId: string;
      eventId: string;
      eventName: string;
      requestCount: number;
    }>;
  }>;
};

export type Transaction = {
  id: string;
  createdAt: string;
  from: string;
  to: string;
  status: string;
  amount: number;
  tokenPrice: number;
  walletId: string;
};

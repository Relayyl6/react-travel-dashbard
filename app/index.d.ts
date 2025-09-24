declare interface BaseUser {
  id: string;
  name: string;
  email: string;
  dateJoined: string;
  imageUrl: string;
}

declare interface UserData extends BaseUser {
  itineraryCreated: number | string;
  status: "user" | "admin";
}

declare type User = BaseUser;

declare interface Country {
  flag: string;
  name: string;
  coordinates: [number, number];
  value: string;
  openStreetMap?: string;
}

declare interface DropdownItem {
  name: string;
}

declare interface SelectProps {
  data: Country[] | DropdownItem[];
  onValueChange: (value: string) => void;
  id: string;
  label: string;
  placeholder: string;
}

declare interface PillProps {
  text: string;
  bgColor?: string;
  textColor?: string;
}

declare interface Activity {
  time: string;
  description: string;
  specificDetails: string;
  estimatedCost: string;
  duration: string;
}

declare interface Transportation {
  method: string;
  cost: string;
  tips: string;
}

declare interface Accommodation {
  area: string;
  type: string;
  priceRange: string;
}

interface DayPlan {
  day: number;
  location: string;
  accommodation: Accommodation;
  activities: Activity[];
  transportation: Transportation;
  totalDayCost: string;
}

declare interface Location {
  city: string;
  coordinates: [number, number];
  openStreetMap: string;
}

declare interface BudgetBreakdown {
  accommodation: string;
  food: string;
  activities: string;
  transport: string;
}

declare interface EmergencyContacts {
  police: string;
  embassy: string;
  medical: string;
}

declare interface PracticalInfo {
  budgetBreakdown: BudgetBreakdown;
  packingEssentials: string[];
  localCustoms: string[];
  emergencyContacts: EmergencyContacts;
}

declare interface budgetAdjustments {
  lowerBudget: string;
  higherBudget: string;
}

declare interface Alternatives {
  weatherBackup: string[];
  budgetAdjustments: budgetAdjustments;
  extendedStay: string[];
}

declare interface Trip {
  id: string;
  name: string;
  description: string;
  rating: string;
  estimatedPrice: string;
  duration: number;
  budget: string;
  travelStyle: string;
  interests: string;
  groupType: string;
  country: string;
  imageUrl: string[];
  itinerary: DayPlan[];
  bestTimeToVisit: string[];
  weatherInfo: string[];
  location: Location;
  payment_link: string;
  practicalInfo: PracticalInfo;
  alternatives: Alternatives;
}

declare interface TripCardProps {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  tags: string[];
  price: string;
}

declare interface StatsCard {
  headerTitle: string;
  total: number;
  lastMonthCount: number;
  currentMonthCount: number;
}

declare interface TrendResult {
  trend: "increment" | "decrement" | "no change";
  percentage: number;
}

declare interface DashboardStats {
  totalUsers: number;
  usersJoined: {
    currentMonth: number;
    lastMonth: number;
  };
  userRole: {
    total: number;
    currentMonth: number;
    lastMonth: number;
  };
  totalTrips: number;
  tripsCreated: {
    currentMonth: number;
    lastMonth: number;
  };
}

declare interface CreateTripResponse {
  id?: string;
}

declare interface DestinationProps {
  containerClass?: string;
  bigCard?: boolean;
  activityCount: number;
  rating: number;
  bgImage: string;
  title: string;
}

type GetAllTripsResponse = {
  allTrips: Models.Document[];
  total: number;
};

declare interface UsersItineraryCount {
  imageUrl: string;
  name: string;
  count: number;
}

declare interface TripsInterest {
  imageUrl: string;
  name: string;
  interest: string;
}

declare interface InfoPillProps {
  text: string;
  image: string;
}

declare interface TripFormData {
  country: string;
  travelStyle: string;
  interest: string;
  budget: string;
  duration: number;
  groupType: string;
}

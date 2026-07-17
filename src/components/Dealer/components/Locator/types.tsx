export interface DealerMapProps {
  googleMapsApiKey: string;
  dealers: any[];
  selectDealer: (dealer: any) => void;
  activeDealer: any;
  handleActiveDealer: (dealer: any) => void;
  showMap: boolean;
  setShowMap: (show: boolean) => void;
  dealersHeight: number;
  loading: boolean;
  appendFflToCompanyName?: boolean;
}

interface Dealer {
  business_name: string;
  phone_number: string;
  premise_street: string;
  premise_city: string;
  premise_state: string;
  premise_zip: string;
  preferred: boolean;
  fees: any;
  schedules: any;
  labels: Array<string>;
  uuid?: string;
  shipping_recipient_first_name?: string;
  shipping_recipient_last_name?: string;
}

export interface DealerCardProps {
  dealer: Dealer;
  index: number;
  handleActiveDealer: (dealer: Dealer) => void;
  setActiveDealer: Dealer;
  selectDealer: (dealer: Dealer) => void;
  appendFflToCompanyName?: boolean;
}

export interface DealerListProps {
  dealersRef: React.RefObject<HTMLDivElement>;
  dealers: any[];
  loading: boolean;
  searched: boolean;
  currentLocation: string;
  activeDealer: any;
  handleActiveDealer: (dealer: any) => void;
  selectDealer: (dealer: any) => void;
  appendFflToCompanyName?: boolean;
}

interface Fee {
  name: string;
  amount: number;
}

export interface FeesProps {
  fees: Fee[];
}


interface Schedule {
  day: string;
  hours: string;
}

export interface SchedulesProps {
  schedules: Schedule[];
}

export interface Worker {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    
  }
  
  export interface Shift {
    id: number;
    name: string;
    start_datetime: string;
    end_datetime: string;
    workers?: Worker[];
  }
  
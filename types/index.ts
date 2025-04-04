export interface Worker {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    
  }
  
  export interface Shift {
    id: number;
    name: string;
    shift_type: string;
    start_datetime: string;
    end_datetime: string;
    description: string;
    flood_id: number;
    created_at: string;
    updated_at: string;
    // workers?: Worker[]; // remove or make optional if still used
  }
  
  
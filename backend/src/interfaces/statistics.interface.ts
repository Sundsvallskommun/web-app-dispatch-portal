export interface DepartmentStatistics {
  DEPARTMENT_STATISTICS: Statistics[];
}

export interface Statistics {
  DEPARTMENT: string;
  SNAIL_MAIL: Mail;
  DIGITAL_MAIL: Mail;
}

export interface Mail {
  sent: number;
  failed: number;
}

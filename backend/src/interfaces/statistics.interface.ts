export interface DepartmentStatistics {
  DEPARTMENT_STATISTICS: Statistics;
}

export interface Statistics {
  DEPARTMENT: string;
  SNAIL_MAIL: Mail;
  DIGITAL_MAIL: Mail;
}

export interface Mail {
  SENT: number;
  FAILED: number;
}

export interface Statistics {
  department: string;
  snailMail?: Mail;
  digitalMail?: Mail;
}

export interface Mail {
  sent: number;
  failed: number;
}
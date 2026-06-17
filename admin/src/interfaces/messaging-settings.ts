export interface MessagingSettingsDto {
  id?: string;
  host: string;
  display_name: string;
  logotype_lightmode: File | string;
  logotype_darkmode: File | string;
}

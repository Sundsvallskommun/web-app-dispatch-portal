export interface Organization {
  abbreviation: string;
  orgDisplayName: string;
  orgId: number;
  orgName: string;
  orgNameShort: string;
  organizationId: string;
  organizations?: Organization[];
  parentId: number;
  responsibilityCode?: string;
  responsibilityList?: string;
  treeLevel: number;
}

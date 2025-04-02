export interface Organization {
  orgId: number;
  treeLevel: number;
  orgName: string;
  parentId: number;
  isLeafLevel?: boolean;
  companyId: number;
  responsibilityCode?: string;
  responsibilityList?: string;
  organizations?: Organization[];
}

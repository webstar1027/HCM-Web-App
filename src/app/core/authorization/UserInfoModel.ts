import { UserInfoLinkedCompaniesModel } from "./UserInfoLinkedCompaniesModel";
export class UserInfoModel {
  public id: string;
  public displayName: string;
  public userName: string;
  public email: string;
  public currentCompanyId: number;
  public currentCompanyName: string;
  public companyLinks: UserInfoLinkedCompaniesModel[];
  public userClaims: UserClaimsModel[];
  public userPermissions: UserPermissionsModel[];
}


export class UserClaimsModel {

    public claimName: string;
    public claimValue: string;
}


export class UserPermissionsModel{

}
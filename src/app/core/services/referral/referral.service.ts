import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Configuration } from "../../configuration";
import { ReferralDemographics } from "../../models/referral/referral-demographics";
import { IEmergencyContact, IContact } from "../../models";
import { ReferralEnrollmentModel } from "../../models/referral/referral-enrollment";
import { Lookup } from "../../models/lookup";
import { LookupService } from "../components/lookup-service";
import { LookupTypesEnum } from "@app/core/lookup-types-enum";
import { IReferralAssessment } from "../../models/interfaces/referral/IReferral";
import { ReferralAssessment } from "../../models/referral/referral-assessment";
import { Validator } from "../../helper/validator";
import { ChartPhysician } from "../../models/interfaces/chart/IChart";
import { ReferralListSearchModel } from "@app/routes/referral/list/referral-list-searchModel";
import { UrlUtilities } from "@app/core/helper/UrlUtilities";

@Injectable()
export class ReferralService {
  constructor(
    @Inject(HttpClient) private http: HttpClient,
    @Inject(Configuration) private config: Configuration,
    @Inject(LookupService) private helperService: LookupService,
    @Inject(Validator) private validator: Validator
  ) {
    console.log("Instance has been created");
  }

  public getReferralList(
    currentPage: number,
    pageSize: number,
    searchModel: ReferralListSearchModel
  ): Observable<any> {
    const filterParams = UrlUtilities.encodeObject(searchModel);
    const url =
      this.config.ApiBaseUrl +
      `api/referral?pageSize=${pageSize}&currentPage=${currentPage}&${filterParams}`;
    return this.http.get<any>(url);
  }

  public getByReferralId(referralId: number): Observable<ReferralDemographics> {
    const url = this.config.ApiBaseUrl + "api/referral/" + referralId;
    return this.http.get<ReferralDemographics>(url);
  }

  public updateReferralEmergencyContact(
    referralId: number,
    emergencyContact: IEmergencyContact
  ): Observable<any> {
    const url = `${
      this.config.ApiBaseUrl
    }api/charts/${referralId}/emergencyContacts/`;

    if (emergencyContact.addresses && emergencyContact.addresses[0]) {
      emergencyContact.addresses[0].addressType = 1;
    }
    const model = {
      emergencyContactId: emergencyContact.emergencyContactId,
      firstName: emergencyContact.firstName,
      middleInitial: emergencyContact.middleInitial,
      nickName: emergencyContact.nickName,
      lastName: emergencyContact.lastName,
      contacts: new Array(
        this.validator.getValidContact(emergencyContact.homePhone),
        this.validator.getValidContact(emergencyContact.cellPhone),
        this.validator.getValidContact(emergencyContact.email)
      ).filter(x => x),
      addresses: emergencyContact.addresses,
      relationshipId: emergencyContact.relationshipId
    };

    return this.http.post(url, model);
  }

  public getChartEmergencyContacts(
    chartId: number
  ): Observable<IEmergencyContact[]> {
    const url = `${
      this.config.ApiBaseUrl
    }api/charts/${chartId}/emergencyContacts`;
    return this.http.get<IEmergencyContact[]>(url);
  }

  public updateReferralContact(chartId: number, model: any): Observable<any> {
    const url =
      this.config.ApiBaseUrl + "api/referral/" + chartId + "/updateContact";
    return this.http.post(url, model);
  }

  public deleteEmergencyContact(chartId: number, emergencyContactId: number) {
    const url = `${
      this.config.ApiBaseUrl
    }api/charts/${chartId}/emergencyContacts/${emergencyContactId}`;
    return this.http.delete(url);
  }

  updateMedicadMedicareInformation(
    referralId: number,
    referralDemographics: ReferralDemographics
  ): Observable<any> {
    const url = `${
      this.config.ApiBaseUrl
    }api/referral/${referralId}/updateMedicaidMedicare/`;
    const model = {
      medicaidNumber: referralDemographics.medicaidMemberId,
      medicareNumber: referralDemographics.medicareMemberId,
      covered: referralDemographics.coveredForMedicaid,
      entitlementIssue: referralDemographics.entitlementIssues,
      entitlementIssueComment: referralDemographics.entitlementIssuesComment,
      medicaidComment: referralDemographics.medicaidComment,
      lastMaximusDate: referralDemographics.maximusDate,
      lastMaximusScore: referralDemographics.maximusScore
    };
    return this.http.post(url, model);
  }

  updateIntakeInfo(
    referralDemographics: ReferralDemographics
  ): Observable<any> {
    const url = `${this.config.ApiBaseUrl}api/referral/${
      referralDemographics.referralId
    }/updateIntakeInfo`;

    const model = {
      referralId: referralDemographics.referralId,
      referralStatusId: referralDemographics.referralStatusId,
      referralSubStatusId: referralDemographics.referralSubStatusId,
      referredById: referralDemographics.referredById,
      referralSourceId: referralDemographics.referralSourceId,
      referralReason: referralDemographics.referralReason,
      nursingHomeDischarge: referralDemographics.nursingHomeDischarge,
      transferCase: referralDemographics.transferCase
    };
    return this.http.post(url, model);
  }

  public updateCoordinationrInfo(
    referralDemographics: ReferralDemographics
  ): Observable<ReferralDemographics> {
    const model = {
      referralId: referralDemographics.referralId,
      chartId: referralDemographics.chartId,
      sabbathObservant: referralDemographics.sabbathObservant,
      intakeCoordinatorId: referralDemographics.intakeCoordinatorId,
      languageId: referralDemographics.primaryLanguageId,
      dayCareId: referralDemographics.dayCareId,
      isCDPAS: referralDemographics.isCDPAS,
      preferredCaregiverGenderId: referralDemographics.genderPreferenceId,
      otherGenderAcceptanceId: referralDemographics.otherGenderAcceptanceId,
      coordinationComments: referralDemographics.coordinationComments,
    };

    const updateUrl = `${this.config.ApiBaseUrl}api/referral/${
      referralDemographics.referralId
    }/coordination/update`;

    return this.http.post<ReferralDemographics>(updateUrl, model);
  }

  updateCDPASInfo(referralDemographics: ReferralDemographics): Observable<ReferralDemographics> {
    const model = {
      referralCDPASId: referralDemographics.referralCDPASId,
      referralId: referralDemographics.referralId,
      name: referralDemographics.cdpasAideName,
      phoneNumber: referralDemographics.cdpasAidePhoneNumber,
      relationshipId: referralDemographics.cdpasAideRelationship,
      rateRequest: referralDemographics.cdpasAideRateRequest
    };
    const updateUrl = `${this.config.ApiBaseUrl}api/referral/${
      referralDemographics.referralId
    }/coordination/cdpas`;

    console.log(model);
    return this.http.post<ReferralDemographics>(updateUrl, model);
  }

  getCDPASInfo(cdpasId: number): Observable<any> {
    const url = `${this.config.ApiBaseUrl}api/referral/${cdpasId}/coordination/cdpas`;

    return this.http.get<any>(url);
  }

  public getReferralSubStatus(filter: string): Observable<Lookup[]> {
    return this.helperService.getEnumNameValueLookup(
      LookupTypesEnum.ReferralSubStatusLookupService,
      filter
    );
  }

  public getReferralEnrollmentList(
    referralId: number
  ): Observable<ReferralEnrollmentModel[]> {
    const url =
      this.config.ApiBaseUrl + "api/referral/" + referralId + "/enrollments";
    return this.http.get<ReferralEnrollmentModel[]>(url);
  }

  public getAssessmentList(
    referralId: number
  ): Observable<IReferralAssessment[]> {
    const url = `${
      this.config.ApiBaseUrl
    }api/referral/${referralId}/assessment`;
    return this.http.get<IReferralAssessment[]>(url);
  }

  getReferralAuthorizations(referralId: number): Observable<any> {
    const referralApiUrl = `${
      this.config.ApiBaseUrl
    }api/referral/${referralId}/authorization`;
    return this.http.get(referralApiUrl);
  }

  public saveEnrollmentData(
    referralId: number,
    enrollment: ReferralEnrollmentModel
  ): Observable<ReferralEnrollmentModel> {
    const model = {
      enrollmentId: enrollment.enrollmentId,
      approveStartDate: enrollment.approveStartDate,
      enrollmentDate: enrollment.enrollmentDate,
      insuranceId: enrollment.insuranceId,
      statusId: enrollment.statusId,
      denialReasonId: enrollment.denialReasonId,
      referralId: referralId
    };
    const url = `${
      this.config.ApiBaseUrl
    }api/referral/${referralId}/enrollments/update`;
    return this.http.post<ReferralEnrollmentModel>(url, model);
  }

  saveAssessment(
    referralId: number,
    assessment: ReferralAssessment
  ): Observable<ReferralAssessment> {

    const assessmentUpdateUrl = `${
      this.config.ApiBaseUrl
    }api/referral/${referralId}/assessment/update`;
    return this.http.post<ReferralAssessment>(assessmentUpdateUrl, assessment);
  }

  saveChartPhysician(
    chartId: number,
    chartPhysician: ChartPhysician
  ): Observable<ChartPhysician> {
    const physicianUpdateURL = `${
      this.config.ApiBaseUrl
    }api/charts/${chartId}/physicians`;
    return this.http.post<ChartPhysician>(physicianUpdateURL, chartPhysician);
  }

  deleteChartPhysician(
    chartId: number,
    chartPhysicianId: number
  ): Observable<any> {
    const physicianDeleteURL = `${
      this.config.ApiBaseUrl
    }api/charts/${chartId}/physicians/${chartPhysicianId}`;
    return this.http.delete<any>(physicianDeleteURL);
  }

  getChartPhysicians(chartId: number): Observable<ChartPhysician[]> {
    const physicianGetListURL = `${
      this.config.ApiBaseUrl
    }api/charts/${chartId}/physicians`;
    return this.http.get<ChartPhysician[]>(physicianGetListURL);
  }

  setChartPhysicianAsDefault(
    chartId: number,
    chartPhysician: ChartPhysician
  ): Observable<ChartPhysician> {
    const physicianSetAsDefaultURL = `${
      this.config.ApiBaseUrl
    }api/charts/${chartId}/physicians/setAsDefault`;

    return this.http.post<ChartPhysician>(
      physicianSetAsDefaultURL,
      chartPhysician
    );
  }

  updateClinicalInfo(
    referralDemographics: ReferralDemographics
  ): Observable<any> {
    const clinicalInfoUpdateUrl = `${this.config.ApiBaseUrl}api/charts/${
      referralDemographics.chartId
    }/clinical`;

    const model = {
      isPDN: referralDemographics.isPDN,
      transportationLevelId: referralDemographics.transportationLevelId,
      evacuationLocationId: referralDemographics.evacuationLocationId,
      evacuationZoneId: referralDemographics.evacuationZoneId
    };

    return this.http.post(clinicalInfoUpdateUrl, model);
  }

  addNewReferral(referralDemographics: ReferralDemographics): Observable<any> {
    const addNewReferralUrl = `${this.config.ApiBaseUrl}api/referral/new`;

    const model = {
      referralId: referralDemographics.referralId,
      chartId: referralDemographics.chartId,

      // About
      firstName: referralDemographics.firstName,
      lastName: referralDemographics.lastName,
      middleInitial: referralDemographics.middleInitial,
      nickName: referralDemographics.nickName,
      dateOfBirth: referralDemographics.dateOfBirth,
      socialSecurity: referralDemographics.socialSecurity,
      gender: referralDemographics.gender,

      // Contact
      serviceAddress: referralDemographics.serviceAddress,
      mailingAddress: referralDemographics.mailingAddress,
      homePhone: referralDemographics.homePhone,
      cellPhone: referralDemographics.cellPhone,
      fax: referralDemographics.fax,
      email: referralDemographics.email,

      // Emergency Contacts
      emergencyContact: referralDemographics.emergencyContact,

      // Coordination
      sabbathObservant: referralDemographics.sabbathObservant,
      intakeCoordinatorId: referralDemographics.intakeCoordinatorId,
      languageId: referralDemographics.primaryLanguageId,
      attendsSocialDayCare: referralDemographics.dayCareId,
      dayCareId: referralDemographics.dayCareId,
      genderPreferenceId: referralDemographics.genderPreferenceId,
      primaryLanguageId: referralDemographics.primaryLanguageId,
      // cdpas: referralDemographics.cdpas,
      preferredCaregiverGenderId: referralDemographics.genderPreferenceId,
      otherGenderAcceptanceId: referralDemographics.otherGenderAcceptanceId,
      coordinationComments: referralDemographics.coordinationComments,

      // Intake
      nursingHomeDischarge: referralDemographics.nursingHomeDischarge,
      transferCase: referralDemographics.transferCase,
      referralStatus: referralDemographics.referralStatus,
      patientStatus: referralDemographics.patientStatus,
      referralDenialReasonId: referralDemographics.referralDenialReasonId,
      referredBy: referralDemographics.referredBy,
      referredByOrganization: referralDemographics.referredByOrganization,
      referralReason: referralDemographics.referralReason,
      referralStatusId: referralDemographics.referralStatusId,
      referralSubStatusId: referralDemographics.referralSubStatusId,
      referredById: referralDemographics.referredById,
      referralSourceId: referralDemographics.referralSourceId,

      // Clinical
      isPDN: referralDemographics.isPDN,
      transportationLevelId: referralDemographics.transportationLevelId,
      evacuationLocationId: referralDemographics.evacuationLocationId,
      evacuationZoneId: referralDemographics.evacuationZoneId,

      // Medicare
      medicaidNumber: referralDemographics.medicaidMemberId,
      medicareNumber: referralDemographics.medicareMemberId,
      covered: referralDemographics.coveredForMedicaid,
      entitlementIssue: referralDemographics.entitlementIssues,
      entitlementIssueComment: referralDemographics.entitlementIssuesComment,
      medicaidComment: referralDemographics.medicaidComment,
      lastMaximusDate: referralDemographics.maximusDate,
      lastMaximusScore: referralDemographics.maximusScore,

      chartPhysicians: referralDemographics.chartPhysicians
    };

    return this.http.post(addNewReferralUrl, model);
  }
}

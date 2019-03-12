import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ReferralDemographics } from "../../../core/models";

@Component({
  selector: "app-referralprofile",
  templateUrl: "./referral-profile.component.html",
  styleUrls: ["./referral-profile.component.scss"]
})
export class ReferralProfileComponent implements OnInit {
  referralModel: ReferralDemographics;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.referralModel = data["referral"];
      console.log('referral model ---- ', data);
    });
  }
}

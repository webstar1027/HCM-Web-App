import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-patient-profile',
    templateUrl: 'patient-profile.component.html',
    styleUrls: ['patient-profile.component.scss']
})
export class PatientProfileComponent implements OnInit {

  patientModel: any;
  profileLinks = ['demographics', 'coordination', 'clinical', 'calendar', 'contracts' , 'documents', 'notes'];
  profileIconList = ['wc', 'subject', 'assignment', 'today', 'work', 'layers', 'speaker_notes'];

  activeLink = this.profileLinks[0];
  constructor(private route: ActivatedRoute ) {}

  ngOnInit(): void {
    this.route.data.subscribe((res) => {
        this.patientModel = res['patient'];
    });
  }
}

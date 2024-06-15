import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { LineOfBusiness } from '../LineOfBusiness';
import { LineOfBusinessService } from '../lineOfBusiness.service';

import { RecentQuoteService } from '../recentQuote.service';

@Component({
  selector: 'app-lineOfBusiness-detail',
  templateUrl: './lineOfBusiness-detail.component.html',
  styleUrls: [ './lineOfBusiness-detail.component.css' ]
})
export class LineOfBusinessDetailComponent implements OnInit {
  lineOfBusiness: LineOfBusiness | undefined;
  recentQuoteCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private lineOfBusinessService: LineOfBusinessService,
    private recentQuoteService: RecentQuoteService,
    private location: Location
  ) {
    this.route.paramMap.subscribe(() => this.ngOnInit());
  }

  ngOnInit(): void {
    this.getLineOfBusiness();
    this.getLineOfBusinessQuotes();
  }

  getLineOfBusiness(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.lineOfBusinessService.getLineOfBusiness(id)
      .subscribe(lineOfBusiness => this.lineOfBusiness = lineOfBusiness);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.lineOfBusiness) {
      this.lineOfBusinessService.updateLineOfBusiness(this.lineOfBusiness)
        .subscribe(() => this.goBack());
    }
  }

  getLineOfBusinessQuotes(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.recentQuoteService.getQuotesForLineOfBusinessNo404(id)
      .subscribe(recentQuotes => this.recentQuoteCount = recentQuotes.length);
  }
}

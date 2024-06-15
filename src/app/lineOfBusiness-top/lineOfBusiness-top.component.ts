import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

import { LineOfBusiness } from '../LineOfBusiness';
import { LineOfBusinessService } from '../lineOfBusiness.service';

import { RecentQuoteService } from '../recentQuote.service';
import { LineOfBusinessRecentQuotes } from '../LineOfBusinessRecentQuotes';

@Component({
  selector: 'app-lineOfBusiness-top',
  templateUrl: './lineOfBusiness-top.component.html',
  styleUrls: ['./lineOfBusiness-top.component.css']
})
export class LineOfBusinessTopComponent implements OnInit {
  topLinesOfBusiness: LineOfBusinessRecentQuotes[] = [];

  constructor(
    private lineOfBusinessService: LineOfBusinessService,
    private recentQuoteService: RecentQuoteService
  ) { } 

  ngOnInit() {
    this.getTopLinesOfBusiness();
  }

  getTopLinesOfBusiness(): void {
    this.lineOfBusinessService.getLinesOfBusiness()
    .pipe(
      map(businessLines => businessLines.map((lineOfBusiness) => lineOfBusiness))
    )
    .subscribe(linesOfBusiness => this.rankLinesOfBusiness(linesOfBusiness));
  }

  /** 
   * For each line of business, count the recent quotes 
   * then sort them by said count and pull out the top 2
  */
  rankLinesOfBusiness(lines:LineOfBusiness[]): void {
    lines.forEach(lineOfBusiness => {
      this.recentQuoteService.getQuotesForLineOfBusinessNo404(lineOfBusiness.id)
      .subscribe(recentQuotes => {
        this.topLinesOfBusiness
          .push({businessId:lineOfBusiness.id, businessName:lineOfBusiness.name, recentQuotes:recentQuotes.length});
        this.topLinesOfBusiness.sort((a,b) => b.recentQuotes - a.recentQuotes);
        this.topLinesOfBusiness = this.topLinesOfBusiness.slice(0,2);
      });
    });
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';

import { RecentQuote } from './RecentQuote';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class RecentQuoteService {

  private recentQuoteUrl = 'api/recentQuotes';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET recent quotes from the server */
  getRecentQuotes(): Observable<RecentQuote[]> {
    return this.http.get<RecentQuote[]>(this.recentQuoteUrl)
      .pipe(
        tap(_ => this.log('fetched recent quotes')),
        catchError(this.handleError<RecentQuote[]>('getRecentQuotes', []))
      );
  }

  /** GET recent quotes for a line of business by line of business id. 
   * Return `undefined` when quotes not found */
  getQuotesForLineOfBusinessNo404(id: number): Observable<RecentQuote[]> {
    const url = `${this.recentQuoteUrl}/?lineOfBusiness=${id}`;
    return this.http.get<RecentQuote[]>(url)
      .pipe(
        tap(x => x.length ?
          this.log(`found recent quotes for line of business id=${id}`) :
          this.log(`no recent quotes for line of business matching id=${id}`)),
       catchError(this.handleError<RecentQuote[]>('getQuotesForLineOfBusinessNo404', []))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a RecentQuoteService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`RecentQuoteService: ${message}`);
  }
}

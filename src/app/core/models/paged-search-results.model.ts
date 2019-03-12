export class PagedSearchResultModel<T> {

  public data: T[];
  currentPage: number;
  pageSize: number;
  totalInSearchResults: number;
  totalPages: number;

}

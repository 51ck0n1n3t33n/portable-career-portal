export class SearchService {
    swimlane;
    corpToken;

    constructor(swimlane, corpToken) {
        this.swimlane = swimlane;
        this.corpToken = corpToken;
    }

    get baseUrl() {    
        return `https://public-rest${this.swimlane}.bullhornstaffing.com:443/rest-services/${this.corpToken}`;
    }

    async getjobs(filter = '', params = {}, count = 30) {
        let queryArray = [];
        params.query = `(isOpen:1) AND (isDeleted:0)`;
        params.fields =  [
            "id",
            "title",
            "employmentType",
            "dateLastPublished",
            "publicDescription"
          ];
        params.count = count;
        params.sort = '-dateLastModified';
        params.showTotalMatched = true;
    
        for (let key in params) {
          queryArray.push(`${key}=${params[key]}`);
        }
        let queryString = queryArray.join('&');
    
        return await fetch(`${this.baseUrl}/search/JobOrder?${queryString}`);
      }
    
}
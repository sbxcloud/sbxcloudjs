import QueryBuilder from 'sbx-querybuilder/index';

export class SbxCore{

    constructor(){

    }
    public static environment = { } as any;
    public urls: any = {
        update_password: '/user/v1/password',
        login: '/user/v1/login',
        register: '/user/v1/register',
        validate: '/user/v1/validate',
        row: '/data/v1/row',
        find: '/data/v1/row/find',
        update: '/data/v1/row/update',
        delete: '/data/v1/row/delete',
        downloadFile: '/content/v1/download',
        uploadFile: '/content/v1/upload',
        addFolder: '/content/v1/folder',
        folderList: '/content/v1/folder',
        send_mail: '/email/v1/send',
        payment_customer: '/payment/v1/customer',
        payment_card: '/payment/v1/card',
        payment_token: '/payment/v1/token',
        password: '/user/v1/password/request',
        cloudscript_run: '/cloudscript/v1/run'
    };

    public initialize(domain: number, appKey: string, baseUrl: string = 'https://sbxcloud.com/api') {
        SbxCore.environment.domain = domain;
        SbxCore.environment.baseUrl = baseUrl;
        SbxCore.environment.appKey = appKey;
    }


    private encodeEmails(email: string) {
        const spl = email.split('@');
        if (spl.length > 1) {
            email = encodeURIComponent(spl[0]) + '@' + spl[1];
        }
        return email;
    }

    private validateLogin(login: string): boolean {
        const rlogin   =  /^(\w?\.?\-?)+$/;
        return rlogin.test(login);
    }

    private validateEmail(email: string): boolean {
        const rlogin  =  /^(\w?\.?\-?\+?)+@(\w?\.?\-?)+$/;
        return rlogin.test(email);
    }

    /**
     * UTILS
     */

    private queryBuilderToInsert(data, letNull?: Boolean): any {
        const query =   new QueryBuilder()
            .setDomain(SbxCore.environment.domain);
        if (Array.isArray(data) ) {
            data.forEach(item => {
                query.addObject(this.validateData(item, letNull));
            });
        }else {
            query.addObject(this.validateData(data, letNull));
        }
        return query;
    }

    public validateData(data: any, letNull?: Boolean): any {
        const temp = {};
        Object.keys(data)
            .filter(key => {
                const v = data[key];
                return (((Array.isArray(v) || typeof v === 'string') ?
                    (v.length > 0) :
                    (v !== null && v !== undefined)) || letNull);
            }).forEach(key => {
            if ( (data[key] !== null && data[key] !== undefined)  && data[key]._KEY != null) {
                data[key] = data[key]._KEY;
            }
            const key2 = (key !== '_KEY') ? key.replace(/^_/, '') : key;
            temp[key2] = data[key];
        });
        return temp;
    }

    public validateKeys(data: any): any {
        const temp = [];
        if (Array.isArray(data) ) {
            data.forEach(key => {
                if (typeof key === 'string') {
                    temp.push(key);
                }else {
                    temp.push(key._KEY);
                }
            });
        }else {
            if (typeof data === 'string') {
                temp.push(data);
            }else {
                temp.push(data._KEY);
            }
        }
        return temp;
    }

}

export class Find {
  public query;
  private lastANDOR?: string;

  constructor(model: string, domain: number) {
    this.query = new QueryBuilder().setDomain(domain).setModel(model);
    this.lastANDOR = null;
  }

  public newGroupWithAnd() {
    this.query.newGroup('AND');
    this.lastANDOR = null;
    return this;
  }

  public newGroupWithOr() {
    this.query.newGroup('OR');
    this.lastANDOR = null;
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public andWhereIsEqual(field: string, value: any) {
    this.lastANDOR =  'AND';
    this.query.addCondition(this.lastANDOR, field, '=', value);
    return this;
  }

  /**
   * @param {string} field
   * @return {Find}
   */

  public andWhereIsNotNull(field: string) {
    this.lastANDOR = 'AND';
    this.query.addCondition(this.lastANDOR, field, 'IS NOT', null);
    return this;
  }

  /**
   * @param {string} field
   * @return {Find}
   */
  public andWhereIsNull(field: string) {
    this.lastANDOR = 'AND';
    this.query.addCondition(this.lastANDOR, field, 'IS', null);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public andWhereGreaterThan(field: string, value: any) {
    this.lastANDOR = 'AND';
    this.query.addCondition(this.lastANDOR, field, '>', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public andWhereLessThan(field: string, value: any) {
    this.lastANDOR = 'AND';
    this.query.addCondition(this.lastANDOR, field, '<', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public andWhereGreaterOrEqualThan(field: string, value: any) {
    this.lastANDOR = 'AND';
    this.query.addCondition(this.lastANDOR, field, '>=', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public andWhereLessOrEqualThan(field: string, value: any) {
    this.lastANDOR = 'AND';
    this.query.addCondition(this.lastANDOR, field, '<=', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public andWhereIsNotEqual(field: string, value: any) {
    this.lastANDOR = 'AND';
    this.query.addCondition(this.lastANDOR, field, '!=', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public andWhereStartsWith(field: string, value: string) {
    this.lastANDOR = 'AND';
    value = value && value.length > 0 ? `%${value}` : value;
    this.query.addCondition(this.lastANDOR, field, 'LIKE', value);
    return this;
  }


  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public andWhereEndsWith(field: string, value: string) {
    this.lastANDOR = 'AND';
    value = value && value.length > 0 ? `${value}%` : value;
    this.query.addCondition(this.lastANDOR, field, 'LIKE', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public andWhereContains(field: string, value: string) {
    this.lastANDOR = 'AND';
    value = value && value.length > 0 ? `%${value.split(' ').join('%')}%` : value;
    this.query.addCondition(this.lastANDOR, field, 'LIKE', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public andWhereIn(field: string, value: any) {
    this.lastANDOR = 'AND';
    this.query.addCondition(this.lastANDOR, field, 'IN', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public andWhereNotIn(field: string, value: any) {
    this.lastANDOR = 'AND';
    this.query.addCondition(this.lastANDOR, field, 'NOT IN', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public orWhereIsEqual(field: string, value: any) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    this.query.addCondition(this.lastANDOR, field, '=', value);
    return this;
  }

  /**
   * @param {string} field
   * @return {Find}
   */
  public orWhereIsNotNull(field: string) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    this.query.addCondition(this.lastANDOR, field, 'IS NOT', null);
    return this;
  }

  /**
   * @param {string} field
   * @return {Find}
   */
  public orWhereIsNull(field: string) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    this.query.addCondition(this.lastANDOR, field, 'IS', null);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public orWhereGreaterThan(field: string, value: any) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    this.query.addCondition(this.lastANDOR, field, '>', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public orWhereLessThan(field: string, value: any) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    this.query.addCondition(this.lastANDOR, field, '<', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public orWhereGreaterOrEqualThan(field: string, value: any) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    this.query.addCondition(this.lastANDOR, field, '>=', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public orWhereLessOrEqualThan(field: string, value: any) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    this.query.addCondition(this.lastANDOR, field, '<=', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public orWhereIsNotEqual(field: string, value: any) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    this.query.addCondition(this.lastANDOR, field, '!=', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public orWhereStartsWith(field: string, value: string) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    value = value && value.length > 0 ? `%${value}` : value;
    this.query.addCondition(this.lastANDOR, field, 'LIKE', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public orWhereEndsWith(field: string, value: string) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    value = value && value.length > 0 ? `${value}%` : value;
    this.query.addCondition(this.lastANDOR, field, 'LIKE', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public orWhereContains(field: string, value: string) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    // if the user sends null or empty, there will be no wildcar placed.
    value = value && value.length > 0 ? `%${value.split(' ').join('%')}%` : value;
    this.query.addCondition(this.lastANDOR, field, 'LIKE', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public orWhereIn(field: string, value: any) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    this.query.addCondition(this.lastANDOR, field, 'IN', value);
    return this;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public orWhereNotIn(field: string, value: any) {
    this.lastANDOR = (this.lastANDOR == null) ? 'AND' : 'OR';
    this.query.addCondition(this.lastANDOR, field, 'NOT IN', value);
    return this;
  }

  /**
   * Reference Join between two model
   * @param {string} field column name of principal model
   * @param {string} referenceField column name of subQuery
   */
  public orWhereReferenceJoinBetween(field: string, referenceField: string) {
    return new ReferenceJoin(this, field, referenceField, 'OR');
  }

  /**
   * Reference Join between two model
   * @param {string} field column name of principal model
   * @param {string} referenceField column name of subQuery
   */
  public andWhereReferenceJoinBetween(field: string, referenceField: string) {
    return new ReferenceJoin(this, field, referenceField, 'AND');
  }

  public whereWithKeys(keys) {
    this.query.whereWithKeys(this.validateKeys(keys));
    return this;
  }

  /**
   * @param {string} field
   * @param asc
   * @return {Find}
   */
  public orderBy(field: string, asc: Boolean= false) {
    this.query.orderBy(field, asc);
    return this;
  }

  public fetchModels(array: string[]) {
    this.query.fetchModels(array);
    return this;
  }

  public setPage(page: number) {
    this.query.setPage(page);
    return this;
  }

  public setPageSize(limit: number) {
    this.query.setPageSize(limit);
    return this;
  }

  private validateKeys(data: any): any {
    const temp = [];
    if (Array.isArray(data) ) {
      data.forEach(key => {
        if (typeof key === 'string') {
          temp.push(key);
        }else {
          temp.push(key._KEY);
        }
      });
    }else {
      if (typeof data === 'string') {
        temp.push(data);
      }else {
        temp.push(data._KEY);
      }
    }
    return temp;
  }


  public mapReverseFetchesResult(response: any, parentName: string, arrayName: string, completefetch?: string[]  ){
    if(parentName.indexOf(".")>=0) throw Error("Only one level is allowed");
      completefetch = completefetch || [parentName];
      const newResponse = this.mapFetchesResult(response, completefetch);
      const objTemp = newResponse.results.reduce( function( objects, item ){
              objects[item[parentName]._KEY] =   objects[item[parentName]._KEY] || item[parentName];
              objects[item[parentName]._KEY][arrayName] =  objects[item[parentName]._KEY][arrayName] || [];
              item[parentName]=item[parentName]._KEY;
              objects[item[parentName]._KEY][arrayName].push(item)
          }
          ,{});
      newResponse.results = Object.keys(objTemp).map( k => objTemp(k));
      return newResponse;

  }
  
  /**
   * @param response the response of the server
   * @param {string[]} completefetch the array of fetch
   * @returns {any} the response with the union between fetch_results and results
   */
  public mapFetchesResult(response: any, completefetch: string[] ) {

    if (response.fetched_results) {
      const fetch = [];
      const secondfetch = {};
      for (let i = 0; i < completefetch.length; i++) {
        let index = 0;
        const temp = completefetch[i].split('.');
        if (fetch.indexOf(temp[0]) < 0) {
          fetch.push(temp[0]);
          index = fetch.length - 1;
        } else {
          index = fetch.indexOf(temp[0]);
        }
        if (temp.length === 2 && !secondfetch[fetch[index]]) {
          secondfetch[fetch[index]] = [];
        }

        if (temp.length === 2) {
          secondfetch[fetch[index]].push(temp[1]);
        }
      }
      for (let i = 0; i < response.results.length; i++) {
        for (let j = 0; j < fetch.length; j++) {
          for (const mod in response.fetched_results) {
            if (response.fetched_results[mod][response.results[i][fetch[j]]]) {
              response.results[i][fetch[j]] = response.fetched_results[mod][response.results[i][fetch[j]]];
              if (secondfetch[fetch[j]]) {
                for (let k = 0; k < secondfetch[fetch[j]].length; k++) {
                  const second = secondfetch[fetch[j]][k];
                  for (const mod2 in response.fetched_results) {
                    if (response.fetched_results[mod2][response.results[i][fetch[j]][second]]) {
                      response.results[i][fetch[j]][second] =
                        response.fetched_results[mod2][response.results[i][fetch[j]][second]];
                      break;
                    }
                  }
                }
              }

              break;
            }
          }
        }

      }
    }

    return response;
  }
}

export class ReferenceJoin {
  
  private find: Find;
  private field: string;
  private referenceField: string;

  constructor(find: Find, field: string, referenceField: string, type: string) {
    this.find = find;
    this.field = field;
    this.referenceField = referenceField;
    if (type === 'AND') {
      this.find.andWhereIn(this.field, '@reference_join@');
    } else {
      this.find.orWhereIn(this.field, '@reference_join@');
    }
  }

  /**
   * set model to Join
   * @param {string} referenceModel
   * @return {FilterJoin}
   */
  public in(referenceModel: string) {
    return new FilterJoin(this.find, this.field, this.referenceField, referenceModel);
  }
}
  
  
export class FilterJoin {

  private find: Find;
  private field: string;
  private referenceField: string;
  private referenceModel: string;


  constructor(find: Find, field: string, referenceField: string, referenceModel: string) {
    this.find = find;
    this.field = field;
    this.referenceField = referenceField;
    this.referenceModel = referenceModel;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   */
  public filterWhereIsEqual(field: string, value: any) {
    this.find.query.setReferenceJoin('=', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @return {Find}
   * @constructor
   */
  public FilterWhereIsNotNull(field: string) {
    this.find.query.setReferenceJoin('IS NOT', this.field, this.referenceField, this.referenceModel, null);
    return this.find;
  }

  /**
   * @param {string} field
   * @return {Find}
   * @constructor
   */
  public FilterWhereIsNull(field: string) {
    this.find.query.setReferenceJoin('IS', this.field, this.referenceField, this.referenceModel, null);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereGreaterThan(field: string, value: any) {
    this.find.query.setReferenceJoin('>', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereLessThan(field: string, value: any) {
    this.find.query.setReferenceJoin('<', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereGreaterOrEqualThan(field: string, value: any) {
    this.find.query.setReferenceJoin('>=', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereLessOrEqualThan(field: string, value: any) {
    this.find.query.setReferenceJoin('<=', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereIsNotEqual(field: string, value: any) {
    this.find.query.setReferenceJoin('!=', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereLike(field: string, value: any) {
    this.find.query.setReferenceJoin('LIKE', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereIn(field: string, value: any) {
    this.find.query.setReferenceJoin('IN', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }

  /**
   * @param {string} field
   * @param value
   * @return {Find}
   * @constructor
   */
  public FilterWhereNotIn(field: string, value: any) {
    this.find.query.setReferenceJoin('NOT IN', this.field, this.referenceField, this.referenceModel, value);
    return this.find;
  }
}  
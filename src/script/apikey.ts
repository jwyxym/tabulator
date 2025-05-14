import { ApiKeyObject } from './type.ts';

class ApiKey {
    name : string;
    description : string;
    expireAt : string;
    id : number;
    userId : number;
    key : string;

    constructor(obj : ApiKeyObject) {
        this.name = obj.name;
        this.description = obj.description;
        this.expireAt = obj.expireAt;
        this.id = obj.id;
        this.userId = obj.userId;
        this.key = obj.key;
    }
}
export default ApiKey;
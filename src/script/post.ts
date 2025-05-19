import axios, { AxiosInstance } from 'axios';
import Tournament from '../script/tournament.ts';
import Participant from '../script/participant.ts';
import Match from '../script/match.ts';
import ApiKey from '../script/apikey.ts';
import {
    TournamentObject,
    TournamentCreateObject,
    TournamentFindObject,
    MatchObject,
    MatchUpdateObject,
    MatchFindObject,
    ParticipantObject,
    ParticipantCreateObject,
    ParticipantUpdateObject,
    ParticipantFindObject,
    ApiKeyObject,
    ApiKeyCreateObject,
    ApiKeyFindObject,
    AllTournament,
    AllParticipant,
    AllMatch,
    UserObject
} from './type.ts'

class TabulatorAPI {
    url : AxiosInstance;

    constructor(url : string) {
        this.url = axios.create({
            baseURL : url
        });
    }

    Tournament = {
        Create : async (token : string, TournamentData : TournamentCreateObject) : Promise<number> => {
            let response : {
                data : {
                    data : TournamentObject;
                }
            };
            try {
                response = await this.url.post(`/api/tournament`, TournamentData, {
                    headers: { 
                        'x-user-token' : token
                    }
                });
                return response.data.data.id;
            }
            catch(error) {
                uni.showModal({
                    title : '创建失败',
                    content : error.message,
                    showCancel : false
                });
                console.error(error);
                return -1;
            }
        },
        Delete : async (token : string, id : number) : Promise<Boolean> => {
            let response : {
                data : {
                    success : boolean;
                }
            };
            try {
                response = await this.url.delete(`/api/tournament/${id}`, {
                    headers: {
                        'x-user-token' : token
                    }
                });
                return response.data.success;
            }
            catch(error) {
                console.error(error);
                return false;
            }
        },
        Find : async (token : string, id : number) : Promise<Tournament | undefined> => {
            let response : {
                data : {
                    data : TournamentObject;
                }
            };
            try {
                response = await this.url.get(`/api/tournament/${id}`, {
                    headers: { 
                        'x-user-token' : token
                    }
                });
                return new Tournament(response.data.data);
            }
            catch(error) {
                console.error(error);
                return undefined;
            }
        },
        FindALL : async (token : string, obj : TournamentFindObject = {}) : Promise<AllTournament> => {
            const filter = (obj : any) : any => {
                const v = obj ?? '';
                return v != '' && v != ' ' ? obj : undefined;
            }
            let response :  {
                data : {
                    total : number;
                    data : Array<TournamentObject>;
                }
            };
            try {
                response = await this.url.get(`/api/tournament`, {
                    params : {
                        recordsPerPage : 20,
                        pageCount : obj.pageCount ?? 1,
                        id : (obj.id ?? 0) > 0 ? obj.id : undefined,
                        creator : filter(obj.creator),
                        name : filter(obj.name),
                        rule : filter(obj.rule),
                        visibility : filter(obj.visibility),
                        status : filter(obj.status),
                        createdAtBefore: obj.before?.toISOString() ?? undefined,
                        createdAtAfter: obj.after?.toISOString() ?? undefined
                    },
                    headers : {
                        'x-user-token' : token
                    }
                });
                let tournaments : Array<Tournament> = [];
                response.data.data.forEach((i : TournamentObject) => {
                    tournaments.push(new Tournament(i));
                });
                return {
                    total : response.data.total,
                    tournaments : tournaments
                };
            }
            catch(error) {
                console.error(error);
                return {
                    total : 0,
                    tournaments : []
                };
            }
        },
        Update : async (token : string, id : number, Data : TournamentCreateObject) : Promise<boolean> => {
            let response :  {
                data : {
                    success : boolean;
                }
            };
            try {
                response = await this.url.patch(`/api/tournament/${id}`, Data, {
                    headers : {
                        'x-user-token' : token
                    }
                });
                console.log(response)
                return response.data.success;
            }
            catch(error) {
                console.error(error);
                return false;
            }
        },
        Start : async (token : string, id : number) : Promise<boolean> => {
            let response :  {
                data : {
                    success : boolean;
                }
            };
            try {
                response = await this.url.post(`/api/tournament/${id}/start`, {}, {
                    headers : {
                        'x-user-token' : token
                    }
                });
                console.log(response)
                return response.data.success;
            }
            catch(error) {
                console.error(error);
                return false;
            }
        },
        Reset : async (token : string, id : number) : Promise<boolean> => {
            let response :  {
                data : {
                    success : boolean;
                }
            };
            try {
                response = await this.url.post(`/api/tournament/${id}/reset`, {}, {
                    headers : {
                        'x-user-token' : token
                    }
                });
                console.log(response)
                return response.data.success;
            }
            catch(error) {
                console.error(error);
                return false;
            }
        },
        Finish : async (token : string, id : number) : Promise<boolean> => {
            let response :  {
                data : {
                    success : boolean;
                }
            };
            try {
                response = await this.url.post(`/api/tournament/${id}/finish`, {}, {
                    headers : {
                        'x-user-token' : token
                    }
                });
                console.log(response)
                return response.data.success;
            }
            catch(error) {
                console.error(error);
                return false;
            }
        },
    }
    Participant = {
        Create : async (token : string, Data : ParticipantCreateObject, Array : Array<Participant> = []) : Promise<boolean> => {
            let response :  {
                data : {
                    success : boolean;
                }
            };
            try {
                if (Data.name.length == 0)
                    throw new Error('请填写名称');
                if (Array.findIndex(i => Data.name == i.name) > -1)
                    throw new Error('名称重复');
                response = await this.url.post(`/api/participant`, Data, {
                    headers : {
                        'x-user-token' : token
                    }
                });
                return response.data.success;
            }
            catch(error) {
                console.error(error);
                return false;
            }
        },
        CreateGroup : async (token : string, Data : Array<ParticipantCreateObject>) : Promise<boolean> => {
            let response :  {
                data : {
                    success : boolean;
                }
            };
            try {
                response = await this.url.post(`/api/participant/import`, {
                    data : Data
                }, {
                    headers : {
                        'x-user-token' : token
                    }
                });
                return response.data.success;
            }
            catch(error) {
                console.error(error);
                return false;
            }
        },
        Find : async (token : string, id : number) : Promise<Participant | undefined> => {
            let response :  {
                data : {
                    data : ParticipantObject;
                }
            };
            try {
                response = await this.url.get(`/api/participant/${id}`, {
                    headers : {
                        'x-user-token' : token
                    }
                });
                return new Participant(response.data.data);
            }
            catch(error) {
                console.error(error);
                return undefined;
            }
        },
        FindALL : async (token : string, obj : ParticipantFindObject = {}) : Promise<AllParticipant> => {
            let response :  {
                data : {
                    total : number;
                    data : Array<ParticipantObject>;
                }
            };
            try {
                response = await this.url.get(`/api/participant`, {
                    params : {
                        recordsPerPage : 20,
                        pageCount : obj.pageCount ?? 1,
                        id : obj.id,
                        name : obj.name,
                        quit : obj.quit,
                        tournamentId : obj.tournamentId
                    },
                    headers : {
                        'x-user-token' : token
                    }
                });
                let participants : Array<Participant> = [];
                response.data.data.forEach((i : ParticipantObject) => {
                    participants.push(new Participant(i));
                })
                return {
                    total : response.data.total,
                    participants : participants
                };
            }
            catch(error) {
                console.error(error);
                return {
                    total : 0,
                    participants : []
                };
            }
        },
        Update : async (token : string, id : number, Data : ParticipantUpdateObject) : Promise<boolean> => {
            let response :  {
                data : {
                    success : boolean;
                }
            };
            try {
                response = await this.url.patch(`/api/participant/${id}`, Data, {
                    headers : {
                        'x-user-token' : token
                    }
                });
                return response.data.success;
            }
            catch(error) {
                console.error(error);
                return false;
            }
        },
        Delete : async (token : string, id : number) : Promise<Boolean> => {
            let response : {
                data : {
                    success : boolean;
                }
            };
            try {
                response = await this.url.delete(`/api/participant/${id}`, {
                    headers: {
                        'x-user-token' : token
                    }
                });
                return response.data.success;
            }
            catch(error) {
                console.error(error);
                return false;
            }
        }
    }
    Match = {
        Find : async (token : string, id : number) : Promise<Match | undefined> => {
            let response :  {
                data : {
                    data : MatchObject;
                }
            };
            try {
                response = await this.url.get(`/api/match/${id}`, {
                    headers : {
                        'x-user-token' : token
                    }
                });
                return new Match(response.data.data);
            }
            catch(error) {
                console.error(error);
                return undefined;
            }
        },
        FindALL : async (token : string, obj : MatchFindObject = {}) : Promise<AllMatch> => {
            let response :  {
                data : {
                    total : number;
                    data : Array<MatchObject>;
                }
            };
            try {
                response = await this.url.get(`/api/match`, {
                    params : {
                        recordsPerPage : 20,
                        pageCount : obj.pageCount ?? 1,
                        id : obj.id,
                        tournamentId : obj.tournamentId,
                        round : obj.round,
                        isThirdPlaceMatch : obj.isThirdPlaceMatch,
                        status : obj.status,
                        player1Id : obj.player1Id,
                        player1Score : obj.player1Score,
                        player2Id : obj.player2Id,
                        player2Score : obj.player2Score,
                        winnerId : obj.winnerId,
                        childMatchId : obj.childMatchId,
                        statusIn : obj.statusIn
                    },
                    headers : {
                        'x-user-token' : token
                    }
                });
                let matchs : Array<Match> = [];
                response.data.data.forEach((i : MatchObject) => {
                    matchs.push(new Match(i));
                })
                return {
                    total : response.data.total,
                    matchs : matchs
                };
            }
            catch(error) {
                console.error(error);
                return {
                    total : 0,
                    matchs : []
                };
            }
        },
        Update : async (token : string, id : number, Data : MatchUpdateObject) : Promise<boolean> => {
            let response :  {
                data : {
                    success : boolean;
                }
            };
            try {
                response = await this.url.patch(`/api/match/${id}`, Data, {
                    headers : {
                        'x-user-token' : token
                    }
                });
                return response.data.success;
            }
            catch(error) {
                console.error(error);
                return false;
            }
        }
    }
    ApiKeyObject = {
        Create : async (token : string, Data : ApiKeyCreateObject) : Promise<boolean> => {
            let response :  {
                data : {
                    success : boolean;
                }
            };
            try {
                response = await this.url.post(`/api/api-key`, Data, {
                    headers : {
                        'x-user-token' : token
                    }
                });
                return response.data.success;
            }
            catch(error) {
                console.error(error);
                return false;
            }
        },
        Find : async (token : string, id : number) : Promise<ApiKey | undefined> => {
            let response :  {
                data : {
                    data : ApiKeyObject;
                }
            };
            try {
                response = await this.url.get(`/api/api-key/${id}`, {
                    headers : {
                        'x-user-token' : token
                    }
                });
                return new ApiKey(response.data.data);
            }
            catch(error) {
                console.error(error);
                return undefined;
            }
        },
        FindALL : async (token : string, obj : ApiKeyFindObject = {}) : Promise<Array<ApiKey>> => {
            let response :  {
                data : {
                    data : Array<ApiKeyObject>;
                }
            };
            try {
                response = await this.url.get(`/api/match`, {
                    params : {
                        recordsPerPage : 20,
                        pageCount : obj.pageCount ?? 1,
                        id : obj.id,
                        userId : obj.userId,
                        name : obj.name
                    },
                    headers : {
                        'x-user-token' : token
                    }
                });
                let keys : Array<ApiKey> = [];
                response.data.data.forEach((i : ApiKeyObject) => {
                    keys.push(new ApiKey(i));
                })
                return keys;
            }
            catch(error) {
                console.error(error);
                return [];
            }
        },
        Update : async (token : string, id : number, Data : ApiKeyCreateObject) : Promise<boolean> => {
            let response :  {
                data : {
                    success : boolean;
                }
            };
            try {
                response = await this.url.patch(`/api/api-key/${id}`, Data, {
                    headers : {
                        'x-user-token' : token
                    }
                });
                return response.data.success;
            }
            catch(error) {
                console.error(error);
                return false;
            }
        },
        Delete : async (token : string, id : number) : Promise<Boolean> => {
            let response : {
                data : {
                    success : boolean;
                }
            };
            try {
                response = await this.url.delete(`/api/api-key/${id}`, {
                    headers: {
                        'x-user-token' : token
                    }
                });
                return response.data.success;
            }
            catch(error) {
                console.error(error);
                return false;
            }
        }
    }
}

class Users {
    url : AxiosInstance;

    constructor(url : string) {
        this.url = axios.create({
            baseURL : url
        });
    }

    Find = {
        Name : async (name : string) : Promise<UserObject | undefined> => {
            let response : {
                data : {
                    user : UserObject;
                };
            };
            try {
                response = await this.url.get(`users/${encodeURIComponent(name)}.json`);
                return response.data.user;
            }
            catch(error) {
                console.error(error);
                return undefined;
            }
        },
        Id : async (id : number) : Promise<UserObject | undefined> => {
            let response : {
                data : {
                    user : UserObject;
                };
            };
            try {
                response = await this.url.get(`users/_id_${id}.json`);
                return response.data.user;
            }
            catch(error) {
                console.error(error);
                return undefined;
            }
        }
    }
    
}

const User = new Users('https://sapi.moecube.com:444/accounts')
const Tabulator = new TabulatorAPI('https://api-tabulator-dev.moecube.com');

export {
    Tabulator,
    User
};
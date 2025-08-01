import { ref, Ref } from 'vue';
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
    AllAPI,
    UserObject,
    TournamentGet
} from './type.ts'
import UniApp from './uniapp.ts';

let Loading = ref(false);

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
                Loading.value = true;
                response = await this.url.post(`/api/tournament`, TournamentData, {
                    headers: { 
                        'x-user-token' : token
                    }
                });
                return response.data.data.id;
            }
            catch(error) {
                UniApp.error(error.message, '创建失败');
                console.error(error);
                return -1;
            }
            finally {
                Loading.value = false;
            }
        },
        Delete : async (token : string, id : number) : Promise<Boolean> => {
            let response : {
                data : {
                    success : boolean;
                }
            };
            try {
                Loading.value = true;
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
            finally {
                Loading.value = false;
            }
        },
        Find : async (token : string, id : number) : Promise<TournamentGet> => {
            let response : {
                data : {
                    data : TournamentObject;
                }
            };
            try {
                Loading.value = true;
                response = await this.url.get(`/api/tournament/${id}`, {
                    headers: { 
                        'x-user-token' : token
                    }
                });
                const tournament = new Tournament(response.data.data);
                let participants : Array<Participant> = [];
                let matches : Array<Match> = [];
                response.data.data.participants.forEach((i : ParticipantObject) => {
                    participants.push(new Participant(i));
                });
                response.data.data.matches.forEach((i : MatchObject) => {
                    matches.push(new Match(i, participants));
                });
                participants.forEach(i => {
                    i.getScore(matches, tournament);
                });
                participants.forEach(i => {
                    i.getTieBreaker(participants, matches);
                });
                if (tournament.status != 'Ready') {
                    participants.sort((a, b) => {
                        return b.score.score - a.score.score
                    });
                }
                return {
                    tournament : tournament,
                    participant : {
                        participants : participants,
                        total : participants.length
                    },
                    match : {
                        matches : matches,
                        total : matches.length
                    }
                };
            }
            catch(error) {
                console.error(error);
                return {
                    tournament : undefined,
                    participant : {
                        participants : [],
                        total : 0
                    },
                    match : {
                        matches : [],
                        total : 0
                    }
                };
            }
            finally {
                Loading.value = false;
            }
        },
        FindALL : async (token : string, obj : TournamentFindObject = {}) : Promise<AllTournament> => {
            const filter = (i : any) : any => {
                const v = i ?? '';
                return (v != '' && v != ' ') ? i : undefined;
            }
            let response :  {
                data : {
                    total : number;
                    data : Array<TournamentObject>;
                }
            };
            try {
                Loading.value = true;
                response = await this.url.get(`/api/tournament`, {
                    params : {
                        recordsPerPage : 20,
                        pageCount : obj.pageCount ?? 1,
                        id : (obj.id ?? 0) > 0 ? obj.id : undefined,
                        managing : filter(obj.creator),
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
            finally {
                Loading.value = false;
            }
        },
        Update : async (token : string, id : number, Data : TournamentCreateObject) : Promise<boolean> => {
            let response :  {
                data : {
                    success : boolean;
                }
            };
            try {
                Loading.value = true;
                response = await this.url.patch(`/api/tournament/${id}`, Data, {
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
            finally {
                Loading.value = false;
            }
        },
        Start : async (token : string, id : number) : Promise<boolean> => {
            let response :  {
                data : {
                    success : boolean;
                }
            };
            try {
                Loading.value = true;
                response = await this.url.post(`/api/tournament/${id}/start`, {}, {
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
            finally {
                Loading.value = false;
            }
        },
        Reset : async (token : string, id : number) : Promise<boolean> => {
            let response :  {
                data : {
                    success : boolean;
                }
            };
            try {
                Loading.value = true;
                response = await this.url.post(`/api/tournament/${id}/reset`, {}, {
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
            finally {
                Loading.value = false;
            }
        },
        Finish : async (token : string, id : number) : Promise<boolean> => {
            let response :  {
                data : {
                    success : boolean;
                }
            };
            try {
                Loading.value = true;
                response = await this.url.post(`/api/tournament/${id}/finish`, {}, {
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
            finally {
                Loading.value = false;
            }
        },
        UpdateYdk : async (token : string, id : number, res : UniApp.ChooseFileSuccessCallbackResult) : Promise<Boolean> => {
            let response : {
                data : {
                    success : boolean
                }
            };
            try {
                Loading.value = true;
                let formData = new FormData();
                for (let i = 0; i < res.tempFilePaths.length; i++) {
                    let f = await fetch(res.tempFilePaths[i]);
                    let blob = await f.blob();
                    formData.append('files', blob, res.tempFiles[i].name.replace(/\.[^/.]+$/, ""));
                }
                response = await this.url.post(`/api/tournament/${id}/upload-ydk`,formData, {
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
            finally {
                Loading.value = false;
            }
        },
        Empty : async (token : string, id : number) : Promise<Boolean> => {
            let response : {
                data : {
                    success : boolean;
                }
            };
            try {
                Loading.value = true;
                response = await this.url.post(`/api/tournament/${id}/clear-participants`, {}, {
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
            finally {
                Loading.value = false;
            }
        },
        Shuffle : async (token : string, id : number) : Promise<Boolean> => {
            let response : {
                data : {
                    success : boolean;
                }
            };
            try {
                Loading.value = true;
                response = await this.url.post(`/api/tournament/${id}/shuffle-participants`, {}, {
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
            finally {
                Loading.value = false;
            }
        },
        Drag : async (token : string, id : number, from : number, to : number) : Promise<Boolean> => {
            let response : {
                data : {
                    success : boolean;
                }
            };
            try {
                Loading.value = true;
                response = await this.url.post(`/api/tournament/${id}/drag-participant`, {
                    draggingParticipantId : from,
                    placeAfterParticipantId : to
                }, {
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
            finally {
                Loading.value = false;
            }
        },
        Import : async (token : string, id : number, fromId : number, count : number) : Promise<boolean> => {
            let response :  {
                data : {
                    success : boolean;
                }
            };
            try {
                Loading.value = true;
                response = await this.url.post(`/api/tournament/${id}/import-participants-from`, {
                    tournamentId : fromId,
                    swissMaxPlayers : count
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
            finally {
                Loading.value = false;
            }
        }
    }
    Participant = {
        Create : async (token : string, Data : ParticipantCreateObject, Array : Array<Participant> = []) : Promise<boolean> => {
            let response :  {
                data : {
                    success : boolean;
                }
            };
            try {
                Loading.value = true;
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
            finally {
                Loading.value = false;
            }
        },
        CreateGroup : async (token : string, Data : Array<ParticipantCreateObject>) : Promise<boolean> => {
            let response :  {
                data : {
                    success : boolean;
                }
            };
            try {
                Loading.value = true;
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
            finally {
                Loading.value = false;
            }
        },
        Find : async (token : string, id : number) : Promise<Participant | undefined> => {
            let response :  {
                data : {
                    data : ParticipantObject;
                }
            };
            try {
                Loading.value = true;
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
            finally {
                Loading.value = false;
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
                Loading.value = true;
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
            finally {
                Loading.value = false;
            }
        },
        Update : async (token : string, id : number, Data : ParticipantUpdateObject) : Promise<boolean> => {
            let response :  {
                data : {
                    success : boolean;
                }
            };
            try {
                Loading.value = true;
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
            finally {
                Loading.value = false;
            }
        },
        Delete : async (token : string, id : number) : Promise<Boolean> => {
            let response : {
                data : {
                    success : boolean;
                }
            };
            try {
                Loading.value = true;
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
            finally {
                Loading.value = false;
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
                Loading.value = true;
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
            finally {
                Loading.value = false;
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
                Loading.value = true;
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
                    matches : matchs
                };
            }
            catch(error) {
                console.error(error);
                return {
                    total : 0,
                    matches : []
                };
            }
            finally {
                Loading.value = false;
            }
        },
        Update : async (token : string, id : number, Data : MatchUpdateObject) : Promise<boolean> => {
            let response :  {
                data : {
                    success : boolean;
                }
            };
            try {
                Loading.value = true;
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
            finally {
                Loading.value = false;
            }
        }
    }
    ApiKey = {
        Create : async (token : string, Data : ApiKeyCreateObject) : Promise<boolean> => {
            let response :  {
                data : {
                    success : boolean;
                }
            };
            try {
                Loading.value = true;
                response = await this.url.post(`/api/api-key`, {
                name : Data.name,
                description : Data.description?.length ?? 0 > 0 ? Data.description : undefined,
                expireAt : Data.expireAt?.toISOString() ?? undefined
            }, {
                    headers : {
                        'x-user-token' : token
                    }
                });
                return response.data.success;
            }
            catch(error) {
                UniApp.error(error.message, '创建失败');
                console.error(error);
                return false;
            }
            finally {
                Loading.value = false;
            }
        },
        Find : async (token : string, id : number) : Promise<ApiKey | undefined> => {
            let response :  {
                data : {
                    data : ApiKeyObject;
                }
            };
            try {
                Loading.value = true;
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
            finally {
                Loading.value = false;
            }
        },
        FindALL : async (token : string, obj : ApiKeyFindObject = {}) : Promise<AllAPI> => {
            let response :  {
                data : {
                    data : Array<ApiKeyObject>;
                    total : number;
                }
            };
            try {
                Loading.value = true;
                if (!obj.userId || obj.userId < 0)
                    throw new Error('未登录');
                response = await this.url.get(`/api/api-key`, {
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
                return {
                    total : response.data.total,
                    api : keys
                };
            }
            catch(error) {
                console.error(error);
                return {
                    total : 0,
                    api : []
                };
            }
            finally {
                Loading.value = false;
            }
        },
        Update : async (token : string, id : number, Data : ApiKeyCreateObject) : Promise<boolean> => {
            let response :  {
                data : {
                    success : boolean;
                }
            };
            try {
                Loading.value = true;
                response = await this.url.patch(`/api/api-key/${id}`, {
                name : Data.name,
                description : Data.description?.length ?? 0 > 0 ? Data.description : '',
                expireAt : Data.expireAt?.toISOString() ?? new Date(2038, 0, 1).toISOString()
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
            finally {
                Loading.value = false;
            }
        },
        Delete : async (token : string, id : number) : Promise<Boolean> => {
            let response : {
                data : {
                    success : boolean;
                }
            };
            try {
                Loading.value = true;
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
            finally {
                Loading.value = false;
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
    User,
    Loading
};
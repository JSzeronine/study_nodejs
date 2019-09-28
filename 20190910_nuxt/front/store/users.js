export const state = () => ({
    me : null,
    followerList : [],
    followingList : [],
    hasMoreFollowing : true,
    hasMoreFollower : true,
});

const totalFollowers = 8;
const totalFollowings = 6;
const limit = 3;

export const mutations = {
    setMe( state, payload ){
        console.log( "setMe ------------> ", payload );
        state.me = payload;
    },

    changeNickname( state, payload ){
        state.me.nickname = payload.nickname;
    },

    addFollower( state, payload ){
        state.followerList.push( payload );
    },

    removeFollower( state, payload ){
        const index = state.followerList.findIndex(( v ) => v.id === payload.id );
        state.followerList.splice( index, 1 );
    },

    addFollowing( state, payload ){
        state.followingList.push( payload );
    },

    removeFollowing( state, payload ){
        const index = state.me.Followings.findIndex(( v ) => v.id === payload.userid );
        state.me.Followings.splice( index, 1 );
    },

    loadFollowings( state, payload ){
        if( payload.offset === 0 ){
            state.followingList = payload.data;
        }else{
            state.followingList = state.followingList.concat( payload.data );
        }
        
        state.hasMoreFollowing = payload.data.length === limit;
    },

    loadFollowers( state, payload ){
        if( payload.offset === 0 ){
            state.followerList = payload.data;
        }else{
            state.followerList = state.followerList.concat( payload.data );
        }
        
        state.hasMoreFollower = payload.data.length === limit;
    },

    following( state, payload ){
        state.me.Followings.push({ id : payload.userId });
    },
};

export const actions = {

    async loadUser({ commit }){
        try{
            const result = await this.$axios.get( "/user", { withCredentials : true });
            commit( "setMe", result.data );

        }catch( error ){
            console.log( "유저 없음." );
            // console.error( error );
        }
    },

    signUp({ commit }, payload ){

        // 서버에 회원가입 요청을 보내는 부분
        this.$axios.post( '/user', {
            email : payload.email,
            nickname : payload.nickname,
            password : payload.password
        }, {
            withCredentials : true, // 다른 서버간에 쿠키 심어줄때
        }).then(( result ) => {
            // commit( "setMe", payload );
        }).catch(( err ) => {
            console.error( err );
        })
    },

    logIn( { commit }, payload ){
        return new Promise(( resolve, reject ) => {
            this.$axios.post( '/user/login', {
                email : payload.email,
                password : payload.password
            }, {
                withCredentials : true, // 다른 서버간에 쿠키 심어줄때
            }).then(( result ) => {
                commit( "setMe", result.data );
                resolve();
            }).catch(( err ) => {
                console.error( err );
            })
        })
    },

    logOut( { commit }, payload ){
        return new Promise(( resolve, reject ) => {
            this.$axios.post( '/user/logout', {

            }, { 
                withCredentials : true, // 다른 서버간에 쿠키 심어줄때 
            }).then(( result ) => {
    
                console.log( "로그아웃 --------", result );
                commit( "setMe", null );
                resolve();
    
            }).catch(( err ) => {
                console.error( err );
    
            })
        })

    },

    changeNickname({ commit }, payload )
    {
        this.$axios.patch( "/user/nickname", {
            nickname : payload.nickname
        }, {
            withCredentials : true
        }).then(( result ) => {
            commit( "changeNickname", payload );
        }).catch(( error ) => {
            console.error( error );
        });
    },

    addFollowing({ commit }, payload ){
        commit( "addFollowing", payload );
    },

    addFollower({ commit }, payload )
    {
        commit( "addFollower", payload );
    },

    removeFollowing({ commit }, payload )
    {
        commit( "removeFollowing", payload );
    },

    removeFollower({ commit }, payload )
    {
        commit( "removeFollower", payload );
    },

    loadFollowers({ commit, state }, payload ){
        if( !( payload && payload.offset === 0 ) && !state.hasMoreFollower ){
            return;
        }

        let offset = state.followerList.length;
        if( payload && payload.offset === 0 ){
            offset = 0;
        }

        return this.$axios.get( `/user/${ state.me.id }/followers?limit=3&offset=${ offset }`, {
            withCredentials : true
        }).then(( result ) => {
                commit( "loadFollowers", {
                    data : result.data,
                    offset,
                });
            }).catch(( error ) => {
                console.error( error );
            });
    },

    loadFollowings({ commit, state }, payload ){
        if( !( payload && payload.offset === 0 ) && !state.hasMoreFollowing ){
            return;
        }

        let offset = state.followingList.length;
        if( payload && payload.offset === 0 ){
            offset = 0;
        }

        return this.$axios.get( `/user/${ state.me.id }/followings?limit=3&offset=${ offset }`, {
            withCredentials : true
        }).then(( result ) => {
                commit( "loadFollowings", {
                    data : result.data,
                    offset,
                });
            }).catch(( error ) => {
                console.error( error );
            });
    },

    follow({ commit, state }, payload ){
        this.$axios.post( `/user/${ payload.userId }/follow`, {

        }, {
            withCredentials : true
        }).then(( result ) => {
            commit( "following", {
                userId : payload.userId
            });
        }).catch(( error ) => {
            console.error( error );
        })
    },

    unfollow({ commit, state }, payload ){
        // delete 는 두번째 데이터가 없다.( 넣으면 동작하지 않는다. )
        this.$axios.delete( `/user/${ payload.userId }/follow`, {
            withCredentials : true
        }).then(( result ) => {
            commit( "removeFollowing", {
                userId : payload.userId
            })
        }).catch(( error ) => {
            console.error( error );
        })
    }
};




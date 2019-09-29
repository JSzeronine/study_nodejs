export const state = () => ({
    me : null,
    followerList : [],
    followingList : [],
    hasMoreFollowing : true,
    hasMoreFollower : true,
    other : null, // 남에 정보
});

const limit = 3;
export const mutations = {
    setMe( state, payload ){
        console.log( "setMe ------------> ", payload );
        state.me = payload;
    },

    setOther( state, payload ){
        state.other = payload;
    },

    changeNickname( state, payload ){
        state.me.nickname = payload.nickname;
    },

    addFollower( state, payload ){
        state.followerList.push( payload );
    },

    addFollowing( state, payload ){
        state.followingList.push( payload );
    },

    removeFollower( state, payload ){
        let index = state.me.Followers.findIndex(( v ) => v.id === payload.id );
        state.me.Followers.splice( index, 1 );
        index = state.followerList.findIndex( v => v.id === payload.userId );
        state.followerList.splice( index, 1)
    },

    removeFollowing( state, payload ){
        let index = state.me.Followings.findIndex(( v ) => v.id === payload.userid );
        state.me.Followings.splice( index, 1 );
        index = state.followingList.findIndex( v => v.id === payload.userId );
        state.followingList.splice( index, 1)
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
            console.error( error );
        }
    },

    async loadOther({ commit }, payload ){
        try{
            const result = await this.$axios.get( `/user/${ payload.userId }`, { withCredentials : true });
            commit( "setOther", result.data );

        }catch( error ){
            console.log( "유저 없음." );
            console.error( error );
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
        return this.$axios.post( `/user/${ payload.userId }/follow`, {

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
        return this.$axios.delete( `/user/${ payload.userId }/follow`, {
            withCredentials : true
        }).then(( result ) => {
            commit( "removeFollowing", {
                userId : payload.userId
            })
        }).catch(( error ) => {
            console.error( error );
        });
    },

    removeFollower({ commit, state }, payload ){
        return this.$axios.delete( `/user/${ payload.userId }/follower`, {
            withCredentials : true
        }).then(( result ) => {
            commit( "removeFollower", {
                userId : payload.userId
            });
        }).catch(( error ) => {
            console.error( error );
        })
    },


};




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
        const index = state.followingList.findIndex(( v ) => v.id === payload.id );
        state.followingList.splice( index, 1 );
    },

    loadFollowings( state ){
        const diff = totalFollowings - state.followingList.length;
        const fakeUsers = Array( diff > limit ? limit : diff ).fill().map( v => ({
            id : Math.random().toString(),
            nickname : Math.floor( Math.random() * 1000 ),
        }));

        state.followingList = state.followingList.concat( fakeUsers );
        state.hasMoreFollowing = fakeUsers.length === limit;
    },

    loadFollowers( state ){
        const diff = totalFollowers - state.followerList.length;
        const fakeUsers = Array( diff > limit ? limit : diff ).fill().map( v => ({
            id : Math.random().toString(),
            nickname : Math.floor( Math.random() * 1000 ),
        }));

        state.followerList = state.followerList.concat( fakeUsers );
        state.hasMoreFollower = fakeUsers.length === limit;
    }
};

export const actions = {
    signUp({ commit }, payload ){

        // 서버에 회원가입 요청을 보내는 부분
        this.$axios.post( 'http://localhost:3085/user', {
            email : payload.email,
            nickname : payload.nickname,
            password : payload.password
        }, {
            withCredentials : true, // 다른 서버간에 쿠키 심어줄때
        }).then(( result ) => {
            console.log( "회원가입 ------> ", result );
            commit( "setMe", payload );
        }).catch(( err ) => {
            console.error( err );
        })
    },

    logIn( { commit }, payload ){
        this.$axios.post( 'http://localhost:3085/user/login', {
            email : payload.email,
            password : payload.password
        }, {
            withCredentials : true, // 다른 서버간에 쿠키 심어줄때
        }).then(( result ) => {
            console.log( "로그인 ------->", result );
            commit( "setMe", result.data );
        }).catch(( err ) => {
            console.error( err );
        })
    },

    logOut( { commit }, payload ){

        return new Promise(( resolve, reject ) => {
            this.$axios.post( 'http://localhost:3085/user/logout', {

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
        commit( "changeNickname", payload );
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
        if( state.hasMoreFollower ){
            commit( "loadFollowers" );
        }
    },

    loadFollowings({ commit, state }, payload ){
        if( state.hasMoreFollowing ){
            commit( "loadFollowings" )
        }
    }
};




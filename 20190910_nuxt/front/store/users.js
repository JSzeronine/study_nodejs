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
    setMe( state, payLoad ){
        state.me = payLoad;
    },

    changeNickname( state, payLoad ){
        state.me.nickname = payLoad.nickname;
    },

    addFollower( state, payLoad ){
        state.followerList.push( payLoad );
    },

    removeFollower( state, payLoad ){
        const index = state.followerList.findIndex(( v ) => v.id === payLoad.id );
        state.followerList.splice( index, 1 );
    },

    addFollowing( state, payLoad ){
        state.followingList.push( payLoad );
    },

    removeFollowing( state, payLoad ){
        const index = state.followingList.findIndex(( v ) => v.id === payLoad.id );
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

    async loadUser({ commit }){
        try{
            const result = await this.$axios.get( "/user", { withCredentials : true });
            commit( "setMe", result.data );

        }catch( error ){
            console.log( "유저 없음." );
            // console.error( error );
        }
    },

    // loadUser({ commit }){
    //     this.$axios.get( "/user", {
    //         withCredentials : true
    //     }).then(( result ) => {
    //         console.log( "자동 로그인 -------> ", result.data );
    //         commit( 'setMe', result.data );
    //     }).catch(() => {

    //     });
    // },

    signUp({ commit }, payLoad ){

        // 서버에 회원가입 요청을 보내는 부분
        this.$axios.post( '/user', {
            email : payLoad.email,
            nickname : payLoad.nickname,
            password : payLoad.password
        }, {
            withCredentials : true, // 다른 서버간에 쿠키 심어줄때
        }).then(( result ) => {
            console.log( "회원가입 ------> ", result );
            commit( "setMe", payLoad );
        }).catch(( err ) => {
            console.error( err );
        })
    },

    logIn( { commit }, payLoad ){
        this.$axios.post( '/user/login', {
            email : payLoad.email,
            password : payLoad.password
        }, {
            withCredentials : true, // 다른 서버간에 쿠키 심어줄때
        }).then(( result ) => {
            console.log( "로그인 ------->", result );
            commit( "setMe", result.data );
        }).catch(( err ) => {
            console.error( err );
        })
    },

    logOut( { commit }, payLoad ){

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

    changeNickname({ commit }, payLoad )
    {
        commit( "changeNickname", payLoad );
    },

    addFollowing({ commit }, payLoad ){
        commit( "addFollowing", payLoad );
    },

    addFollower({ commit }, payLoad )
    {
        commit( "addFollower", payLoad );
    },

    removeFollowing({ commit }, payLoad )
    {
        commit( "removeFollowing", payLoad );
    },

    removeFollower({ commit }, payLoad )
    {
        commit( "removeFollower", payLoad );
    },

    loadFollowers({ commit, state }, payLoad ){
        if( state.hasMoreFollower ){
            commit( "loadFollowers" );
        }
    },

    loadFollowings({ commit, state }, payLoad ){
        if( state.hasMoreFollowing ){
            commit( "loadFollowings" )
        }
    }
};




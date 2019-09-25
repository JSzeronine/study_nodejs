
export const state = () => ({
    mainPosts : [],
    hasMorePost : true,
    imagePaths : [],
});

const totalPosts = 101;
const limit = 10;

export const mutations = {
    addMainPost( state, payload ){
        state.mainPosts.unshift( payload );
        state.imagePaths.length = 0;
    },

    removeMainPost( state, payload ){
        const index = state.mainPosts.findIndex(( v ) => v.id === payload.postId );
        state.mainPosts.splice( index, 1 );
    },

    addComment( state, payload ){
        const index = state.mainPosts.findIndex( v => v.id === payload.postId );
        state.mainPosts[ index ].Comments.unshift( payload );
    },

    loadComments( state, payload ){
        const index = state.mainPosts.findIndex( v => v.id === payload.postId );
        state.mainPosts[ index ].Comments.unshift( payload );
    },

    loadPosts( state, payload ){
        state.mainPosts = state.mainPosts.concat( payload );
        state.hasMorePost = payload.length === limit;
    },

    concatImagePaths( state, payload ){
        state.imagePaths = state.imagePaths.concat( payload );
    },

    removeImagePath( state, payload ){
        state.imagePaths.splice( payload, 1 );
    },

    unlikePost( state, payload ){
        const index = state.mainPosts.findIndex( v => v.id === payload.postId );
        const userIndex = state.mainPosts[ index ].Likers.findIndex( v => v.id === payload.userId );
        state.mainPosts[ index ].Likers.splice( userIndex, 1 );
    },

    likePost( state, payload ){
        const index = state.mainPosts.findIndex( v => v.id === payload.postId );
        state.mainPosts[ index ].Likers.push({
            id : payload.userId
        });
    },
};

export const actions = {
    add({ commit, state }, payload ){
        // 서버에 게시글 등록 요청 보냄

        this.$axios.post( '/post', {
            content : payload.content,
            image : state.imagePaths
        }, {
            withCredentials : true,
        }).then(( result ) => {
            commit( 'addMainPost', result.data );
        }).catch(( error ) => {
            console.error( error );
        });
    },

    remove({ commit }, payload ){
        this.$axios.delete( `/post/${ payload.postId }`, {
            withCredentials : true,
        }).then(() => {
            commit( "removeMainPost", payload );
        }).catch(() => {

        });
    },

    addComment({ commit }, payload ){
        this.$axios.post( `/post/${payload.postId}/comment`, {
            content : payload.content,
        }, {
            withCredentials : true
        }).then(( result ) => {
            commit( "addComment", result.data );
        }).catch(( error ) => {

        });

        
    },

    loadComments({ commit }, payload ){
        this.$axios.get( `/post/${ payload.postId }/comments` )
            .then(( result ) => {
                commit( "loadComments", {
                    postId : payload.postId,
                    data : result.data 
                });
            }).catch(() => {
            
            })
    },

    loadPosts({ commit, state }, payload ){
        if( state.hasMorePost ){
            this.$axios.get( `/posts?offset=${state.mainPosts.length}&limit=10` )
                .then(( result ) => {
                    commit( "loadPosts", result.data );
                }).catch(( error ) => {
                    console.log( "포스트 가져오기 에러" );
                    console.error( error );
                });
        }
    },

    uploadImages({ commit, state }, payload ){
        this.$axios.post( '/post/images', payload, {
            withCredentials : true,
        }).then(( result ) => {
            console.log( "Image Upload -> ", result );
            commit( "concatImagePaths", result.data );
        }).catch(( err ) => {

        });
    },

    retweet({ commit }, payload ){
        this.$axios.post( `/post/${ payload.postId }/retweet`, {}, {
            withCredentials : true,
        }).then(( result ) => {
            commit( "addMainPost", result.data );
        }).catch(( error ) => {
            console.error( error );
            alert( error.response.data );
        })
    },

    likePost({ commit }, payload ){
        this.$axios.post( `/post/${ payload.postId }/like`, {}, {
            withCredentials : true,
        }).then(( result ) => {
            commit( "likePost", {
                userId : result.data.userId,
                postId : payload.postId
            });
        }).catch(( error ) => {
            console.error( error );
        })
    },

    unlikePost({ commit }, payload ){
        this.$axios.delete( `/post/${ payload.postId }/unlike`, {
            withCredentials : true,
        }).then(( result ) => {
            commit( "unlikePost", {
                userId : result.data.userId,
                postId : payload.postId
            });
        }).catch(( error ) => {
            console.error( error );
        });
    },
}

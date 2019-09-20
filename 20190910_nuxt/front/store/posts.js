export const state = () => ({
    mainPosts : [],
    hasMorePost : true,
    imagePaths : [],
});

const totalPosts = 101;
const limit = 10;

export const mutations = {
    addMainPost( state, payLoad ){
        state.mainPosts.unshift( payLoad );
        state.imagePaths.length = 0;
    },

    removeMainPost( state, payLoad ){
        const index = state.mainPosts.findIndex(( v ) => v.id === payLoad.postId );
        state.mainPosts.splice( index, 1 );
    },

    addComment( state, payLoad ){
        const index = state.mainPosts.findIndex( v => v.id === payLoad.postId );
        state.mainPosts[ index ].Comments.unshift( payLoad );
    },

    loadComments( state, payLoad ){
        const index = state.mainPosts.findIndex( v => v.id === payLoad.postId );
        state.mainPosts[ index ].Comments = payLoad;
    },

    loadPosts( state, payLoad ){
        state.mainPosts = state.mainPosts.concat( payLoad );
        state.hasMorePost = payLoad.length === limit;
    },

    concatImagePaths( state, payLoad ){
        state.imagePaths = state.imagePaths.concat( payLoad );
    },

    removeImagePath( state, payLoad ){
        // payLoad -> index 값 보내자
        console.log( payLoad );
        state.imagePaths.splice( payLoad, 1 );
    }
};

export const actions = {
    add({ commit, state }, payLoad ){
        // 서버에 게시글 등록 요청 보냄
        this.$axios.post( '/post', {
            content : payLoad.content,
            imagePaths : state.imagePaths
        }, {
            withCredentials : true,
        }).then(( result ) => {
            commit( 'addMainPost', result.data );
        }).catch(( error ) => {
            console.error( error );
        });
    },

    remove({ commit }, payLoad ){
        this.$axios.delete( `/post/${ payLoad.postId }`, {
            withCredentials : true,
        }).then(() => {
            commit( "removeMainPost", payLoad );
        }).catch(() => {

        });
    },

    addComments({ commit }, payLoad ){
        this.$axios.post( `/post/${payLoad.postId}/comment`, {
            content : payLoad.content,
        }).then(( result ) => {
            commit( "addComment", result.data );
        }).catch(() => {

        });
    },

    loadComments({ commit }, payLoad ){
        this.$axios.get( `/post/${ payLoad.postId }/comments`, {

        }).then(( result ) => {
            commit( "loadComments", result.data );
        }).catch(() => {
            
        })
    },

    loadPosts({ commit, state }, payLoad ){
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

    uploadImages({ commit, state }, payLoad ){
        this.$axios.post( '/post/images', payLoad, {
            withCredentials : true,
        }).then(( result ) => {
            console.log( "Image Upload -> ", result );
            commit( "concatImagePaths", result.data );
        }).catch(( err ) => {

        });
    }
}

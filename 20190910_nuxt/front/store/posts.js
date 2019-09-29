import Vue from 'vue';
import throttle from 'lodash.throttle';

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

    loadComments( state, payload ){
        const index = state.mainPosts.findIndex( v => v.id === payload.postId );
        Vue.set(state.mainPosts[index], 'Comments', payload.data);
    },

    addComment( state, payload ){
        const index = state.mainPosts.findIndex( v => v.id === payload.PostId );

        console.log( index, state.mainPosts[ index ].Comments );

        state.mainPosts[ index ].Comments.unshift( payload );
    },

    loadPosts( state, payload ){
        if( payload.reset ){
            state.mainPosts = payload.data;
        }else{
            state.mainPosts = state.mainPosts.concat( payload.data );
        }

        state.hasMorePost = payload.data.length === limit;
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
        }).catch(( error ) => {
            console.error( error );
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
            console.error( error );
        });
    },

    loadComments({ commit }, payload ){
        this.$axios.get( `/post/${ payload.postId }/comments` )
            .then(( result ) => {
                commit( "loadComments", {
                    postId : payload.postId,
                    data : result.data 
                });
            }).catch(( error ) => {
                console.error( error );
            })
    },

    loadPosts : throttle( async function({ commit, state }, payload ){
        try{

            if( payload && payload.reset ){
                const result = await this.$axios.get( `/posts?limit=10` );
                commit( "loadPosts", {
                    data : result.data,
                    reset : true,
                });

                return;
            }

            if( state.hasMorePost ){
                const lastPost = state.mainPosts[ state.mainPosts.length - 1 ];
                const result = await this.$axios.get( `/posts?lastId=${ lastPost && lastPost.id }&limit=10` );
                commit( "loadPosts", {
                    data : result.data
                });

                return;
            }

        }catch( error ){
            console.error( error );
        }
    }, 1000 ),

    loadUserPosts : throttle( async function({ commit, state }, payload ){
        try{
            if( payload && payload.reset ){
                const result = await this.$axios.get( `/user/${ payload.userId }/posts?limit=10` );
                commit( "loadPosts", {
                    data : result.data,
                    reset : true,
                });

                return;
            }

            if( state.hasMorePost ){
                const lastPost = state.mainPosts[ state.mainPosts.length - 1 ];
                const result = await this.$axios.get( `/user/${ payload.userId }/posts?lastId=${ lastPost && lastPost.id }&limit=10` );
                commit( "loadPosts", {
                    data : result.data,
                });

                return;
            }
        }catch( error ){
            console.error( error );
        }
    }, 1000 ),

    loadHashtagPosts : throttle( async function({ commit, state }, payload ){
        try{
            if( payload && payload.reset ){
                const result = await this.$axios.get( `/hashtag/${ payload.hashtag }?limit=10` );
                commit( "loadPosts", {
                    data : result.data,
                    reset : true,
                });

                return;
            }

            if( state.hasMorePost ){
                const lastPost = state.mainPosts[ state.mainPosts.length - 1 ];
                const result = await this.$axios.get( `/hashtag/${ payload.hashtag }?lastId=${ lastPost && lastPost.id }&limit=10` );
                commit( "loadPosts", {
                    data : result.data,
                });

                return;
            }
        }catch( error ){
            console.error( error );
        }
    }, 1000 ),

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

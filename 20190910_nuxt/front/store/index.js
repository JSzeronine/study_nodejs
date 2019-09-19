

export const state = () => {

}

export const mutations = {

}

export const actions = {
    nuxtServerInit({ commit, dispatch, state }, { req }){
        console.log( 'dispatch( "users/loadUser" );' );
        return dispatch( "users/loadUser" );
    }
}
<template>

    <div>
        <v-container>
            <v-card :style="{ marginBottom : '20px'}" >
                <v-container>
                    <v-subheader>내 프로필</v-subheader>
                    <v-form v-model="valid" @submit.prevent="onChangeNickname">
                        <v-text-field
                            label="닉네임"
                            v-model="nickname"
                            :rules="nicknameRules"
                            required
                        ></v-text-field>
                        <v-btn color="blue" type="submit">수정</v-btn>
                    </v-form>
                </v-container>
            </v-card>

            <v-card :style="{ marginBottom : '20px'}">
                <v-container>
                    <v-subheader>팔로잉</v-subheader>
                    <FollowList :users="followinglist" :remove="removeFollowing" />
                    <v-btn @click="loadMoreFollowings" v-if="hasMoreFollowing" dark color="blue" style="width:100%;">더보기</v-btn>
                </v-container>
            </v-card>

            <v-card :style="{ marginBottom : '20px'}">
                <v-container>
                    <v-subheader>팔로워</v-subheader>
                    <FollowList :users="followerList" :remove="removeFollower" />
                    <v-btn @click="loadMoreFollwers" v-if="hasMoreFollower" dark color="blue" style="width:100%;">더보기</v-btn>
                </v-container>
            </v-card>
        </v-container>
    </div>
</template>

<script>

import FollowList from '~/components/FollowList';
export default {
    
    components : {
        FollowList
    },

    data() {
        return {
            valid : false,
            nickname : "",
            nicknameRules : [
                v => !!v || "닉네임을 입력하세요."
            ]
        }
    },

    computed : {
        followinglist(){
            return this.$store.state.users.followingList
        },

        followerList(){
            return this.$store.state.users.followerList
        },

        hasMoreFollowing(){
            return this.$store.state.users.hasMoreFollowing
        },

        hasMoreFollower(){
            return this.$store.state.users.hasMoreFollower
        }
    },

    mounted() {
        console.log( this.$store.state.users.followerList );
    },

    methods: {
        onChangeNickname()
        {
            this.$store.dispatch( "users/changeNickname", {
                nickname : this.nickname
            })
        },

        removeFollower( id )
        {
            this.$store.dispatch( "users/removeFollower", { id });
        },

        removeFollowing( id )
        {
            this.$store.dispatch( "users/removeFollowing", { id });
            
        },

        loadMoreFollowings()
        {
            this.$store.dispatch( "users/loadFollowings" );
        },

        loadMoreFollwers()
        {
            this.$store.dispatch( "users/loadFollowers" );
        }
    },

    middleware : "authenticated",

    fetch({ store }){
        store.dispatch( "users/loadFollowers" );
        return store.dispatch( "users/loadFollowings" );
    }
}

</script>

<style>

</style>
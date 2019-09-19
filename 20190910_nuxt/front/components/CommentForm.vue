<template>
    <v-form ref="form" v-model="valid" style="position:relative" @submit.prevent="onSubmitForm">
        <v-textarea
            v-model="content"
            filled
            auto-glow
            label="댓글 달기"
            :hide-details="hideDetails"
            :success="success"
            :success-message="successMessage"
            @input="onChangeTextarea"
        />

        <v-btn color="green" dark absolute top right type="submit">삐약</v-btn>
    </v-form>
</template>


<script>
export default {
    props : {
        postId : {
            type : Number,
            required : true,
        }
    },

    data() {
        return {
            valid : false,
            content : '',
            success : false,
            successMessage : '',
            hideDetails : true
        }
    },

    computed : {
        me(){
            return this.$store.state.users.me;
        },
    },

    methods: {
        onChangeTextarea( $value ){
            if( $value.length ){
                this.hideDetails = true;
                this.success = false;
                this.successMessage = '';
            }
        },

        onSubmitForm(){
            if( this.$refs ){
                this.$store.dispatch( "posts/addComments", {
                    postId : this.postId,
                    content : this.content,
                }).then( () => {
                    this.content = "";
                    this.success = true;
                    this.successMessage = "댓글이 작성되었습니다.";
                    this.hideDetails = false;

                }).catch(( error ) => {

                })
            }
        }
    },
}
</script>

<style>

</style>


<template>
    <v-card style="margin-bottom: 20px">
        <v-container>
            <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
                <v-textarea
                    v-model="content"
                    outlined
                    auto-grow
                    clearable
                    label="어떤 신기한 일이 있었나요?"
                    :rules="[ v => !!v.trim() || '내용을 입력하세요.']"
                    :hide-details="hideDetails"
                    :success-message="successMessage"
                    :success="success"
                    @input="onChangeTextarea"
                />

                <v-btn type="submit" color="green" absolute right>짹짹</v-btn>
                <v-btn>이미지 업로드</v-btn>
            </v-form>   
        </v-container>
    </v-card>
</template>

<script>
import { map, mapState } from "vuex";
export default {
    data() {
        return {
            hideDetails : false,
            successMessage : "",
            success : false,
            valid : false,
            content : "",
        }
    },

    computed: {
        ...mapState( "users", [ "me" ])
    },

    methods: {
        onChangeTextarea( $value ){
            if( $value.length ){
                this.hideDetails = true;
                this.success = false;
                this.successMessage = "";
            }
        },

        onSubmitForm(){
            if( this.$refs.form.validate()){

                this.$store.dispatch( "posts/add", {
                    content : this.content,
                    User : {
                        nickname : this.me.nickname,
                    },

                    Comments : [],
                    Images : [],
                    id : Date.now(),
                    createdAt : Date.now(),
                }).then(() => {
                    this.content = '';
                    this.hideDetails = false;
                    this.success = true;
                    this.successMessage = "게시글 등록 성공!";
                }).catch(( error ) =>{

                });
            }
        }
    },
}
</script>

<style>

</style>
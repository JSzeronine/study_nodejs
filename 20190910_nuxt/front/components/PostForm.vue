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
                <input ref="imageInput" type="file" multiple hidden @change="onChangeImages">

                <!-- form안에 있는 버튼은 submit이 아닌 이상 type="button"를 넣어준다. -->
                <v-btn @click="onClickImageUpload" type="button">이미지 업로드</v-btn>
                <div>
                    <div v-for="( p, i ) in imagePaths" :key="p" style="display:inline-block">
                        <img :src="`http://localhost:3085/${ p }`" :alt="p" style="width:200px" >
                        <div>
                            <button @click="onRemoveImage( i )" type="button">제거</button>
                        </div>
                    </div>
                </div>
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
        ...mapState( "users", [ "me" ]),
        ...mapState( 'posts', [ 'imagePaths'])
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
                }).then(() => {
                    this.content = '';
                    this.hideDetails = false;
                    this.success = true;
                    this.successMessage = "게시글 등록 성공!";
                }).catch(( error ) =>{

                });
            }
        },

        onClickImageUpload()
        {
            this.$refs.imageInput.click();
        },

        onChangeImages( $e ){
            const imageFormData = new FormData();
            [].forEach.call( $e.target.files, ( f ) => {
                imageFormData.append( 'image', f );
            });

            this.$store.dispatch( 'posts/uploadImages', imageFormData );
        },

        onRemoveImage( $index ){
            this.$store.commit( "posts/removeImagePath", $index );
        }
    },
}
</script>

<style>

</style>
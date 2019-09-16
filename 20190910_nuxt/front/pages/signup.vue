<template>
    <div>
        <v-container>
            <v-card>
                <v-subheader>회원가입</v-subheader>
                    <v-container>
                    <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
                        <v-text-field :rules="emailRules" v-model="email" label="이메일" type="email" required></v-text-field>
                        <v-text-field :rules="passwordRules" v-model="password" label="비밀번호" type="password" required></v-text-field>
                        <v-text-field :rules="passwordCheckRules" v-model="passwordCheck" label="비밀번호확인" type="password" required></v-text-field>
                        <v-text-field :rules="nicknameRules" v-model="nickname" label="닉네임" type="nickname" required></v-text-field>
                        <v-checkbox :rules="[ v => !!v || '약관에 동의해야 합니다.']" v-model="terms" required label="제로초 말을 잘 들을 것을 약속합니다."/>
                        <v-btn color="green" type="submit" :disabled="!valid">가입하기</v-btn>
                    </v-form>
                </v-container>
            </v-card>
        </v-container>
    </div>
</template>

<script>
export default {
    data(){
        return{
            valid : false,
            email : '',
            password : '',
            passwordCheck : '',
            nickname : '',
            terms : false,
            emailRules : [
                v => !!v || '이메일은 필수 입니다.',
                v => /.+@.+/.test( v ) || '이메일이 유효하지 않습니다.'
            ],

            nicknameRules : [
                v => !!v || '닉네임은 필수입니다.',
            ],

            passwordRules : [
                v => !!v || '비밀번호는 필수입니다.',
            ],

            passwordCheckRules : [
                v => !!v || '이메일은 필수 입니다.',
                v => v === this.password || "비밀번호가 일치하지 않습니다."
            ]
        }
    },

    computed: {
        me(){
            return this.$store.state.users.me;
        }
    },

    watch: {
        me( value ){
            if( value ){
                this.$router.push({
                    path : "/",
                });
            }
        }
    },

    methods: {
        onSubmitForm()
        {
            if( this.$refs.form.validate()){
                this.$store.dispatch( "users/signUp", {
                    nickname : this.nickname,
                    email : this.email,
                    password : this.password,
                })
                .then(() => {
                    this.$router.push({
                        path : "/"
                    });
                }).catch(( error ) => {
                    alert( "회원가입 실패" );
                })
            }
        }
    },

    middleware : "anonymous"
}
</script>
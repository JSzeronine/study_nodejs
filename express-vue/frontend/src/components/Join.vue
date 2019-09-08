
<template>
    <div>
        <div class="input-group">
            <label for="join-email">
                이메일
            </label>
            <input v-model="email" id="#join-email" type="email" name="email">
        </div>

        <div class="input-group">
            <label for="join-nick">닉네임</label>
            <input v-model="nick" id="join-nick" type="text" name="nick">
        </div>

        <div class="input-group">
            <label for="join-password">비밀번호</label>
            <input v-model="password" id="join-password" type="password" name="password">
        </div>

        <a href="javascript:;" @click="showJoin">
            회원가입
        </a>
    </div>
</template>

<script>
export default {
    data() {
        return {
            email : '',
            nick : '',
            password : ''
        }
    },
    created() {

    },

    methods: {
        showJoin()
        {
            this.$http.post( '/api/join', {
                params : {
                    email : this.email,
                    nick : this.nick,
                    password : this.password,
                }
            }).then(( result ) => {

                    if( result.data.success ){
                        this.$router.push( "/" );
                    }

               });
        }
    },
}
</script>

<style lang="scss" scoped>

</style>
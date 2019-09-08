<template>
  <div class="index">
    <div>
      <label for="">이메일</label>
      <input v-model="email" type="email">
    </div>

    <div>
      <label for="">비밀번호</label>
      <input v-model="password" type="password">
    </div>

    <div>
      <a @click="showLogin" href="javascript:;">
        로그인
      </a>
    </div>
    
  </div>
</template>

<script>
export default {
  data () {
    return {
      email : "",
      password : ""
    }
  },

  created () {

  },

  methods: {
    showLogin()
    {
      this.$http.post( '/api/login', {
        params : {
          email : this.email,
          password : this.password
        }
      }).then(( result ) => {
        console.log( result );
      })
    }
  },
}

</script>

<style lang="scss" scoped>
</style>
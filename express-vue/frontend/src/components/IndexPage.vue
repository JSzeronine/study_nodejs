<template>
  <div class="index">
    <router-link to="/login">로그인하기</router-link>
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

    this.$http.get( "/api" )
      .then(( result ) => {
        console.log( "IndexPage : ", result );
      })

  },
}

</script>

<style lang="scss" scoped>
</style>
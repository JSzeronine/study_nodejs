<template>
  <div>
    <h1>상세 내용</h1>
    <div>
        <img :src="movie.poster" alt="">
        <p>{{ movie.id }}</p>
        <p>{{ movie.name }}</p>
        <p>{{ movie.year }}</p>
        <p>{{ movie.director }}</p>
    </div>
  </div>
</template>

<script>
export default {
  created: function () {
    var id = this.$route.params.id
    this.$http.get(`/api/movies/${id}`)
    .then((response) => {
      this.movie = response.data[ 0 ];

      console.log( this.movie );
    })
  },
  data: function () {
    return {
      movie: {}
    }
  }
}
</script>
<template>
    <v-container>
        <div>
            <PostCard v-for="p in mainPosts" :key="p.id" :post="p" />
        </div>
    </v-container>
</template>

<script>
import PostCard from '~/components/PostCard';

export default {

    data() {
        return {
            
        }
    },

    components : {
        PostCard,
    },

    computed: {
        other(){
            return this.$store.state.users.other;
        },

        mainPosts(){
            return this.$store.state.posts.mainPosts;
        },
    },

    fetch({ store, params }){
        return store.dispatch( "posts/loadHashtagPosts", {
            hashtag : encodeURIComponent( params.id ),
            reset : true,
        });
    },

    mounted() {
        window.addEventListener( "scroll", this.onScroll );
        this.onScroll( null );
    },

    beforeDestroy() {
        window.removeEventListener( "scroll", this.onScroll );            
    },

    methods: {
        onScroll(){
            if( window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300 ){
                if( this.hasMorePost ){
                    this.$store.dispatch( "posts/loadPosts" );
                }
            }
        }
    }
}
</script>
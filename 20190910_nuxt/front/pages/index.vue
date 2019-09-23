<template>
    <v-container>
        <PostForm v-if="me" />
        <div>
            <PostCard v-for="p in mainPosts" :key="p.id" :post="p" />
        </div>
    </v-container>
</template>

<script>
import PostCard from '~/components/PostCard';
import PostForm from '~/components/PostForm';

export default {

    data() {
        return {
            
        }
    },

    components : {
        PostCard,
        PostForm
    },

    computed: {
        me(){
            return this.$store.state.users.me;
        },

        mainPosts(){
            return this.$store.state.posts.mainPosts;
        },

        hasMorePost(){
            return this.$store.state.posts.hasMorePost;
        }
    },

    fetch({ store }){
        return store.dispatch( "posts/loadPosts", { reset: true });
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
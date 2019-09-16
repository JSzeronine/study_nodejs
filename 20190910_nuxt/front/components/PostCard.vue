<template>
    <div>
        <v-card :style="{ marginBottom:'20px' }">
            <v-card-title>
                <h3>
                    <nuxt-link :to="'/user/' + post.id">{{ post.User.nickname }}</nuxt-link>
                </h3>   
            </v-card-title>
            <v-card-text>
                <div>
                    <div>{{ post.content }}</div>
                </div>
            </v-card-text>

            <v-card-actions>
                <v-btn text color="orange">
                    <v-icon>mdi-twitter-retweet</v-icon>
                </v-btn>
                <v-btn text color="orange">
                    <v-icon>mdi-heart-outline</v-icon>
                </v-btn>
                <v-btn text color="orange" @click="onToggleComment">
                    <v-icon>mdi-comment-outline</v-icon>
                </v-btn>
                <v-menu offset-y open-on-hover>
                    <template v-slot:activator="{ on }">
                        <v-btn text color=orange v-on="on">
                            <v-icon>mdi-dots-horizontal</v-icon>
                        </v-btn>
                    </template>

                    <div style="background:white">
                        <v-btn dark color="red" @click="onRemovePost">삭제</v-btn>
                        <v-btn text color="orange" @click="onEditPost">수정</v-btn>
                    </div>
                </v-menu>
            </v-card-actions>
        </v-card>

        <template v-if="commentOpend">
            <CommentForm :post-id="post.id" />
            <v-list>
                <v-list-item v-for="c in post.Comments" :key="c.id">
                    <v-list-item-avatar color="teal">
                        <span>{{ c.User.nickname[ 0 ]}}</span>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>{{ c.User.nickname }}</v-list-item-title>
                        <v-list-item-subtitle>{{ c.content }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </template>
    </div>
</template>

<script>
import CommentForm from "~/components/CommentForm";
export default {
    
    components : {
        CommentForm,
    },

    data() {
        return {
            commentOpend : false
        };
    },

    props : {
        post : {
            type : Object,
            required : true
        }
    },

    methods: {
        onToggleComment()
        {
            this.commentOpend = !this.commentOpend;
        },

        onRemovePost()
        {
            this.$store.dispatch( "posts/remove", {
                id : this.post.id,
            })
        },

        onEditPost()
        {

        }
    },
}
</script>

<style scoped>
    a{
        color : inherit;
        text-decoration: none;
    }
</style>
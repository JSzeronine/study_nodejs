<template>
    <div>
        <v-container>
            <v-card>
                <v-subheader>회원가입</v-subheader>
                    <v-container>
                    <v-form>
                        <v-text-field
                            label="이메일"
                            type="email"
                            required
                        ></v-text-field>
                        <v-text-field
                            label="비밀번호"
                            type="password"
                            required
                        ></v-text-field>
                        <v-text-field
                            label="비밀번호확인"
                            type="password"
                            required
                        ></v-text-field>
                        <v-text-field
                            label="닉네임"
                            type="nickname"
                            required
                        ></v-text-field>

                        <v-checkbox
                            required
                            label="제로초 말을 잘 들을 것을 약속합니다."
                        />
                            <v-btn color="green" type="submit">가입하기</v-btn>
                    </v-form>
                </v-container>
            </v-card>
        </v-container>
    </div>
</template>

<script>
export default {
    
}
</script>
const local = require( './localStrategy' );
const kakao = require( './kakaoStrategy' );

module.exports = ( passport ) => {

    local( passport );
    kakao( passport );
    
}
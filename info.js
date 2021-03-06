npm ls -g --depth=0
mkdir 폴더이름
cd 폴더이름
npm init
npm i -g npm // npm update

npm outdated - 업데이트 가능 목록 조회
npm update - 업데이트 전부
npm update 패키지명 - 해당 모듈만 업데이트

npm remove 모듈명 - 삭제
npm search 모듈명
npm info 모듈명
npm ls 모듈명 - 경로 및 왜 설치 되었는지 체크

npm adduser - 로그인
npm whoami - 로그인 여부
npm logout 

npm version patch
npm version minor
npm version major

- 베포
( 24시간 안에 지워야한다. )
npm publish
npm unpublish 패키지명 --force

 

========= Express =========

npm i -g express-generator
express 폴더명 --view=ejs
npm i



========= Database sequelize =========

npm i sequelize mysql2
npm i -g sequelize-cli      // 명령을 쓸 수 있다.
sequelize init              // config폴더, models폴더, seeders폴더 migrations폴더 생성

config.json                 // 설정 후,
sequelize db:create         // 명령 실행



========= nodebird study ========

- Nodemon 설정 -
npm i -D nodemon            // 개발할때만 쓰기 때문에 -D 에 설정해준다.
package.json                // scripts -> "start" : "nodemon app"

npm i express
npm i cookie-parser
npm i express-session
npm i morgan
npm i connect-flash pug

npm i dotenv                // .env 파일 참고


========= 로그인 ========

npm i passport              // 본체
npm i passport-local        // 이메일 로그인
npm i passport-kakao        // 카카오 로그인
npm i bcrypt                // 비밀번호 암호화 해주는 패키지


ID : 1462717921
사이트 : http://www.letskorail.com/

======== 이미지 업로드 =======

여러장 올리기
https://junspapa-itdev.tistory.com/27

npm i multer
<form enctype="multipart/form-data"> // 참고


======== 베포 준비 ========

* package.json Setting *
package.json
"start": "cross-env NODE_ENV=production PORT=80 pm2 start app.js -i -1"

npm i -g cross-env
npm i cross-env

npm i pm2
npm i -g pm2
pm2 list
pm2 restart all // 서버 재시작
pm2 monit // 서버 상태 확인
pm2 kill // 서버 끄기
pm2 start

* 취약점 검사
npm audit
mpm audit fix

[ winston ]

npm i winston@next
-> logger.js 생성 후 참고

날짜별로 로그 저장
npm i winston-daily-rotate-file

[ 보안 ]

npm i helmet hpp
helmet    //  iframe 못쓸 경우 공식문서 확인해
hpp       // hpp 공격 방어

[ session 관리 ]
npm i connect-redis   // 서버 재시작 해도 session 안날리기?
https://redislabs.com/
* 4.0 부터 사용방법 틀려진듯( 꼭 체크 )


npm rm -g nvm // Node 버전 관리
https://github.com/coreybutler/nvm-windows
https://github.com/coreybutler/nvm-windows/releases
nvm-setup.zip
nvm list
nvm install latest // 최신 버전
nvm install 10.1.0 // 특정 버전


node -v
nvm use 10.9.0
node -v
nvm 10.5.0


======== 공부할꺼 ========

link : https://stackoverflow.com/questions/41666820/node-sequelize-mysql-how-to-define-collation-and-charset-to-models

# sequelize db:migrate



var sequelize = new Sequelize('database', 'username', 'password', {
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci', 
    timestamps: true
  },
  logging:false
});

sequelize.define('songs', {
  name: DataTypes.STRING,
  link: DataTypes.STRING,
  artist: DataTypes.STRING,
  lyrics: DataTypes.TEXT,
  writer: DataTypes.STRING,
  composer: DataTypes.STRING
}, {
  charset: 'utf8',
  collate: 'utf8_unicode_ci'
});



============= 업데이트 ================

F:\nodejs\study_nodejs>npm ls -g --depth=0
C:\Users\dev2057\AppData\Roaming\npm
+-- @vue/cli@3.11.0
+-- @vue/cli-init@3.11.0
+-- express@4.17.1
+-- express-generator@4.16.1
+-- node-sass@4.12.0
+-- npm@6.10.3
+-- pm2@3.5.1
+-- rimraf@2.7.0
`-- sequelize-cli@5.5.0

--------------------------------------------

+-- cross-env@5.2.0
+-- express@4.17.1
+-- express-generator@4.16.1
+-- nodemon@1.19.1
+-- pm2@3.5.1
+-- sequelize-cli@5.5.0
`-- vue-cli@2.9.6


https://medium.com/witinweb/vue-cli-%EB%A1%9C-vue-js-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-browserify-webpack-22582202cd52
http://vuejs.kr/vue/vue-cli/2018/01/27/vue-cli-3/
https://jaeyeophan.github.io/2018/10/21/Vuetorials-1-vue-cli-3-0/
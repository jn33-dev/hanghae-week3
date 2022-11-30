# 항해99 10기 3주차/Node.js 입문주차 개인과제

간단한 게시판 포스팅/댓글 CURD 서버 기능을 구현하였습니다.

##### 구현 기능
 - 게시글 포스팅 : POST domain/posts
 - 게시글 리스팅 : GET domain/posts
 - 게시글 수정 : PUT domain/posts/:_postId
 - 게시글 삭제 : DELETE domain/posts/:_postId
 - 댓글 포스팅 : POST domain/comments/:_postId
 - 댓글 리스팅 : GET domain/comments/:_postId
 - 댓글 수정 : PUT domain/comments/:_commentId
 - 댓글 삭제 : DELETE domain/comments/:_commentId

##### 사용 기술
 - JavaScript
 - Node.js
   - express
   - mongoose
   - yarn
   - dotenv
 - MONGODB


## 과제 수행 관련 질문과 답변

##### 1. 수정, 삭제 API에서 Resource를 구분하기 위해서 Request를 어떤 방식으로 사용하셨나요? (`param`, `query`, `body`)
    - params로 자원의 아이디 값을 입력받고, req.params 값을 변수에 할당해서 사용
    - body에서 해당 자원의 pw를 입력받아 req.body 값을 변수에 할당해서 사용
        - params 값의 자원 아이디와, body의 pw 모두가 맞아야 자원을 수정/삭제 하도록 처리
    - query는 사용하지 않음
##### 2. HTTP Method의 대표적인 4가지는 `GET`, `POST`, `PUT`, `DELETE` 가있는데 각각 어떤 상황에서 사용하셨나요?
    - GET : db에 존재하는 전체 자원을 보여주는데 사용하거나, id 값을 입력받은 경우, 해당 id로 존재하는 자원을 표현하는데 사용
    - POST : db에 새로운 자원을 추가하는데 사용 comments의 경우, post id 값을 받아 해당하는 post가 있는 경우, comment를 생성하도록 처리
    - PUT : post 또는 comment id를 입력받고, 해당 id로 자원이 존재하는 경우, 자원의 pw 값을 검사하여 식별되는 경우, 자원의 일부를 수정하는데 사용
    - DELETE :  post 또는 comment id를 입력받고, 해당 id로 자원이 존재하는 경우, 자원의 pw 값을 검사하여 식별되는 경우, 자원을 삭제하는데 사용
##### 3. RESTful한 API를 설계했나요? 어떤 부분이 그런가요? 어떤 부분이 그렇지 않나요?
    - API 설계를 직접 하지 않아서… 과제 지시서에 설계되어 있는 API를 기준으로 RESTful한지 살펴보았음
        - **Unifor interface** : 동일 자원을 요청하는 URI(unifrom resorce identifier)는 똑같이 생겼음. (서로 다른 자원에 대해 중복 URI가 없음)
        - **Client-server decoupling :** 클라이언트와 서버는 완전히 독립적임. 클라이언트는 요청하려는 자원의 URI만 알고 있으면 됨. 본 과제에서 클라이언트는 요청하려는 자원의 URI만 HTTP를 이용해 전달하고, 서버는 전달 받은 URI로 클라이언트가 원하는 자원을 넘겨줌. 그 이상의 interaction은 없음
        - **Statelessness** : 매 request마다 필요한 모든 데이터를 클라이언트에서 넘겨 받고, 서버 사이드 세션에 저장하지 않음. 같은 데이터를 받는 경우라도, 매번 똑같이 모든 필요 정보를 모두 클라에서 입력하여 넘겨야만 해당 자원에 access 할 수 있음
        - **Cacheability** : 해당 과제에서는 캐싱을 구현하지 않았음. 아직 캐시에 대해 잘 알지 못함
        - **Layered System architecture** : REST 서버는 다중 계층으로 구성될 수 있으며 보안, 로드 밸런싱, 암호화 계층을 추가해 구조상의 유연성을 둘 수 있고 PROXY, 게이트웨이 같은 네트워크 기반의 중간매체를 사용할 수 있음. 본 과제에서는 미들웨어를 사용하여 구조화 하였고,  URI에 / 구분자를 사용하여 계층 관계를 나타냈는데, REST에서 요구하는 다중 계층 구조에 해당하는 것인지는 잘 모르겠음
##### 4. 역할별로 Directory Structure를 분리하였을 경우 어떠한 이점이 있을까요?
    - 역할별로 디렉토리를 분리하지 않는다면, 기능별로 필요한 index와 같은 파일은 두개를 만들 수가 없어 파일별로 어떤 역활인지 명확한 구분이 어려울 수 있음
    - 역할별로 디렉토리 구조를 나눠놓는다면, 복잡한 어플리케이션을 개발할 때 기능별로 접근할 수 있어 상대적으로 쉽고 편리하게 문서를 관리할 수 있음
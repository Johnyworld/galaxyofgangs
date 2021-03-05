# Galaxy of gangs (가제)

socket.io와 canvas를 이용한 간단한(?) 게임을 제작.

## 주요 기술

- HTML Canvas
- socket.io
- typescript
- OOP

## To-Dos

### Main
- [x] 소켓 서버 환경 세팅
- [x] 클라이언트 환경 세팅
- [x] State 데이터 통신
- [x] 신규 접속 유저 추가
- [x] 유저 접속 해제
- [ ] 서버 분기
- [ ] 채널 라우팅
- [ ] 초기 접속 화면 UI

### UI
- [x] 우주선 HP / FUEL
- [x] 우주선 현재 방향, 추진력

### Spacecrafts
- [x] 우주선 클래스 작성
- [x] 포탑 클래스 작성
- [x] 마우스 위치에 따른 포탑 Direction 변경
- [x] 우주선 방향 변경, 추진, 후진 구현
- [ ] 우주선간 충돌 판정
- [ ] 우주선과 미사일간 충돌 및 대미지 판정
- [ ] 카메라 구현
- [ ] 우주선 레벨 업 구현
- [ ] 우주선 디자인
- [ ] 우주선 업그레이드 구현

### Map
- [x] 그리드
- [ ] 배경 원근감
- [ ] 운석 오브젝트
- [ ] 타일 충돌판정

### Buildings
- [ ] 클래스 작성
- [ ] 베이스 기지 배치

### Items
- [ ] 아이템 및 사용 구현
- [ ] 상점 구현

### Environment
- [ ] 포격 효과음
- [ ] 피격 효과음
- [ ] 버튼 효과음
- [ ] 배경 음악 삽입

## Development

### Install

```
yarn global add live-server
yarn global add typescript
```

### Start Client

```
yarn build // to convert typescript to javascript
yarn start // serve index.html
```

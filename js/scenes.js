// 숨은그림찾기 장면 데이터: 테마마다 그림 1장(images/scenes/<테마>.webp, 가로 4:3)
// targets: 그림 속에 그려 넣은 동물 4마리
//   id = 동물 이름(data.js와 같음), x·y = 동물 중심 위치(그림 가로·세로의 %), r = 누르는 범위 반지름(그림 가로의 %)
// 그림이 없으면 임시 그림(동물 사진 + 풀)으로 보인다. 그림을 바꾸면 x·y·r도 그 그림에서 다시 재야 한다.
A.SCENES = {
  farm: { targets: [
    { id: 'pig', x: 26.7, y: 54.4, r: 7 }, { id: 'cow', x: 61.7, y: 46, r: 9 },
    { id: 'duck', x: 82.5, y: 55, r: 5 }, { id: 'rooster', x: 15.4, y: 81.7, r: 5.5 },
  ] },
  wild: { targets: [
    { id: 'lion', x: 26.7, y: 43.9, r: 12 }, { id: 'elephant', x: 60.5, y: 38.9, r: 9.5 },
    { id: 'giraffe', x: 78.5, y: 31, r: 8.5 }, { id: 'zebra', x: 81.7, y: 74.4, r: 8.5 },
  ] },
  sea: { targets: [
    { id: 'whale', x: 28.8, y: 16.7, r: 8 }, { id: 'octopus', x: 40.8, y: 39.4, r: 11 },
    { id: 'turtle', x: 81, y: 42, r: 7 }, { id: 'starfish', x: 79.2, y: 67.2, r: 8.5 },
  ] },
  bug: { targets: [
    { id: 'butterfly', x: 22, y: 22, r: 14 }, { id: 'ladybug', x: 67.5, y: 61, r: 9 },
    { id: 'ant', x: 33.8, y: 73.3, r: 5 }, { id: 'bee', x: 79, y: 23, r: 8 },
  ] },
  bird: { targets: [
    { id: 'parrot', x: 30, y: 26, r: 11 }, { id: 'owl', x: 16.3, y: 55, r: 6.5 },
    { id: 'flamingo', x: 66.7, y: 57.8, r: 8.5 }, { id: 'peacock', x: 85.8, y: 64.4, r: 10 },
  ] },
  dino: { targets: [
    { id: 'trex', x: 21, y: 19.5, r: 10 }, { id: 'stego', x: 68, y: 84, r: 11 },
    { id: 'dragon', x: 82.3, y: 57, r: 10.5 }, { id: 'unicorn', x: 25.3, y: 69.6, r: 11 },
  ] },
};

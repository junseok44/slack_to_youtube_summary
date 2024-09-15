// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        isolatedModules: true, // 여기에서 ts-jest 설정을 직접 지정
      },
    ],
  },
};

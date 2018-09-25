const { GraphQLScalarType } = require("graphql");
const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");

const { User, Team } = require("./models");

const JWT_SECRET = process.env.JWT_SECRET;

function randomChoice(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}

const avatarColors = [
  "D81B60",
  "F06292",
  "F48FB1",
  "FFB74D",
  "FF9800",
  "F57C00",
  "00897B",
  "4DB6AC",
  "80CBC4",
  "80DEEA",
  "4DD0E1",
  "00ACC1",
  "9FA8DA",
  "7986CB",
  "3949AB",
  "8E24AA",
  "BA68C8",
  "CE93D8"
];

const resolvers = {
  Query: {
    test(_, args, context) {
      return "Hello World!!";
    }
  },
  Mutation: {
    async captureEmail(_, { email }) {
      // 기존에 이메일 정보가 있는지 확인
      const isEmailTaken = await User.findOne({ email });
      // 있으면 에러
      if (isEmailTaken) {
        throw new Error("This email is already taken");
      }
      // 없으면 유저 생성 (상태: Pending)
      const user = await User.create({
        email,
        role: "Owner",
        status: "Pending"
      });
      return user;
    },
    async signup(_, { id, firstname, lastname, password }) {
      // id로 유저 찾기
      const user = await User.findById(id);
      // 유저 정보 생성
      const common = {
        firstname,
        lastname,
        name: `${firstname} ${lastname}`,
        avatarColor: randomChoice(avatarColors),
        password: await bcrypt.hash(password, 10),
        status: "Active"
      };
      // 소유자이면 팀을 생성하고 유저 정보 업데이트
      if (user.role === "Owner") {
        const team = await Team.create({
          name: `${common.name}'s Team`
        });
        user.set({
          ...common,
          team: team.id,
          jobTitle: "CEO/Owner/Founder"
        });
      } else {
        // 소유자가 아니면 팀정보 없이 유저 정보 업데이트
        user.set(common);
      }
      // 유저 정보 저장
      await user.save();

      // 유저ID와 이메일 정보와 JWS시크크릿을 가지고 토큰 생성
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

      // 유저와 토큰정보 반환
      return { token, user };
    },
    async login(_, { email, password }) {
      // 이메일로 유저 찾기
      const user = await User.findOne({ email });
      // 없으면 에러
      if (!user) {
        throw new Error("No user with that email");
      }
      // 패스워드 비교
      const valid = await bcrypt.compare(password, user.password);
      // 패스워드가 다르면 에러
      if (!valid) {
        throw new Error("Incorrect password");
      }
      // jwt 토근 생성
      const token = jwt.sign({ id: user.id, email }, JWT_SECRET);
      // 유저/토큰 정보 반환
      return { token, user };
    }
  },
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue: value => moment(value).toDate(), // value from the client
    serialize: value => value.getTime(), // value sent to the client
    parseLiteral: ast => ast
  })
};
module.exports = resolvers;

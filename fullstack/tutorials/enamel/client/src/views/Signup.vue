<template>
  <el-container>
    <el-header >
    </el-header>
    <el-main>
      <div class="container-center">
        <div>Welcome to enamel! Finish setting up your account</div>
        <div v-if="error" class="error">
          {{ error }}
        </div>
        <el-form ref="form" :model="form">
          <el-form-item>
            <label>First name</label>
            <el-input v-model="form.firstname" placeholder="Your first name"></el-input>
            <label>Last name</label>
            <el-input v-model="form.lastname" placeholder="Your last name"></el-input>
            <label>Password</label>
            <el-input v-model="form.password" type="password" placeholder="Password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="signup">Complete</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { Signup } from "../constants/query.gql";

export default {
  data() {
    return {
      error: false,
      form: {
        firstname: "",
        lastname: "",
        password: ""
      }
    };
  },
  methods: {
    async signup() {
      this.$apollo.provider.clients.defaultClient.cache.reset();

      const { firstname, lastname, password } = this.form;
      // 유효성 검사
      if (!(firstname && lastname && password)) {
        this.error = "Please complete the form";
        return;
      }
      // 회원가입 API 요청
      this.$apollo
        .mutate({
          mutation: Signup,
          variables: {
            id: this.$route.params.id,
            firstname,
            lastname,
            password
          }
        })
        .then(({ data: { signup } }) => {
          const id = signup.user.id;
          const token = signup.token;
          // 성공하면 유저/토큰 정보를 로컬스토리지에 저장
          this.saveUserData(id, token);
          this.$router.push({ name: "workspace" });
          // console.log("success!"); // For now just print
        })
        .catch(error => {
          this.error = "Something went wrong";
          console.log(error);
        });
    },
    saveUserData(id, token) {
      localStorage.setItem("user-id", id);
      localStorage.setItem("user-token", token);
      // >
      this.$root.$data.userId = localStorage.getItem("user-id");
    }
  }
};
</script>

<style scoped>
.el-button {
  width: 100%;
}
.error {
  padding-top: 10px;
}
</style>
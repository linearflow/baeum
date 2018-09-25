import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Signup from "./views/Signup.vue";
import Login from "./views/Login.vue";
import Workspace from "./views/Workspace.vue";
import Folder from './views/Folder.vue'
import FolderDetail from './views/FolderDetail.vue'

Vue.use(Router);

const login = {
  path: '/login',
  name: 'login',
  component: Login,
  meta: { title: 'Login - enamel' }
}

const workspace = {
  path: '/w',
  name: 'workspace',
  component: Workspace,
  meta: { title: 'Workspace - enamel', requiresAuth: true },
  children: [
    {
      path: 'folder/:id',
      component: Folder,
      props: true,
      children: [
        {
          path: '',
          name: 'folder',
          component: FolderDetail
        },
        // {
        //   path: 'task/:taskId',
        //   name: 'task',
        //   component: Task,
        //   props: true
        // }
      ]
    }
  ]
}

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: { title: 'enamel', redirect: true}
    },
    {
      path: "/signup/:id",
      name: "signup",
      component: Signup,
      meta: { title: "Signup - enamel" }
    },
    login,
    workspace
  ]
});

// 라우팅 되기 전
router.beforeEach((to, from, next) => {
  // 토큰정보 가져오기
  const auth = localStorage.getItem('user-id')
  // 다음 라우팅이 인증을 요구하면
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 토큰이 없으면 로그인 페이지로
    if(!auth) {
      next(login)
    }
  // 다음 라우팅이 리다이텍트면
  } else if (to.matched.some(record => record.meta.redirect)) {
    // 토큰이 있으면 워크스페이스로
    if(auth) {
      next(workspace)
    }
  }
  // 다음 라우팅으로
  next()
})

// 라우팅 된 후
router.afterEach((to, from) => {
  document.title = to.meta.title;
});

export default router;

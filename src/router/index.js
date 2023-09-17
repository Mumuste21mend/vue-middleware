import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router

function guest({next,store}){

  let isLoggedIn = false // Can be calculated through store

  if(isLoggedIn){

   return next({

       name: 'home'

   })

  }

  return next();

}




function middlewarePipeline (context, middleware, index) {

  const nextMiddleware = middleware[index]

  if(!nextMiddleware){

   return context.next

  }

  return () => {

   const nextPipeline = middlewarePipeline(

          context, middleware, index + 1

   )

      nextMiddleware({...context, next: nextPipeline })

  }

}

// export default middlewarePipeline

// Configure it in router.js once you are done with this file. Then the navigation guard and the middleware pipeline can be used to execute middleware. The steps follow below.

// router.js

router.beforeEach((to, from, next) => {

  /** Navigate to next if middleware is not applied */

  if (!to.matched.some(record=>!!record.meta.middleware)) {

   return next()

  }

  const middleware = to.meta.middleware;

  const context = {to,from,next} //   store  | You can also pass store as an argument


  return middleware[0]({

   ...context,

   next:middlewarePipeline(context, middleware,1)

  })

})


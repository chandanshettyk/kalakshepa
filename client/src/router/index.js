import {

    createRouter,

    createWebHistory

} from 'vue-router'

import Auth from '../pages/Auth.vue'

import Dashboard from '../pages/Dashboard.vue'

import Chat from '../pages/Chat.vue'

import Chess from '../pages/Chess.vue'

import Audio from '../pages/Audio.vue'

import ELibrary from '../pages/ELibrary.vue'

import UploadBook from '../pages/UploadBook.vue'



/* Auth Check */

const requireAuth = (

    to,

    from,

    next

) => {

    const token =

        localStorage.getItem('token')

    if (!token) {

        alert('Please login first')

        next('/')

    } else {

        next()

    }

}

const routes = [

    {

        path: '/',

        component: Auth

    },

    {

        path: '/dashboard',

        component: Dashboard,

        beforeEnter: requireAuth

    },

    {

        path: '/chat',

        component: Chat,

        beforeEnter: requireAuth

    },

    {

        path: '/audio',

        component: Audio,

        beforeEnter: requireAuth

    },

    {

        path: '/chess',

        component: Chess,

        beforeEnter: requireAuth

    },

    {
        path: '/library',
        component: ELibrary
    },


    {
        path: '/admin',
        component: UploadBook
    }


]

const router = createRouter({

    history: createWebHistory(),

    routes

})

export default router
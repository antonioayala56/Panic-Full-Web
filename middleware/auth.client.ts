// middleware/auth.client.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth()

  // If not authenticated, redirect to home
  if (!user.value) {
    return navigateTo('/')
  }
})
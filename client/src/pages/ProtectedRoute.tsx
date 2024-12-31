import { Outlet, useNavigate } from 'react-router-dom'

export function ProtectedRoute() {
  // const [user, loading] = useAuthState(auth)
  const navigate = useNavigate()

  // if (!user) {
  //   navigate('/login')
  //   return null
  // }

  // if (loading) {
  //   return (
  //     <div className="loading-component">
  //       <p>Loading...</p>
  //     </div>
  //   )
  // }

  return <Outlet context={{}} />
}

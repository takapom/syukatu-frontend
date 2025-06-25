import LoginForm from "@/components/LoginForm"

export default function App(){
  return(
    <div>
      {/* 未ログインならLoginForm、ログイン済みならCompanyLists */}
      <LoginForm />
    </div>
  )
}
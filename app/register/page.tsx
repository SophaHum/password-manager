import { Metadata } from "next"
import { RegisterForm } from "./components/RegisterForm"

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account",
}

export default function RegisterPage() {
  return <RegisterForm />
}
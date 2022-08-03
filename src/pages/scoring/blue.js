import LoginPage from "../../components/LoginPage";
import ScoringPage from "../../components/ScoringPage";
import { useAuth } from "../../lib/auth";

export default function Blue() {
  const { user } = useAuth();

  console.log(user);
  return user ? <ScoringPage team="blue" displayName="Blue" /> : <LoginPage />;
}

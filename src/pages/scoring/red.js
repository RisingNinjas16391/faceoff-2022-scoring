import LoginPage from "../../components/LoginPage";
import ScoringPage from "../../components/ScoringPage";
import { useAuth } from "../../lib/auth";

export default function Red() {
  const { user } = useAuth();

  return user ? <ScoringPage team="red" displayName="Red" /> : <LoginPage />;
}

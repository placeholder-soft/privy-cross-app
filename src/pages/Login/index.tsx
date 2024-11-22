import { useLogin } from "@privy-io/react-auth";
import { useNavigate } from "react-router";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useLogin({
    onComplete: () => {
      navigate("/app");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="h-screen flex justify-center items-center">
      <button
        className="bg-blue-100 p-6 text-2xl rounded-3xl"
        onClick={() => login()}
      >
        Login
      </button>
    </div>
  );
};

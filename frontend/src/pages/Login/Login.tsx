import { useState } from "react";
import NavigationBar from "../../components/NavigationBar";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import useGlobal from "../../hooks/useGlobal";

const Login = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const { setUserID, setUserEmail } = useGlobal();
  const navigate = useNavigate();
  const [loginEmailInput, setLoginEmailInput] = useState<string>("");
  const [loginPasswordInput, setLoginPasswordInput] = useState<string>("");
  const [registerEmailInput, setRegisterEmailInput] = useState<string>("");
  const [registerPasswordInput, setRegisterPasswordInput] =
    useState<string>("");
  const [registerConfirmPasswordInput, setRegisterConfirmPasswordInput] =
    useState<string>("");

  const handleChageLoginEmailInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoginEmailInput(event.target.value);
  };

  const handleChagePasswordInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoginPasswordInput(event.target.value);
  };

  const handleChageRegisterEmailInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRegisterEmailInput(event.target.value);
  };

  const handleChageRegisterPasswordInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRegisterPasswordInput(event.target.value);
  };

  const handleChageRegisterConfirmPasswordInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRegisterConfirmPasswordInput(event.target.value);
  };

  const handleClickLogin = async () => {
  const loginData = {
    email: loginEmailInput,
    password: loginPasswordInput,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (response.ok) {
      const user = await response.json();
      console.log("Login successful:", user);

      setUserID(user.userId);
      setUserEmail(user.email);

      localStorage.setItem("token", user.token);
      localStorage.setItem("userID", user.userId);
      localStorage.setItem("userEmail", user.email);

      navigate("/current-task");
    } else {
      const error = await response.json();
      console.error("Login failed:", error);
      alert("Login failed: " + error.message);
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("An error occurred while trying to log in.");
  }
};


  const handleClickRegister = async () => {
    if (registerPasswordInput !== registerConfirmPasswordInput) {
      alert("Passwords do not match.");
      return;
    }

    const registerData = {
      email: registerEmailInput,
      password: registerPasswordInput,
    };

    console.log("Register data:", registerData);
    console.log("Register data:" + JSON.stringify(registerData));
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (response.ok) {
        alert("Registration successful! Please log in.");
        navigate("/login", { replace: true }); // stays on login page
      } else {
        const error = await response.json();
        console.error("Registration failed:", error);
        alert("Registration failed: " + error.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred while trying to register.");
    }
  };

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  return (
    <div className="h-screen flex flex-col">
      <NavigationBar />
      <main className="flex flex-1 px-6 sm:px-12 py-6 ">
        <section className="hidden lg:flex flex-1 flex-col items-center justify-center">
          <div className="flex items-end">
            <h1 className="text-[64px]">TODO</h1>
            <h2 className="hidden 2xl:block text-[32px] p-4">
              make your task easier to track
            </h2>
          </div>
          <span>made by punpunpunnawat</span>
        </section>

        <section className="flex flex-1 flex-col gap-6">
          <section className="flex flex-1 flex-col p-12  justify-between items-center bg-light_main light_border">
            <h2 className="text-2xl">LOGIN</h2>

            <form
              onSubmit={handleClickLogin}
              className="w-full flex flex-col gap-2"
            >
              <input
                type="email"
                value={loginEmailInput}
                onChange={handleChageLoginEmailInput}
                placeholder="E-MAIL"
                className="h-10 light_border px-4"
              />
              <input
                type="password"
                value={loginPasswordInput}
                onChange={handleChagePasswordInput}
                placeholder="PASSWORD"
                className="h-10 light_border px-4"
              />
            </form>

            <Button onClick={handleClickLogin}>LOGIN</Button>
          </section>

          <section className="flex flex-1 flex-col p-12 justify-between items-center bg-light_main light_border">
            <h2 className="text-2xl">REGISTER</h2>

            <form
              onSubmit={handleClickRegister}
              className="w-full flex flex-col gap-2"
            >
              <input
                id="register-email"
                name="register-email"
                type="email"
                value={registerEmailInput}
                onChange={handleChageRegisterEmailInput}
                placeholder="E-MAIL"
                className={`h-10 light_border px-4 ${
                  registerEmailInput && !isValidEmail(registerEmailInput)
                    ? "border-red-500"
                    : ""
                }`}
              />
              <input
                type="password"
                value={registerPasswordInput}
                onChange={handleChageRegisterPasswordInput}
                placeholder="PASSWORD"
                className="h-10 light_border px-4"
              />
              <input
                type="password"
                value={registerConfirmPasswordInput}
                onChange={handleChageRegisterConfirmPasswordInput}
                placeholder="CONFIRM PASSWORD"
                className="h-10 light_border px-4"
              />
            </form>

            <Button onClick={handleClickRegister}>REGISTER</Button>
          </section>
        </section>
      </main>
    </div>
  );
};

export default Login;

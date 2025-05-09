import { useState } from "react";
import NavigationBar from "../../components/NavigationBar";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import useGlobal from "../../hooks/useGlobal";

const Login = () => {
    const {setUserID} = useGlobal();
    const navigate = useNavigate();
    const [loginEmailInput, setLoginEmailInput] = useState<string>("");
    const [loginPasswordInput, setLoginPasswordInput] = useState<string>("");
    const [registerEmailInput, setRegisterEmailInput] = useState<string>("");
    const [registerPasswordInput, setRegisterPasswordInput] = useState<string>("");
    const [registerConfirmPasswordInput, setRegisterConfirmPasswordInput] = useState<string>("");

    const handleChageLoginEmailInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoginEmailInput(event.target.value);
    }

    const handleChagePasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoginPasswordInput(event.target.value);
    }

    const handleChageRegisterEmailInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterEmailInput(event.target.value);
    }

    const handleChageRegisterPasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterPasswordInput(event.target.value);
    }

    const handleChageRegisterConfirmPasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterConfirmPasswordInput(event.target.value);
    }

    console.log(loginEmailInput)
    console.log(loginPasswordInput)
    
    const handleClickLogin = async () => {
        // Construct the login data
        const loginData = {
            email: loginEmailInput,
            password: loginPasswordInput
        };

        console.log("Login data:", loginData);

    
        // Send POST request to backend for login verification
        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            });
    
            if (response.ok) {
                // If login is successful, redirect to the current task page
                const user = await response.json();
                console.log("Login successful:", user);
                setUserID(user.user_id)
                localStorage.setItem('userID', user.user_id);
                navigate("/current-task"); // Navigate to the next page (e.g., dashboard or tasks)
            } else {
                // If login failed, display an error message
                const error = await response.json();
                console.error("Login failed:", error);
                alert("Login failed: " + error.message);
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred while trying to log in.");
        }
    };
    

  return (
    
    <div className="h-screen flex flex-col">
        <NavigationBar username=""/>
       <main className="flex flex-1 px-6 sm:px-12 py-6 ">
            <section className="hidden lg:flex flex-1 flex-col items-center justify-center">
                <div className="flex items-end">
                    <h1 className="text-[64px]">
                        TODO
                    </h1>
                    <h2 className="hidden 2xl:block text-[32px] p-4">
                        make your task easier to track
                    </h2>
                </div>
                <span>made by punpunpunnawat</span>
            </section>

            <section className="flex flex-1 flex-col gap-6">
                <section className="flex flex-1 flex-col p-12  justify-between items-center bg-light_main light_border">
                    <h2 className="text-2xl">LOGIN</h2>
                    <div className="w-full flex flex-col gap-2">
                        <input
                            type="text"
                            value={loginEmailInput}
                            onChange={handleChageLoginEmailInput}
                            placeholder="E-MAIL"
                            className="h-10 light_border px-4"
                        />
                        <input
                            type="text"
                            value={loginPasswordInput}
                            onChange={handleChagePasswordInput}
                            placeholder="PASSWORD"
                            className="h-10 light_border px-4"
                        />
                    </div>
                    <Button onClick={handleClickLogin}>LOGIN</Button>
                </section>
                    
                <section className="flex flex-1 flex-col p-12 justify-between items-center bg-light_main light_border">
                    <h2 className="text-2xl">REGISTER</h2>
                    <div className="w-full flex flex-col gap-2">
                        <input
                            type="text"
                            value={registerEmailInput}
                            onChange={handleChageRegisterEmailInput}
                            placeholder="E-MAIL"
                            className="h-10 light_border px-4"
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
                    </div>
                    <Button>REGISTER</Button>
                </section>
            </section>
        </main>
    </div>
  );
};

export default Login;

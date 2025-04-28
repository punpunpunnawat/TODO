import { useState } from "react";
import NavigationBar from "../../components/NavigationBar";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

const Login = () => {
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
    
    const handleClickLogin = () => {
        navigate("/current-task");
    }

  return (
    
    <div className="h-screen flex flex-col">
        <NavigationBar username=""/>
       <main className="w-full h-full flex px-6 sm:px-12 py-6 ">
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
                            type="text"
                            value={registerPasswordInput}
                            onChange={handleChageRegisterPasswordInput}
                            placeholder="PASSWORD"
                            className="h-10 light_border px-4"
                        />
                        <input
                            type="text"
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

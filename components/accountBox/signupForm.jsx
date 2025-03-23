import React, { useContext, useState } from "react";
import axios from "axios";
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  LineText,
  MutedLink,
  SubmitButton,
} from "./common";
import { Marginer } from "../marginer";
import { AccountContext } from './accountContext';

export function SignupForm(props) {
  const { switchToSignin } = useContext(AccountContext);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Submitting form with data:", { full_name, email, password, confirm_password });
  
    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMessage("All fields are required.");
      return;
    }
  
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
  
    try {
      const response = await axios.post("https://smartbin-backend.onrender.com/signup", {
        full_name: fullName,
        email: email,
        password: password,
        confirm_password: confirmPassword,
      });
  
      alert(response.data.message);
      switchToSignin();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Something went wrong");
    }
  };
  
  
  

  return (
    <BoxContainer>
      <FormContainer onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </FormContainer>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <Marginer direction="vertical" margin={10} />
      <SubmitButton type="submit">Signup</SubmitButton>
      <Marginer direction="vertical" margin="5px" />
      <LineText>
        Already have an account?{" "}
        <BoldLink onClick={switchToSignin} href="#">
          Signin
        </BoldLink>
      </LineText>
    </BoxContainer>
  );
}

export default SignupForm;

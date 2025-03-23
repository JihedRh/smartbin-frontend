import React, { useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
import { AccountContext } from "./accountContext";

function LoginForm(props) {
  const { switchToSignup } = useContext(AccountContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = useCallback((e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
  
    axios
      .post('https://smartbin-backend.onrender.com/api/login', { email, password })
      .then((response) => {
        const { token, full_name, email, role } = response.data;
  
        localStorage.setItem('authToken', token);
        localStorage.setItem('full_name', full_name);
        localStorage.setItem('email', email);
        localStorage.setItem('role', role);
  
        navigate('/home');
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            setErrorMessage('Email or password are incorrect!');
          } else if (error.response.status === 403) {
            setErrorMessage('Your account has been banned. Please contact support.');
          } else {
            setErrorMessage('Server error!');
          }
        } else {
          setErrorMessage('Network error!');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [email, password, navigate]);
  

  return (
    <BoxContainer>
      <FormContainer onSubmit={handleSignIn}>
        <Input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <Input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <Marginer direction="vertical" margin={10} />
        <MutedLink href="#">Forget your password?</MutedLink>
        <Marginer direction="vertical" margin="1.6em" />
        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Signin'}
        </SubmitButton>
      </FormContainer>
      <Marginer direction="vertical" margin="5px" />
      <LineText>
        Don't have an account?{" "}
        <BoldLink onClick={switchToSignup} href="#">
          Signup
        </BoldLink>
      </LineText>
    </BoxContainer>
  );
}

export default LoginForm;

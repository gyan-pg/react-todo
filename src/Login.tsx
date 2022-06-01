import React, { useState, useEffect } from 'react';
import styles from "./Login.module.css";
import { Button, FormControl, TextField, Typography } from "@material-ui/core";
import { auth } from "./firebase";

const Login: React.FC = (props: any) => {
  const[isLogin, setIsLogin] = useState(true); // trueでログイン画面表示とする。
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");

  useEffect(() => {
    // 認証関係の変更に際して呼び出される。
    // ログイン成功時にuserにユーザー情報が入ってくる。
    auth.onAuthStateChanged((user) => {
      // userが存在する場合はApp画面に遷移の意
      // &&は左側がtrueなら右側の処理を返す→このケースではページ移動をする。
      user && props.history.push("/");
    });
  },[props.history]);

  return (
    <div className={styles.login__root}>
      <h1>{isLogin ? "Login" : "Register"}</h1>
      <br/>
      <FormControl>
        <TextField
          InputLabelProps={{
            shrink: true
          }}
          name="email"
          label="E-mail"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
          }}
        />
      </FormControl>
      <br/>
      <FormControl>
        <TextField
          InputLabelProps={{
            shrink: true
          }}
          name="password"
          label="password"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value);
          }}
        />
      </FormControl>
      <br/>
      <Button variant="contained" color="primary" size="small"
              onClick={
                isLogin 
                  ? async () => { // login画面の時
                    try {
                      await auth.signInWithEmailAndPassword(email, password);
                      props.history.push("/");
                    } catch (error: any){
                      alert(error.message);
                    }
                  }
                  : async () => {
                    try {
                      await auth.createUserWithEmailAndPassword(email, password);
                      props.history.push("/");
                    } catch (error: any) {
                      alert(error.message);
                    }
                  }
              }
        >
        {isLogin ? "login" : "register"}
      </Button>
      <br/>
      <Typography align="center">
        <span onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Create new account?" : "Back to Login"}
        </span>
      </Typography>
    </div>
  )
}

export default Login
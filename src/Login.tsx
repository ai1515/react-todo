import React, { useState, useEffect } from "react";
import styles from "./Login.module.css";
import { Button, FormControl, TextField, Typography } from "@material-ui/core";
import { auth } from "./firebase";

const Login: React.FC = (props: any) => {
  // trueの時はログインモード、falseの時はレジスターモードにする
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 認証関係で何らかの変更がある場合に毎回呼び出されるメソッド
  useEffect(() => {
    // ログインに成功したときにuserに値が入る。userに値が入っていたら、該当画面に遷移させる
    // ログイン出来ないときは、この画面にとどまる
    const unSub = auth.onAuthStateChanged((user) => {
      user && props.history.push("/");
    });
    return () => unSub();
  }, [props.history]);

  return (
    <div className={styles.login__root}>
      {/* isLoginの時はLoginと表示、じゃないときはRegister */}
      <h1>{isLogin ? "Login" : "Register"}</h1>
      <br />
      <FormControl>
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          name="email"
          label="E-mail"
          value={email}
          //   入力した内容をemailのstateに上書きする
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
          }}
        />
      </FormControl>
      <br />
      <FormControl>
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          name="password"
          label="Password"
          type="password"
          value={password}
          //   入力した内容をpasswordのstateに上書きする
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value);
          }}
        />
      </FormControl>
      <br />
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={
          //   ログイン状態の時に実行。引数にemail,passwordを渡す、成功したら該当画面に画面遷移させる
          isLogin
            ? async () => {
                try {
                  await auth.signInWithEmailAndPassword(email, password);
                  props.history.push("/");
                } catch (error: any) {
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
        {/* ログインしてるかしてないかでボタンの表記を切り替える */}
        {isLogin ? "Login" : "Register"}
      </Button>
      <br />

      <Typography align="center">
        {/* クリックすると現状のstateと反対の状態になる */}
        <span onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Create new account ?" : "Back to login"}
        </span>
      </Typography>
    </div>
  );
};

export default Login;

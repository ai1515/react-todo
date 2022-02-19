import { FormControl, TextField, List } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import TaskItem from "./TaskItem";
import { auth, db } from "./firebase";
import { makeStyles } from "@material-ui/styles";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import { classicNameResolver } from "typescript";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles({
  field: {
    marginTop: 30,
    marginBottom: 20,
  },
  list: {
    margin: "auto",
    width: "40%",
  },
});

const App: React.FC = (props: any) => {
  // データベースの内容をuseStateで配列の形で保持。初期値を設定。
  const [tasks, setTasks] = useState([{ id: "", title: "" }]);
  // 入力した値を入れる。初期値を設定。
  const [input, setInput] = useState("");
  const classes = useStyles();

  // 何らかのユーザー認証に変化があった場合のメソッド
  // ユーザーが存在しない場合、ログインページに遷移させる
  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      !user && props.history.push("login");
    });
    // このコンポーネントがアンマウントされたとき(リロードなど)に実行してくれる関数をreturnに定義できる
    // 監視を停止させる関数を指定
    return () => unSub();
  });

  // Firebaseにアクセスして取得する
  useEffect(() => {
    // 返り値を受け取る変数
    const unSub = db
      .collection("tasks")
      // 取得する
      .onSnapshot((snapshot: { docs: any[] }) => {
        // オブジェクト一覧をtasksに格納する
        setTasks(
          // 複数あるドキュメントをmapで展開、格納
          snapshot.docs.map((doc) => ({ id: doc.id, title: doc.data().title }))
        );
      });
    // このコンポーネントがアンマウントされたとき(リロードなど)に実行してくれる関数をreturnに定義できる
    // 監視を停止させる関数を指定
    return () => unSub();
  }, []);

  const newTask = (e: React.MouseEvent<HTMLButtonElement>) => {
    // データベースに追加したいコレクションを指定
    db.collection("tasks").add({ title: input });
    // Inputを初期化しておく
    setInput("");
  };

  return (
    <div className={styles.app__root}>
      <h1>Todo App by React/Firebase</h1>
      <button
        className={styles.app__logout}
        onClick={async () => {
          // もともと用意されているsignOutメソッドを呼ぶだけでログアウトできる
          try {
            await auth.signOut();
            props.history.push("login");
          } catch (error: any) {
            alert(error.message);
          }
        }}
      >
        <ExitToAppIcon />
      </button>
      <br />
      <FormControl>
        <TextField
          className={classes.field}
          // labelを小さく表示
          InputLabelProps={{
            shrink: true,
          }}
          label="New task ?"
          value={input}
          // eはイベントオブジェクトのe
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
        />
      </FormControl>
      {/* 入力されていないときはボタンが押せないようにする＝disabled  */}
      <button className={styles.app__icon} disabled={!input} onClick={newTask}>
        <AddToPhotosIcon />
      </button>

      <List className={classes.list}>
        {tasks.map((task) => (
          <TaskItem key={task.id} id={task.id} title={task.title} />
        ))}
      </List>
    </div>
  );
};
export default App;

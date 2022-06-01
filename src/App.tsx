import { FormControl, List, TextField } from '@material-ui/core';
import React, { useState, useEffect} from 'react';
import styles from './App.module.css';
import { db } from "./firebase"
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import TaskItem from "./TaskItem";
import { makeStyles } from "@material-ui/styles";

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


const App: React.FC = () => {
  
  const [tasks, setTasks] = useState([{ id:"", title:"" }]);
  const [input, setInput] = useState("");
  const classes = useStyles();

  useEffect(() => {
    // db.collection("コレクション名")で、firebase.ts / .envで指定したfirebaseプロジェクトのDB内コレクションにアクセスできる。
    // onSnapshotメソッドでcloud firestoreの内容の変化を監視して、内容を取得している。
    const unSub = db.collection("tasks").onSnapshot((snapshot) => {
      // setTasksはtasks(state)に値を詰める関数
      setTasks(
        snapshot.docs.map((doc) => ({id: doc.id, title: doc.data().title}))
      );
    });
    // useEffectはクリーンナップ関数をreturnで定義可能
    // コンポーネントがアンマウントされた時に実行
    // 監視を停止する。
    return () => unSub();
  }, []);

  const newTask = (e: React.MouseEvent<HTMLButtonElement>) => {
    // cloud fireStore のcollectionを指定、追加という流れ。IDは自動挿入される。
    db.collection("tasks").add({ title: input });
    setInput("");
  }

  return (
    <div className={styles.app__root}>
      <h1>Todo App by React/Firebase</h1>
      <br/>
      <FormControl>
        <TextField
          className={classes.field}  
          InputLabelProps={{ 
            shrink: true,
          }}
          label="New task?"
          value={input}
          onChange={( e:React.ChangeEvent<HTMLInputElement>) => {
              setInput(e.target.value)
            }
          }
        />
      </FormControl>
      <button className={styles.app__icon} disabled={!input} onClick={newTask}>
        <AddToPhotosIcon />
      </button>

      <List className={classes.list}>
        {tasks.map((task) => (
          <TaskItem key={task.id} id={task.id} title={task.title} />
        ))};
      </List>

    </div>
  );
}

export default App;

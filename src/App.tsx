import { FormControl, TextField } from '@material-ui/core';
import React, { useState, useEffect} from 'react';
import './App.css';
import { db } from "./firebase"
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";


const App: React.FC = () => {
  
  const [tasks, setTasks] = useState([{ id:"", title:"" }]);
  const [input, setInput] = useState("");

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
    <div className="App">
      <h1>Todo App by React/Firebase</h1>

      <FormControl>
        <TextField
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
      <button disabled={!input} onClick={newTask}>
        <AddToPhotosIcon />
      </button>

      {tasks.map((task) => (
      <h3 key={task.id}>{task.title}</h3>
      ))}
    </div>
  );
}

export default App;

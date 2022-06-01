// rafceと打つと雛形を作成できる。
import React, { useState } from 'react';
import firebase from "firebase/app";
import { ListItem, TextField, Grid } from "@material-ui/core";
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditOutlined from '@material-ui/icons/EditOutlined';
import { db } from "./firebase";

interface PROPS {
  id: string;
  title: string;
}

const TaskItem: React.FC<PROPS> = (props) => {
  const [title, setTitle] = useState(props.title);

  const editTask = () => {
    // docmentの属性の一部のみ変更の際は、{merge: true}とする。
    db.collection("tasks").doc(props.id).set({title: title}, {merge: true})
  };

  const deleteTask = () => {
    db.collection("tasks").doc(props.id).delete();
  };

  return (
    <ListItem>
      <h2>{props.title}</h2>
      <Grid container justifyContent='flex-end'>
        <TextField
        InputLabelProps={{
          shrink: true,
        }}
        label="Edit task"
        value={title}
        onChange={
          (e:React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
        }
        />
      </Grid>
      <button onClick={editTask}>
        <EditOutlined />
      </button>
      <button onClick={deleteTask}>
        <DeleteOutlineOutlinedIcon />
      </button>
    </ListItem>
  );
};

export default TaskItem;
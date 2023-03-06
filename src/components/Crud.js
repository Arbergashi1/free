import React, { useEffect, useState } from "react";
import "./crud.css";

const Crud = () => {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const [deletedLogs, setDeletedLogs] = useState(() => {
    const storedLogs = localStorage.getItem("deletedLogs");
    return storedLogs ? JSON.parse(storedLogs) : [];
  });
  // console.log("first", deletedLogs.length);

  const [insertedLogs, setInsertedLogs] = useState(() => {
    const storedLogs = localStorage.getItem("insertedLogs");
    return storedLogs ? JSON.parse(storedLogs) : [];
  });

  const [editedLogs, setEditedLogs] = useState(() => {
    const storedLogs = localStorage.getItem("editedLogs");
    return storedLogs ? JSON.parse(storedLogs) : [];
  });
  const [previousTask, setPreviousTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [editTaskIndex, setEditTaskIndex] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [showLogs, setShowLogs] = useState(false);
  const [showInLogs, setShowInLogs] = useState(false);
  const [showUpLogs, setShowUpLogs] = useState(false);
  const [color, setColor] = useState("#ffce54");

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "UTC",
  };

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  useEffect(() => {
    localStorage.setItem("deletedLogs", JSON.stringify(deletedLogs));
  }, [deletedLogs]);

  useEffect(() => {
    localStorage.setItem("insertedLogs", JSON.stringify(insertedLogs));
  }, [insertedLogs]);

  useEffect(() => {
    localStorage.setItem("editedLogs", JSON.stringify(editedLogs));
  }, [editedLogs]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask) {
      if (editTask !== null && editTaskIndex !== null) {
        // If an edit is in progress, update the task at the given index.
        const updatedTasks = [...tasks];
        updatedTasks[editTaskIndex] = {
          ...updatedTasks[editTaskIndex],
          task: newTask,
        };
        setTasks(updatedTasks);
        setEditTask(null);
        setEditTaskIndex(null);
        const editedLog = {
          previousValue: previousTask,
          id: Date.now(),
          updatedValue: newTask,
          date: new Date().toLocaleString("en-US", options),
        }
      setEditedLogs([...editedLogs, editedLog]);

      } else {
        // Otherwise, add a new task.
        const newTaskObj = {
          id: Date.now(),
          task: newTask,
          date: new Date().toLocaleString("en-US", options),
          backgroundColor: color,
        };
        setTasks([...tasks, newTaskObj]);
      }
      setNewTask("");
      setColor("#ffce54");

      const insertedLog = {
        id: Date.now(),
        task: newTask,
        date: new Date().toLocaleString("en-US", options),
      };
      setInsertedLogs([...insertedLogs, insertedLog]);
    }
  };

  const handleTaskChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleEdit = (task, index) => {
    setPreviousTask(task.task)
    setEditTask(task);
    setEditTaskIndex(index);
    setNewTask(task.task);
  };

  const handleDelete = (taskId) => {
    const deletedTask = tasks.find((task) => task.id === taskId);
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    const deletedLog = {
      id: Date.now(),
      task: deletedTask.task,
      date: new Date().toLocaleString("en-US", options),
    };
    setDeletedLogs([...deletedLogs, deletedLog]);
  };
  const handleDeleteLog = (id) => {
    const updatedLogs = deletedLogs.filter((log) => log.id !== id);
    setDeletedLogs(updatedLogs);
  };

  // ...

  {
    deletedLogs.map((log) => (
      <li key={log.id}>
        {log.task && log.date && `${log.task} - ${log.date}`}
        <button onClick={() => handleDelete(log.id)}>delete</button>
      </li>
    ));
  }

  return (
    <div className="crud-container">
      <form onSubmit={handleSubmit} className="form-container">
        <label htmlFor="newTask" className="label-container"></label>
        <input
          type="text"
          id="newTask"
          value={newTask}
          onChange={handleTaskChange}
          className="input-container"
          placeholder="Add New Task"
        />
        <button type="submit" className="button-container">
          Add Task
        </button>
      </form>
      <ul className="task-list">
        {tasks.slice().reverse().map((task, index) => (
          <>
            <li
              key={task.id}
              className="task-item"
              style={{ backgroundColor: task.backgroundColor }}
            >
              {task.task}
            </li>
            <button
              className="button-container1"
              onClick={() => handleDelete(task.id)}
            >
              delete
            </button>

            <button
              className="button-containeredit"
              onClick={() => handleEdit(task, index)}
            >
              edit
            </button>
          </>
        ))}
      </ul>
     
      <div style={{ display: "flex", position: "absolute", top: "0px", backgroundColor:"#e7e9e7", padding:'1.2rem', borderRadius:'20px', margin:'0.3rem'}}>
        <div style={{ marginRight: "3rem" }}>
          <button
            className="button-containerr"
            onClick={() => setShowLogs(!showLogs)}
          >
            {deletedLogs.length} | deleted logs
          </button>
          {showLogs && (
            <ul className="log-list">
              {deletedLogs.slice().reverse().map((log) => (
                <li key={log.id}>
                  {log.task && log.date && `${log.task} - ${log.date}`}
                  <button onClick={() => handleDeleteLog(log.id)}>
                    delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={{ marginRight: "3rem" }}>
          <button
            className="button-containerp"
            // onClick={() => setShowInLogs(!showInLogs)}
          >
            {insertedLogs.length} | inserted logs
          </button>

          {/* {showInLogs && (
          <ul className="log-list">
            {insertedLogs.map((log) => (
              <li key={log.id}>
                {log.task} - {log.date}
              </li>
            ))}
          </ul>
        )} */}
        </div>
        <div style={{ marginRight: "3rem" }}>
          <button
            className="button-containerb"
            onClick={() => setShowUpLogs(!showUpLogs)}
          >
            {editedLogs.length} | edited logs
          </button>
          {showUpLogs && (
          <ul className="log-list" style={{overflowY:"auto", maxHeight:"100px"}}>
            {editedLogs.slice().reverse().map((log) => (
               <li key={log.id}>
              Previous Value: "{log.previousValue}" Updated Value: "{log.updatedValue}" : "{log.date}"
             </li>
            ))}
          </ul>
        )}
        </div>
        <div>
          <button
            className="button-containerg"
            onClick={() => setShowInLogs(!showInLogs)}
          >
            {insertedLogs.length} | inserted logs
          </button>

          {showInLogs && (
            <ul className="log-list">
              {insertedLogs.map((log) => (
                <li key={log.id}>
                  {log.task} - {log.date}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      </div>
    
  );
};

export default Crud;

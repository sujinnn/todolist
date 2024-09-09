import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [isLoading, data] = useFetch("http://localhost:3000/todo");
  const [todo, setTodo] = useState([]);

  useEffect(() => {
    if (data) setTodo(data);
  }, [isLoading]);

  return (
    <>
      <Advice />
      <Clock />

      <TodoInput setTodo={setTodo} />
      <TodoList todo={todo} setTodo={setTodo} />
    </>
  );
}

const useFetch = (url) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setIsLoading(false);
      });
  }, [url]);
  return [isLoading, data];
};

//랜덤 명언 출력
const Advice = () => {
  const [isLoading, data] = useFetch(
    "https://korean-advice-open-api.vercel.app/api/advice"
  );
  return (
    <>
      {!isLoading && (
        <>
          <div>{data.message}</div>
          <div>-{data.author}-</div>
        </>
      )}
    </>
  );
};

// 현재 시간 표시
const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    }, 1000);
  }, []);

  return <div>{time.toLocaleTimeString()}</div>;
};

// 할 일 입력
const TodoInput = ({ setTodo }) => {
  const inputRef = useRef(null);
  const addTodo = () => {
    const newTodo = {
      // id: Number(new Date()),
      content: inputRef.current.value,
    };
    fetch("http://localhost:3000/todo", {
      method: "POST",
      body: JSON.stringify(newTodo),
    })
      .then((res) => res.json())
      .then((res) => {
        setTodo((prev) => [...prev, res]);
      });
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={addTodo}>추가</button>
    </>
  );
};

// 할 일 여러 개
const TodoList = ({ todo, setTodo }) => {
  return (
    <ul>
      {todo.map((el) => (
        <Todo key={el.id} todo={el} setTodo={setTodo} />
      ))}
    </ul>
  );
};

// 할 일 하나
const Todo = ({ todo, setTodo }) => {
  return (
    <>
      <li>
        {todo.content}
        <button
          onClick={() => {
            fetch(`http://localhost:3000/todo/${todo.id}`, {
              method: "DELETE",
            }).then((res) => {
              if (res.ok) {
                setTodo((prev) => prev.filter((el) => el.id !== todo.id));
              }
            });
          }}
        >
          삭제
        </button>
      </li>
    </>
  );
};

export default App;

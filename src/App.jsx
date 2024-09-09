import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [todo, setTodo] = useState([
    {
      id: Number(new Date()),
      content: "Hi",
    },
  ]);

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
      id: Number(new Date()),
      content: inputRef.current.value,
    };
    setTodo((prev) => [...prev, newTodo]);
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
            setTodo((prev) => prev.filter((el) => el.id !== todo.id));
          }}
        >
          삭제
        </button>
      </li>
    </>
  );
};

export default App;

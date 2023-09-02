import {
  useContext, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';

import { DispatchContext, TodoContext } from '../context/TodoContext';
import { TodoList } from './TodoList';
import { Todo } from '../types/Todo';

function filterTodos(todos: Todo[], completed: boolean): Todo[] {
  return todos.filter(todo => todo.completed === completed);
}

export const TodoApp: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const { todos } = useContext(TodoContext);
  const [filteredTodos, setFilteredTodos] = useState(todos);
  const [filterStatus, setFilteredStatus] = useState('all');
  const [toggleAll, setToggleAll] = useState(false);

  const input = useRef<HTMLInputElement>(null);

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();

    if (input.current === null) {
      return;
    }

    const { value } = input.current;

    if (!value.trim()) {
      return;
    }

    dispatch({
      type: 'add',
      payload: {
        id: +new Date(),
        title: value,
        completed: false,
      },
    });

    input.current.value = '';
  };

  const handleClear = () => {
    dispatch({ type: 'clear' });
  };

  useEffect(() => {
    const isNotCompleted = todos.find(todo => !todo.completed);

    if (!isNotCompleted) {
      setToggleAll(false);
    } else {
      setToggleAll(true);
    }

    if (filterStatus === 'active') {
      setFilteredTodos(filterTodos(todos, false));
    } else if (filterStatus === 'completed') {
      setFilteredTodos(filterTodos(todos, true));
    } else {
      setFilteredTodos(todos);
    }
  }, [todos, filterStatus]);

  return (
    <div className="todoapp">
      <header className="header">
        <h1>todos</h1>

        <form onSubmit={handleAdd}>
          <input
            type="text"
            data-cy="createTodo"
            className="new-todo"
            placeholder="What needs to be done?"
            ref={input}
          />
        </form>
      </header>

      <section className="main">
        <input
          type="checkbox"
          id="toggle-all"
          className="toggle-all"
          data-cy="toggleAll"
          checked={!toggleAll}
          onChange={() => {
            setToggleAll(toggleAll);
            dispatch({ type: 'toggleAll', payload: toggleAll });
          }}
        />
        <label
          htmlFor="toggle-all"
          style={{
            display: todos.length ? 'block' : 'none',
          }}
        >
          Mark all as complete
        </label>

        <TodoList items={filteredTodos} />
      </section>

      <footer
        className="footer"
        style={{
          display: todos.length ? 'block' : 'none',
        }}
      >
        <span className="todo-count" data-cy="todosCounter">
          {(todos.filter(todo => !todo.completed)).length}
          {' '}
          items left
        </span>

        <ul className="filters">
          <li>
            <a
              href="#/"
              className={cn({ selected: filterStatus === 'all' })}
              onClick={() => {
                setFilteredStatus('all');
              }}
            >
              All
            </a>
          </li>

          <li>
            <a
              href="#/active"
              className={cn({ selected: filterStatus === 'active' })}
              onClick={() => {
                setFilteredStatus('active');
              }}
            >
              Active
            </a>
          </li>

          <li>
            <a
              href="#/completed"
              className={cn({ selected: filterStatus === 'completed' })}
              onClick={() => {
                setFilteredStatus('completed');
              }}
            >
              Completed
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="clear-completed"
          onClick={handleClear}
        >
          Clear completed
        </button>
      </footer>
    </div>
  );
};

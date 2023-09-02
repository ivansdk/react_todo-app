import React, { useEffect, useReducer } from 'react';
import { Todo } from '../types/Todo';
import { useLocalStorage } from '../hooks/useLocalStorage';

type Actions = { type: 'add', payload: Todo }
| { type: 'toggle', payload: number }
| { type: 'delete', payload: number }
| { type: 'edit', payload: Todo }
| { type: 'clear' }
| { type: 'toggleAll', payload: boolean };

type State = {
  todos: Todo[];
};

function reducer(state: State, action: Actions): State {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };

    case 'toggle':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.payload) {
            todo.completed = !todo.completed;
          }

          return todo;
        }),
      };

    case 'delete':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };

    case 'edit':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.payload.id) {
            todo.title = action.payload.title;
          }

          return todo;
        }),
      };

    case 'clear':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed),
      };

    case 'toggleAll':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (action.payload) {
            todo.completed = true;
          } else {
            todo.completed = false;
          }

          return todo;
        }),
      };

    default:
      return state;
  }
}

const initialState: State = {
  todos: [],
};

export const TodoContext = React.createContext(initialState);
export const DispatchContext = React.createContext((action: Actions) => {
  action;
});

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [value, setValue] = useLocalStorage<Todo[]>('todos', []);
  const [state, dispatch] = useReducer(reducer, { todos: value });

  useEffect(() => {
    setValue(state.todos);
  }, [state.todos]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <TodoContext.Provider value={state}>
        {children}
      </TodoContext.Provider>
    </DispatchContext.Provider>
  );
};

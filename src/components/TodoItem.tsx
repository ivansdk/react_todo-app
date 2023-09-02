import cn from 'classnames';

import { useContext, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { DispatchContext } from '../context/TodoContext';

type Props = {
  item: Todo;
};

export const TodoItem: React.FC<Props> = ({ item }) => {
  const dispatch = useContext(DispatchContext);
  const [inputValue] = useState(item.title);

  const handleToggle = () => {
    dispatch({ type: 'toggle', payload: item.id });
  };

  const handleDelete = () => {
    dispatch({ type: 'delete', payload: item.id });
  };

  const currentInput = useRef<HTMLInputElement>(null);

  const handleEdit = (
    event: React.MouseEvent<HTMLLabelElement, MouseEvent>,
  ) => {
    const label = event.target as HTMLLabelElement;
    const listItem = label.closest('li');

    if (listItem && currentInput.current) {
      listItem.classList.add('editing');
      currentInput.current.focus();
    }
  };

  const handleUpdate = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    const { target } = event;

    if (key === 'Enter' || key === 'Escape') {
      if (key === 'Enter' && target.value) {
        dispatch({ type: 'edit', payload: { ...item, title: target.value } });
      } else if (!target.value) {
        dispatch({ type: 'delete', payload: item.id });
      }

      const listItem = target.closest('li');

      if (listItem) {
        listItem.classList.remove('editing');
      }
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    const { target } = event;

    if (target.value) {
      dispatch({ type: 'edit', payload: { ...item, title: target.value } });
    } else {
      dispatch({ type: 'delete', payload: item.id });
    }

    const listItem = target.closest('li');

    if (listItem) {
      listItem.classList.remove('editing');
    }
  };

  return (
    <li
      className={cn({
        completed: item.completed,
      })}
      data-id={item.id}
    >
      <div className="view">
        <input
          type="checkbox"
          checked={item.completed}
          className="toggle"
          id="toggle-view"
          onChange={handleToggle}
        />
        <label onDoubleClick={handleEdit}>{item.title}</label>
        <button
          type="button"
          className="destroy"
          data-cy="deleteTodo"
          onClick={handleDelete}
        />
      </div>
      <input
        type="text"
        className="edit"
        ref={currentInput}
        defaultValue={inputValue}
        onKeyDown={handleUpdate}
        onBlur={handleBlur}
      />
    </li>
  );
};

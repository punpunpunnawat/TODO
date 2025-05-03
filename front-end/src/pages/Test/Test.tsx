// /pages/Test.tsx
import React, { useEffect } from 'react';

import useTaskContext from '../../hooks/useTask/useTask';

const Test = () => {
  const { tasks, loading, error } = useTaskContext(); // access context data and methods



  return (
    <div>
      <h1>Test Page</h1>

      {/* Loading and error handling */}
      {loading && <p>Loading tasks...</p>}
      {error && <p>{error}</p>}

      {/* Display tasks */}
      <ul>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id}>
              {task.label}
            </li>
          ))
        ) : (
          <p>No tasks available.</p>
        )}
      </ul>
    </div>
  );
};

export default Test;

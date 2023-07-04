import React from 'react'

export default function ClearComponentBtn({clearCompleted}) {
  return (
    <div>
    <button className="button" onClick={clearCompleted}>Clear completed</button>
  </div>
  )
}

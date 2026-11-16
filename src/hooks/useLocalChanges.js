import { useState } from "react";

function useLocalChanges() {
  const [added, setAdded] = useState([]);
  const [updated, setUpdated] = useState({});
  const [deletedIds, setDeletedIds] = useState([]);

  function applyChanges(items) {
    return items
      .filter((item) => !deletedIds.includes(item.id))
      .map((item) => updated[item.id] || item);
  }

  function addItem(item) {
    setAdded((previous) => [{ ...item, isLocal: true }, ...previous]);
  }

  function updateItem(item) {
    if (item.isLocal) {
      setAdded((previous) =>
        previous.map((existing) => (existing.id === item.id ? item : existing))
      );
    } else {
      setUpdated((previous) => ({ ...previous, [item.id]: item }));
    }
  }

  function removeItem(item) {
    if (item.isLocal) {
      setAdded((previous) => previous.filter((existing) => existing.id !== item.id));
    } else {
      setDeletedIds((previous) => [...previous, item.id]);
    }
  }

  return {
    added,
    applyChanges,
    addItem,
    updateItem,
    removeItem,
    deletedCount: deletedIds.length,
  };
}

export default useLocalChanges;
export const addRow = (setRowId: React.Dispatch<React.SetStateAction<number[]>>, onAddRow: () => void) => {
    setRowId((prevRowId) => [...prevRowId, prevRowId.length + 1]);
    onAddRow();
};
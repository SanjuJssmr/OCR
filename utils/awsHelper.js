
const getText = (result, blocksMap) => {
    let text = '';
    try {
        if (result.Relationships) {
            for (const relationship of result.Relationships) {
                if (relationship.Type === 'CHILD') {
                    for (const childId of relationship.Ids) {
                        const word = blocksMap[childId];
                        text += word.BlockType === 'WORD' ? word.Text + ' ' :
                            word.BlockType === 'SELECTION_ELEMENT' && word.SelectionStatus === 'SELECTED' ? 'X ' : '';
                    }
                }
            }
            return text;
        }
    } catch (err) {
        console.error(err);
    }
}

const getRowsColumnsMap = (tableResult, blocksMap) => {
    const rows = {};
    try {
        for (const relationship of tableResult.Relationships) {
            if (relationship.Type === 'CHILD') {
                for (const childId of relationship.Ids) {
                    const cell = blocksMap[childId];
                    if (cell.BlockType === 'CELL') {
                        const rowIndex = cell.RowIndex;
                        const colIndex = cell.ColumnIndex;

                        if (!rows[rowIndex]) {
                            rows[rowIndex] = {};
                        }

                        rows[rowIndex][colIndex] = getText(cell, blocksMap);
                    }
                }
            }
            return rows;
        }
    } catch (err) {
        console.error(err);
    }
}

const getTables = (data) => {
    const blocksMap = {};
    const tableBlocks = data.Blocks.filter(block => {
        blocksMap[block.Id] = block;
        return block.BlockType === 'TABLE';
    });
    return tableBlocks.map(table => getRowsColumnsMap(table, blocksMap));
};

export {getTables}
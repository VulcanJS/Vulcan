/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';

const TableComponent = ({ theme }) => class Table extends Component {
  constructor(props) {
    super();
    this.state = {
      rows: props.blockProps.entityData.rows || [[]],
      numberOfColumns: props.blockProps.entityData.numberOfColumns || 1,
      focusedEdit: null
    };
  }

  componentDidMount() {
    const { addActions } = this.props;
    if (addActions) {
      addActions([{
        button: <span>+ Row</span>,
        label: 'Add a row',
        active: false,
        toggle: () => this.addRow(),
      }, {
        button: <span>+ Column</span>,
        label: 'Add a column',
        active: false,
        toggle: () => this.addColumn(),
      }]);
    }
  }

  setFocus = (row, column) => {
    this.props.setFocus();
    this.setState({ focusedEdit: { row, column } });
  }

  addRow = () => {
    const { setEntityData } = this.props.blockProps;
    const { rows } = this.state;
    const newRows = [...rows, []];
    setEntityData({ rows: newRows });
    this.setState({ rows: newRows });
  }

  addColumn = () => {
    const { setEntityData } = this.props.blockProps;
    const { numberOfColumns } = this.state;
    const newNumberOfColumns = (numberOfColumns || 1) + 1;
    setEntityData({ numberOfColumns: newNumberOfColumns });
    this.setState({ numberOfColumns: newNumberOfColumns });
  }

  updateEntityData = (editorState, row, column) => {
    const { setEntityData } = this.props.blockProps;
    const { rows, numberOfColumns } = this.state;
    const newRows = rows || [{}];
    while (newRows[row].length < (numberOfColumns || 1)) {
      newRows[row].push(null);
    }
    newRows[row][column] = editorState;
    setEntityData({ rows: newRows });
    this.setState({ rows: newRows });
  }

  render() {
    const { rows, numberOfColumns, focusedEdit } = this.state;
    const { style, className, blockProps } = this.props;
    const { isFocused, renderNestedEditor } = blockProps;

    const classNames = [className, theme.table].filter((p) => p);

    return (
      <table className={classNames.join(' ')} cellSpacing="0" style={style}>
        <tbody>
          {rows.map((row, rowI) =>
            <tr key={rowI}>
              {Array.from(new Array(numberOfColumns), (x, i) => i).map((column, columnI) =>
                <td key={columnI}>{renderNestedEditor({
                  block: this,
                  editorState: row[columnI],
                  onChange: (editorState) => this.updateEntityData(editorState, rowI, columnI),
                  setFocus: () => this.setFocus(rowI, columnI),
                  active: isFocused && focusedEdit && focusedEdit.row === rowI && focusedEdit.column === columnI
                })}</td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    );
  }
};

export default TableComponent;
